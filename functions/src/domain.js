"use strict";

const { EVENT_CONFIG } = require("./event-config");

class DomainError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.status = status;
  }
}

function normalizeStudentId(value) {
  const studentId = String(value ?? "").trim();
  if (!EVENT_CONFIG.studentIdPattern.test(studentId)) {
    throw new DomainError(
      "INVALID_STUDENT_ID",
      "Student ID must contain exactly 10 digits.",
    );
  }
  return studentId;
}

function normalizeAccessCode(value) {
  const accessCode = String(value ?? "").trim();
  const pattern = new RegExp(
    `^\\d{${EVENT_CONFIG.participantCodeLength}}$`,
  );
  if (!pattern.test(accessCode)) {
    throw new DomainError(
      "INVALID_ACCESS_CODE",
      `Access code must contain exactly ${EVENT_CONFIG.participantCodeLength} digits.`,
    );
  }
  return accessCode;
}

function normalizeVisitedFlag(value) {
  if (value === true || value === "yes") {
    return true;
  }
  if (value === false || value === "no") {
    return false;
  }
  throw new DomainError(
    "INVALID_VISIT_HISTORY",
    "Visit history must be yes or no.",
  );
}

function isUnusedParticipant(user) {
  if (!user || typeof user !== "object") {
    return false;
  }
  const stations = Array.isArray(user.stations)
    ? user.stations
    : Object.values(user.stations ?? {});
  return (
    !user.registration?.studentId &&
    !user.loginTime &&
    !user.redeemTime &&
    !user.isRedeemed &&
    !stations.some((station) => station === true)
  );
}

function allocateRegistration(rootValue, input) {
  const studentId = normalizeStudentId(input.studentId);
  const hasVisitedOpenHouse = normalizeVisitedFlag(
    input.hasVisitedOpenHouse,
  );
  const registeredAt = Number(input.registeredAt);
  if (!Number.isSafeInteger(registeredAt) || registeredAt <= 0) {
    throw new DomainError("INVALID_TIMESTAMP", "Invalid registration time.");
  }

  const root = structuredClone(rootValue ?? {});
  root.users ??= {};
  root.studentRegistrations ??= {};

  const existing = root.studentRegistrations[studentId];
  if (existing?.accessCode) {
    return {
      root,
      result: {
        accessCode: normalizeAccessCode(existing.accessCode),
        created: false,
      },
    };
  }

  const accessCode = Object.keys(root.users)
    .filter((code) => /^\d+$/.test(code))
    .sort((left, right) => Number(left) - Number(right))
    .find((code) => isUnusedParticipant(root.users[code]));

  if (!accessCode) {
    throw new DomainError(
      "NO_AVAILABLE_CODES",
      "No unused participant code is available.",
      409,
    );
  }

  const registration = {
    studentId,
    accessCode,
    hasVisitedOpenHouse,
    registeredAt,
  };
  root.studentRegistrations[studentId] = registration;
  root.users[accessCode] = {
    ...root.users[accessCode],
    registration: {
      studentId,
      hasVisitedOpenHouse,
      registeredAt,
    },
  };

  return {
    root,
    result: { accessCode, created: true },
  };
}

function validateQrPayload(payload, stationId, now) {
  const station = EVENT_CONFIG.stations[stationId];
  if (!station) {
    throw new DomainError("INVALID_STATION", "Unknown station.");
  }

  const [qrCode, rawTimestamp, ...extra] = String(payload ?? "").split("|");
  const timestamp = Number(rawTimestamp);
  if (
    extra.length ||
    qrCode !== station.qrCode ||
    !Number.isSafeInteger(timestamp)
  ) {
    throw new DomainError("INVALID_QR", "Invalid QR payload.");
  }

  const age = now - timestamp;
  if (
    age > EVENT_CONFIG.qrMaxAgeMs ||
    age < -EVENT_CONFIG.qrAllowedFutureClockSkewMs
  ) {
    throw new DomainError("EXPIRED_QR", "QR payload has expired.", 409);
  }

  return { station, timestamp };
}

function sanitizeParticipant(accessCode, user) {
  if (!user || typeof user !== "object") {
    throw new DomainError("CODE_NOT_FOUND", "Participant code not found.", 404);
  }
  if (!user.registration?.studentId) {
    throw new DomainError(
      "CODE_NOT_REGISTERED",
      "Participant code has not been registered.",
      403,
    );
  }

  return {
    accessCode,
    stations: user.stations ?? Array(EVENT_CONFIG.stations.length).fill(false),
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
    throw new DomainError(code, "Rating must be an integer from 1 to 5.");
  }
  return rating;
}

module.exports = {
  DomainError,
  allocateRegistration,
  assertRating,
  isUnusedParticipant,
  normalizeAccessCode,
  normalizeStudentId,
  normalizeVisitedFlag,
  sanitizeParticipant,
  validateQrPayload,
};
