"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DomainError,
  allocateRegistration,
  isUnusedParticipant,
  normalizeStudentId,
  validateQrPayload,
} = require("../src/domain");

test("normalizes a 10-digit student ID", () => {
  assert.equal(normalizeStudentId("  1234567890 "), "1234567890");
});

test("rejects an invalid student ID", () => {
  assert.throws(
    () => normalizeStudentId("123"),
    (error) =>
      error instanceof DomainError && error.code === "INVALID_STUDENT_ID",
  );
});

test("detects whether a participant code has never been used", () => {
  assert.equal(
    isUnusedParticipant({
      stations: [false, false, false, false, false, false, false],
      isRedeemed: false,
    }),
    true,
  );
  assert.equal(
    isUnusedParticipant({
      stations: [true, false, false, false, false, false, false],
    }),
    false,
  );
  assert.equal(isUnusedParticipant({ loginTime: 1 }), false);
});

test("allocates the numerically first unused code and links both indexes", () => {
  const allocation = allocateRegistration(
    {
      users: {
        200002: { stations: [false, false, false, false, false, false, false] },
        100001: { loginTime: 10 },
        100000: { stations: [false, false, false, false, false, false, false] },
      },
    },
    {
      studentId: "1234567890",
      hasVisitedOpenHouse: false,
      registeredAt: 1000,
    },
  );

  assert.deepEqual(allocation.result, {
    accessCode: "100000",
    created: true,
  });
  assert.equal(
    allocation.root.studentRegistrations["1234567890"].accessCode,
    "100000",
  );
  assert.equal(
    allocation.root.users["100000"].registration.studentId,
    "1234567890",
  );
});

test("registration is idempotent for an existing student ID", () => {
  const allocation = allocateRegistration(
    {
      users: {
        100000: {
          registration: {
            studentId: "1234567890",
            registeredAt: 500,
            hasVisitedOpenHouse: true,
          },
        },
      },
      studentRegistrations: {
        1234567890: {
          studentId: "1234567890",
          accessCode: "100000",
          registeredAt: 500,
          hasVisitedOpenHouse: true,
        },
      },
    },
    {
      studentId: "1234567890",
      hasVisitedOpenHouse: false,
      registeredAt: 1000,
    },
  );

  assert.deepEqual(allocation.result, {
    accessCode: "100000",
    created: false,
  });
});

test("fails when no unused code remains", () => {
  assert.throws(
    () =>
      allocateRegistration(
        { users: { 100000: { loginTime: 1 } } },
        {
          studentId: "1234567890",
          hasVisitedOpenHouse: true,
          registeredAt: 1000,
        },
      ),
    (error) =>
      error instanceof DomainError && error.code === "NO_AVAILABLE_CODES",
  );
});

test("validates station QR code and server-side age", () => {
  const result = validateQrPayload("QR_STN_01|1000", 0, 2000);
  assert.equal(result.station.name, "Library journey");

  assert.throws(
    () => validateQrPayload("QR_STN_02|1000", 0, 2000),
    (error) => error instanceof DomainError && error.code === "INVALID_QR",
  );
  assert.throws(
    () => validateQrPayload("QR_STN_01|1000", 0, 100_001),
    (error) => error instanceof DomainError && error.code === "EXPIRED_QR",
  );
});
