"use strict";

const EVENT_CONFIG = Object.freeze({
  firebaseDatabaseUrl:
    "https://eventstampcard-default-rtdb.asia-southeast1.firebasedatabase.app",
  participantCodeLength: 6,
  participantGenerationCount: 500,
  destinyCardCount: 16,
  studentIdPattern: /^\d{10}$/,
  qrMaxAgeMs: 90_000,
  qrAllowedFutureClockSkewMs: 5_000,
  stations: Object.freeze([
    Object.freeze({ id: 0, name: "Library journey", qrCode: "QR_STN_01" }),
    Object.freeze({ id: 1, name: "Query Quarry", qrCode: "QR_STN_02" }),
    Object.freeze({ id: 2, name: "Play Zone", qrCode: "QR_STN_03" }),
    Object.freeze({
      id: 3,
      name: "Perfect Match: TAIC Collections",
      qrCode: "QR_STN_04",
    }),
    Object.freeze({ id: 4, name: "Camera Go!", qrCode: "QR_STN_05" }),
    Object.freeze({ id: 5, name: "Joy Tech Station", qrCode: "QR_STN_06" }),
    Object.freeze({ id: 6, name: "Green Mission", qrCode: "QR_STN_07" }),
  ]),
});

module.exports = { EVENT_CONFIG };
