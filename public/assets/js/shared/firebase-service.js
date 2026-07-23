(() => {
  "use strict";

  const config = window.OpenHouseConfig;
  const db = window.openHouseDb;
  const stations = config.stations;

  class FirebaseServiceError extends Error {
    constructor(code, message) {
      super(message);
      this.name = "FirebaseServiceError";
      this.code = code;
    }
  }

  function fail(code, message) {
    throw new FirebaseServiceError(code, message);
  }

  function normalizeStudentId(value) {
    const studentId = String(value ?? "").trim();
    if (!/^\d{10}$/.test(studentId)) {
      fail("INVALID_STUDENT_ID", "Student ID must contain 10 digits.");
    }
    return studentId;
  }

  function normalizeAccessCode(value) {
    const accessCode = String(value ?? "").trim();
    const pattern = new RegExp(
      `^\\d{${config.participants.codeLength}}$`,
    );
    if (!pattern.test(accessCode)) {
      fail(
        "INVALID_ACCESS_CODE",
        `Access code must contain ${config.participants.codeLength} digits.`,
      );
    }
    return accessCode;
  }

  function normalizeVisitedFlag(value) {
    if (value === true || value === "yes") return true;
    if (value === false || value === "no") return false;
    fail("INVALID_VISIT_HISTORY", "Visit history must be yes or no.");
  }

  function stationValues(user) {
    return Array.isArray(user?.stations)
      ? user.stations
      : Object.values(user?.stations ?? {});
  }

  function isUnusedParticipant(user) {
    return Boolean(
      user &&
        typeof user === "object" &&
        !user.registration?.studentId &&
        !user.loginTime &&
        !user.redeemTime &&
        !user.isRedeemed &&
        !stationValues(user).some((value) => value === true),
    );
  }

  function sanitizeParticipant(accessCode, user) {
    if (!user || typeof user !== "object") {
      fail("CODE_NOT_FOUND", "Participant code was not found.");
    }
    if (!user.registration?.studentId) {
      fail("CODE_NOT_REGISTERED", "Participant code is not registered.");
    }
    return {
      accessCode,
      stations:
        user.stations ?? Array(stations.length).fill(false),
      isRedeemed: Boolean(user.isRedeemed),
      loginTime: user.loginTime ?? null,
      redeemTime: user.redeemTime ?? null,
      ratings: user.ratings ?? {},
      scanHistory: user.scanHistory ?? {},
      finalIntentionRating: user.finalIntentionRating ?? null,
      drawnCardId: user.drawnCardId ?? null,
    };
  }

  function assertRating(value, code = "INVALID_RATING") {
    const rating = Number(value);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      fail(code, "Rating must be an integer from 1 to 5.");
    }
    return rating;
  }

  function validateQrPayload(payload, stationId) {
    const station = stations[stationId];
    if (!station) fail("INVALID_STATION", "Unknown station.");
    const [qrCode, rawTimestamp, ...extra] =
      String(payload ?? "").split("|");
    const timestamp = Number(rawTimestamp);
    if (
      extra.length ||
      qrCode !== station.qrCode ||
      !Number.isSafeInteger(timestamp)
    ) {
      fail("INVALID_QR", "Invalid QR payload.");
    }
    const age = Date.now() - timestamp;
    if (
      age > config.qr.maxAgeMs ||
      age < -config.qr.allowedFutureClockSkewMs
    ) {
      fail("EXPIRED_QR", "QR payload has expired.");
    }
    return station;
  }

  function randomAccessCode() {
    const minimum = 10 ** (config.participants.codeLength - 1);
    const range = minimum * 9;
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return String(minimum + (values[0] % range));
  }

  async function register(studentIdValue, hasVisitedValue) {
    const studentId = normalizeStudentId(studentIdValue);
    const hasVisitedOpenHouse =
      normalizeVisitedFlag(hasVisitedValue);
    const registeredAt = Date.now();
    const registrationReference = db.ref(
      `studentRegistrations/${studentId}`,
    );
    const usersReference = db.ref("users");
    const [existingSnapshot, usersSnapshot] = await Promise.all([
      registrationReference.once("value"),
      usersReference.once("value"),
    ]);
    const existing = existingSnapshot.val();
    if (existing?.accessCode) {
      return {
        accessCode: normalizeAccessCode(existing.accessCode),
        created: false,
      };
    }

    const users = usersSnapshot.val() ?? {};
    const availableCodes = Object.keys(users)
      .filter((code) => /^\d+$/.test(code))
      .sort((left, right) => Number(left) - Number(right))
      .filter((code) => isUnusedParticipant(users[code]));

    for (const accessCode of availableCodes) {
      const userReference = db.ref(`users/${accessCode}`);
      const claim = await userReference.transaction((user) => {
        if (!isUnusedParticipant(user)) return;
        return {
          ...user,
          registration: {
            studentId,
            hasVisitedOpenHouse,
            registeredAt,
          },
        };
      });
      if (!claim.committed) continue;

      const releaseClaim = () =>
        userReference.transaction((user) => {
          if (user?.registration?.studentId !== studentId) return;
          const releasedUser = { ...user };
          delete releasedUser.registration;
          return releasedUser;
        });

      let mapping;
      try {
        mapping = await registrationReference.transaction(
          (currentRegistration) => {
            if (currentRegistration?.accessCode) {
              return currentRegistration;
            }
            return {
              studentId,
              accessCode,
              hasVisitedOpenHouse,
              registeredAt,
            };
          },
        );
      } catch (error) {
        await releaseClaim();
        throw error;
      }

      const assignedAccessCode = mapping.snapshot.val()?.accessCode;
      if (!mapping.committed || !assignedAccessCode) {
        await releaseClaim();
        fail("REGISTRATION_CONFLICT", "Registration was not completed.");
      }

      const normalizedAssignedCode =
        normalizeAccessCode(assignedAccessCode);
      if (normalizedAssignedCode !== accessCode) {
        await releaseClaim();
        return {
          accessCode: normalizedAssignedCode,
          created: false,
        };
      }

      return { accessCode, created: true };
    }

    fail(
      "NO_AVAILABLE_CODES",
      "No unused participant code is available.",
    );
  }

  async function recover(studentIdValue) {
    const studentId = normalizeStudentId(studentIdValue);
    const snapshot = await db
      .ref(`studentRegistrations/${studentId}/accessCode`)
      .once("value");
    if (!snapshot.exists()) {
      fail(
        "REGISTRATION_NOT_FOUND",
        "No registration was found for this student ID.",
      );
    }
    return { accessCode: normalizeAccessCode(snapshot.val()) };
  }

  async function login(accessCodeValue) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const transaction = await db
      .ref(`users/${accessCode}`)
      .transaction((user) => {
        if (!user?.registration?.studentId) return;
        user.loginTime ??= Date.now();
        return user;
      });
    if (!transaction.committed) {
      fail("CODE_NOT_REGISTERED", "Participant code is not registered.");
    }
    return {
      participant: sanitizeParticipant(
        accessCode,
        transaction.snapshot.val(),
      ),
    };
  }

  async function getParticipant(accessCodeValue) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const snapshot = await db.ref(`users/${accessCode}`).once("value");
    return {
      participant: sanitizeParticipant(accessCode, snapshot.val()),
    };
  }

  async function completeStation(
    accessCodeValue,
    stationId,
    ratingValue,
    qrPayload,
  ) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const rating = assertRating(ratingValue);
    const station = validateQrPayload(qrPayload, stationId);
    const historyKey = db
      .ref(`users/${accessCode}/scanHistory`)
      .push().key;
    const scannedAt = Date.now();
    const transaction = await db
      .ref(`users/${accessCode}`)
      .transaction((user) => {
        if (!user?.registration?.studentId || user.isRedeemed) return;
        user.stations ??= Array(stations.length).fill(false);
        if (user.stations[stationId] === true) return user;
        user.stations[stationId] = true;
        user.ratings ??= {};
        user.ratings[stationId] = rating;
        user.scanHistory ??= {};
        user.scanHistory[historyKey] = {
          id: stationId,
          name: station.name,
          time: scannedAt,
        };
        return user;
      });
    if (!transaction.committed) {
      fail("STATION_UPDATE_REJECTED", "Station update was rejected.");
    }
    return {
      participant: sanitizeParticipant(
        accessCode,
        transaction.snapshot.val(),
      ),
    };
  }

  async function redeem(accessCodeValue, finalRatingValue) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const finalIntentionRating = assertRating(
      finalRatingValue,
      "INVALID_FINAL_RATING",
    );
    const transaction = await db
      .ref(`users/${accessCode}`)
      .transaction((user) => {
        if (!user?.registration?.studentId) return;
        if (stationValues(user).filter(Boolean).length !== stations.length) {
          return;
        }
        if (!user.isRedeemed) {
          user.finalIntentionRating = finalIntentionRating;
          user.redeemTime = Date.now();
          user.isRedeemed = true;
        }
        return user;
      });
    if (!transaction.committed) {
      fail(
        "REDEEM_NOT_READY",
        "All stations must be complete before redemption.",
      );
    }
    return {
      participant: sanitizeParticipant(
        accessCode,
        transaction.snapshot.val(),
      ),
    };
  }

  async function draw(accessCodeValue) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const transaction = await db
      .ref(`users/${accessCode}`)
      .transaction((user) => {
        if (!user?.registration?.studentId || !user.isRedeemed) return;
        user.drawnCardId ??=
          Math.floor(Math.random() * config.destinyCards.length) + 1;
        return user;
      });
    if (!transaction.committed) {
      fail("DRAW_NOT_READY", "Reward must be redeemed first.");
    }
    return {
      participant: sanitizeParticipant(
        accessCode,
        transaction.snapshot.val(),
      ),
    };
  }

  async function getUsers() {
    const snapshot = await db.ref("users").once("value");
    return { users: snapshot.val() ?? {} };
  }

  async function resetCodes() {
    const codes = new Set();
    while (codes.size < config.participants.generationCount) {
      codes.add(randomAccessCode());
    }
    const users = Object.fromEntries(
      [...codes].map((code) => [
        code,
        {
          stations: Array(stations.length).fill(false),
          isRedeemed: false,
        },
      ]),
    );
    await db.ref().update({
      users,
      studentRegistrations: null,
    });
    return { total: codes.size };
  }

  async function clearUsers() {
    await db.ref().update({
      users: null,
      studentRegistrations: null,
    });
    return { cleared: true };
  }

  window.OpenHouseApi = Object.freeze({
    FirebaseServiceError,
    registration: Object.freeze({ register, recover }),
    participant: Object.freeze({
      login,
      get: getParticipant,
      completeStation,
      redeem,
      draw,
    }),
    admin: Object.freeze({ getUsers, resetCodes, clearUsers }),
  });
})();
