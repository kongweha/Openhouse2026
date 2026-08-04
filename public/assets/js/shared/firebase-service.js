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
    if (!/^[5-7]\d{9}$/.test(studentId)) {
      fail(
        "INVALID_STUDENT_ID",
        "Invalid student ID.",
      );
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

  function normalizeEducationLevel(value) {
    const educationLevel = String(value ?? "").trim();
    if (!["bachelor", "master", "doctorate"].includes(educationLevel)) {
      fail(
        "INVALID_EDUCATION_LEVEL",
        "Education level must be bachelor, master, or doctorate.",
      );
    }
    return educationLevel;
  }

  function createSessionToken() {
    if (typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    const values = new Uint32Array(4);
    window.crypto.getRandomValues(values);
    return [...values]
      .map((value) => value.toString(16).padStart(8, "0"))
      .join("");
  }

  function assertActiveSession(user, sessionToken) {
    if (
      !sessionToken ||
      user?.activeSession?.token !== String(sessionToken)
    ) {
      fail("SESSION_REPLACED", "This session is no longer active.");
    }
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
      activityEvaluation: user.activityEvaluation ?? null,
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

  function normalizeActivityEvaluation(value) {
    if (!value || typeof value !== "object") {
      fail("ACTIVITY_EVALUATION_REQUIRED", "Activity evaluation is required.");
    }
    const categoryKeys = [
      "activityFormat",
      "venue",
      "duration",
      "reward",
      "overall",
    ];
    const categoryRatings = Object.fromEntries(
      categoryKeys.map((key) => [
        key,
        assertRating(
          value.categoryRatings?.[key],
          "INVALID_ACTIVITY_CATEGORY_RATING",
        ),
      ]),
    );
    const favoriteStationId = Number(value.favoriteStationId);
    if (!Number.isInteger(favoriteStationId) || !stations[favoriteStationId]) {
      fail("INVALID_FAVORITE_STATION", "Favorite station is invalid.");
    }
    const impressionFeedback = String(
      value.impressionFeedback ?? value.suggestion ?? "",
    ).trim();
    if (impressionFeedback.length > 1000) {
      fail("FEEDBACK_TOO_LONG", "Feedback must not exceed 1000 characters.");
    }
    const desiredLibraryServices = String(
      value.desiredLibraryServices ?? "",
    ).trim();
    if (desiredLibraryServices.length > 1000) {
      fail(
        "DESIRED_SERVICES_TOO_LONG",
        "Desired library services must not exceed 1000 characters.",
      );
    }
    return {
      categoryRatings,
      favoriteStationId,
      impressionFeedback,
      desiredLibraryServices,
    };
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

  async function transactionFromServerSnapshot(
    reference,
    update,
    prefetchedSnapshot,
  ) {
    const snapshot =
      prefetchedSnapshot ?? (await reference.once("value"));
    const serverValue = snapshot.val();
    let isFirstUpdate = true;

    return reference.transaction((localValue) => {
      const currentValue =
        isFirstUpdate && localValue == null
          ? serverValue
          : localValue;
      isFirstUpdate = false;
      return update(currentValue);
    });
  }

  async function register(
    studentIdValue,
    hasVisitedValue,
    educationLevelValue,
  ) {
    const studentId = normalizeStudentId(studentIdValue);
    const hasVisitedOpenHouse =
      normalizeVisitedFlag(hasVisitedValue);
    const educationLevel = normalizeEducationLevel(educationLevelValue);
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
      return { created: false };
    }

    const users = usersSnapshot.val() ?? {};
    const availableCodes = Object.keys(users)
      .filter((code) => /^\d+$/.test(code))
      .sort((left, right) => Number(left) - Number(right))
      .filter((code) => isUnusedParticipant(users[code]));

    for (const accessCode of availableCodes) {
      const userReference = db.ref(`users/${accessCode}`);
      // A transaction updater can run before this child path is present in the
      // local cache, even when its parent collection was just read. Load the
      // exact candidate first so `null` is not mistaken for a missing code.
      const candidateSnapshot = await userReference.once("value");
      const candidateUser = candidateSnapshot.val();
      if (!isUnusedParticipant(candidateUser)) continue;

      const claim = await transactionFromServerSnapshot(
        userReference,
        (user) => {
          if (!isUnusedParticipant(user)) return;
          return {
            ...user,
            registration: {
              studentId,
              hasVisitedOpenHouse,
              educationLevel,
              registeredAt,
            },
          };
        },
        candidateSnapshot,
      );
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
              educationLevel,
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
        return { created: false };
      }

      return { accessCode, created: true };
    }

    fail(
      "NO_AVAILABLE_CODES",
      "No unused participant code is available.",
    );
  }

  async function login(accessCodeValue) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const sessionToken = createSessionToken();
    const sessionStartedAt = Date.now();
    const userReference = db.ref(`users/${accessCode}`);
    const transaction = await transactionFromServerSnapshot(
      userReference,
      (user) => {
        if (!user?.registration?.studentId) return;
        user.loginTime ??= Date.now();
        user.activeSession = {
          token: sessionToken,
          startedAt: sessionStartedAt,
        };
        return user;
      },
    );
    if (!transaction.committed) {
      fail("CODE_NOT_REGISTERED", "Participant code is not registered.");
    }
    return {
      sessionToken,
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
    sessionToken,
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
    const userReference = db.ref(`users/${accessCode}`);
    const transaction = await transactionFromServerSnapshot(
      userReference,
      (user) => {
        if (!user?.registration?.studentId || user.isRedeemed) return;
        assertActiveSession(user, sessionToken);
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
      },
    );
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

  async function submitFinalIntention(
    accessCodeValue,
    sessionToken,
    ratingValue,
  ) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const finalIntentionRating = assertRating(
      ratingValue,
      "INVALID_FINAL_INTENTION_RATING",
    );
    const userReference = db.ref(`users/${accessCode}`);
    const transaction = await transactionFromServerSnapshot(
      userReference,
      (user) => {
        if (!user?.registration?.studentId) return;
        assertActiveSession(user, sessionToken);
        if (stationValues(user).filter(Boolean).length !== stations.length) {
          return;
        }
        if (!user.isRedeemed) {
          user.finalIntentionRating = finalIntentionRating;
        }
        return user;
      },
    );
    if (!transaction.committed) {
      fail(
        "FINAL_INTENTION_NOT_READY",
        "All stations must be complete before this assessment.",
      );
    }
    return {
      participant: sanitizeParticipant(
        accessCode,
        transaction.snapshot.val(),
      ),
    };
  }

  async function submitEvaluation(
    accessCodeValue,
    sessionToken,
    activityEvaluationValue,
  ) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const activityEvaluation = normalizeActivityEvaluation(
      activityEvaluationValue,
    );
    const userReference = db.ref(`users/${accessCode}`);
    const transaction = await transactionFromServerSnapshot(
      userReference,
      (user) => {
        if (!user?.registration?.studentId) return;
        assertActiveSession(user, sessionToken);
        if (stationValues(user).filter(Boolean).length !== stations.length) {
          return;
        }
        if (!user.finalIntentionRating) return;
        if (user.isRedeemed) return user;
        user.activityEvaluation = {
          ...activityEvaluation,
          submittedAt: Date.now(),
        };
        return user;
      },
    );
    if (!transaction.committed) {
      fail(
        "EVALUATION_NOT_READY",
        "All stations must be complete before evaluation.",
      );
    }
    return {
      participant: sanitizeParticipant(
        accessCode,
        transaction.snapshot.val(),
      ),
    };
  }

  async function confirmReward(accessCodeValue, sessionToken) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const userReference = db.ref(`users/${accessCode}`);
    const transaction = await transactionFromServerSnapshot(
      userReference,
      (user) => {
        if (!user?.registration?.studentId) return;
        assertActiveSession(user, sessionToken);
        if (
          stationValues(user).filter(Boolean).length !== stations.length ||
          !user.finalIntentionRating ||
          !user.activityEvaluation
        ) {
          return;
        }
        if (!user.isRedeemed) {
          user.redeemTime = Date.now();
          user.isRedeemed = true;
        }
        return user;
      },
    );
    if (!transaction.committed) {
      fail(
        "REWARD_NOT_READY",
        "Evaluation must be complete before reward confirmation.",
      );
    }
    return {
      participant: sanitizeParticipant(
        accessCode,
        transaction.snapshot.val(),
      ),
    };
  }

  async function draw(accessCodeValue, sessionToken) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const userReference = db.ref(`users/${accessCode}`);
    const transaction = await transactionFromServerSnapshot(
      userReference,
      (user) => {
        if (!user?.registration?.studentId || !user.isRedeemed) return;
        assertActiveSession(user, sessionToken);
        user.drawnCardId ??=
          Math.floor(Math.random() * config.destinyCards.length) + 1;
        return user;
      },
    );
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

  async function logout(accessCodeValue, sessionToken) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const userReference = db.ref(`users/${accessCode}`);
    await transactionFromServerSnapshot(userReference, (user) => {
      if (!user || user.activeSession?.token !== String(sessionToken)) {
        return user;
      }
      const updatedUser = { ...user };
      delete updatedUser.activeSession;
      return updatedUser;
    });
    return { loggedOut: true };
  }

  async function watchSession(accessCodeValue, sessionToken, onReplaced) {
    const accessCode = normalizeAccessCode(accessCodeValue);
    const expectedToken = String(sessionToken ?? "");
    const sessionReference = db.ref(
      `users/${accessCode}/activeSession/token`,
    );
    const initialSnapshot = await sessionReference.once("value");
    if (initialSnapshot.val() !== expectedToken) {
      onReplaced();
      return () => {};
    }

    const handler = (snapshot) => {
      if (snapshot.val() !== expectedToken) onReplaced();
    };
    sessionReference.on("value", handler);
    return () => sessionReference.off("value", handler);
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
    registration: Object.freeze({ register }),
    participant: Object.freeze({
      login,
      get: getParticipant,
      completeStation,
      submitFinalIntention,
      submitEvaluation,
      confirmReward,
      draw,
      logout,
      watchSession,
    }),
    admin: Object.freeze({ getUsers, resetCodes, clearUsers }),
  });
})();
