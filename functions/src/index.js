"use strict";

const { randomInt } = require("node:crypto");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const {
  DomainError,
  allocateRegistration,
  assertRating,
  normalizeAccessCode,
  normalizeStudentId,
  sanitizeParticipant,
  validateQrPayload,
} = require("./domain");
const { EVENT_CONFIG } = require("./event-config");

initializeApp({ databaseURL: EVENT_CONFIG.firebaseDatabaseUrl });

const database = getDatabase();
const REGION = "asia-southeast1";
const PARTICIPANT_ROUTE = new RegExp(
  `^/participants/(\\d{${EVENT_CONFIG.participantCodeLength}})` +
    "(?:/(stations/(\\d+)|redeem|draw))?$",
);

function sendJson(response, status, body) {
  response
    .status(status)
    .set("Cache-Control", "no-store")
    .set("Content-Type", "application/json; charset=utf-8")
    .json(body);
}

function requireMethod(request, method) {
  if (request.method !== method) {
    throw new DomainError(
      "METHOD_NOT_ALLOWED",
      `Expected ${method}.`,
      405,
    );
  }
}

function participantPath(pathname) {
  return pathname.match(PARTICIPANT_ROUTE);
}

async function registerParticipant(request, response) {
  requireMethod(request, "POST");
  const input = {
    studentId: request.body?.studentId,
    hasVisitedOpenHouse: request.body?.hasVisitedOpenHouse,
    registeredAt: Date.now(),
  };
  let result;
  let allocationError;

  const transaction = await database.ref().transaction(
    (currentRoot) => {
      try {
        const allocation = allocateRegistration(currentRoot, input);
        result = allocation.result;
        allocationError = null;
        return allocation.root;
      } catch (error) {
        allocationError = error;
        return undefined;
      }
    },
    undefined,
    false,
  );

  if (allocationError) {
    throw allocationError;
  }
  if (!transaction.committed || !result) {
    throw new DomainError(
      "REGISTRATION_CONFLICT",
      "Registration could not be completed.",
      409,
    );
  }

  sendJson(response, result.created ? 201 : 200, result);
}

async function recoverParticipantCode(request, response) {
  requireMethod(request, "POST");
  const studentId = normalizeStudentId(request.body?.studentId);
  const snapshot = await database
    .ref(`studentRegistrations/${studentId}/accessCode`)
    .get();
  if (!snapshot.exists()) {
    throw new DomainError(
      "REGISTRATION_NOT_FOUND",
      "No registration was found for this student ID.",
      404,
    );
  }
  sendJson(response, 200, {
    accessCode: normalizeAccessCode(snapshot.val()),
  });
}

async function loginParticipant(request, response) {
  requireMethod(request, "POST");
  const accessCode = normalizeAccessCode(request.body?.accessCode);
  const userRef = database.ref(`users/${accessCode}`);
  const transaction = await userRef.transaction((user) => {
    if (!user?.registration?.studentId) {
      return undefined;
    }
    if (!user.loginTime) {
      user.loginTime = Date.now();
    }
    return user;
  });
  if (!transaction.committed) {
    throw new DomainError(
      "CODE_NOT_REGISTERED",
      "Participant code is not registered.",
      403,
    );
  }
  sendJson(response, 200, {
    participant: sanitizeParticipant(accessCode, transaction.snapshot.val()),
  });
}

async function getParticipant(response, accessCode) {
  const snapshot = await database.ref(`users/${accessCode}`).get();
  sendJson(response, 200, {
    participant: sanitizeParticipant(accessCode, snapshot.val()),
  });
}

async function completeStation(request, response, accessCode, stationId) {
  requireMethod(request, "POST");
  const rating = assertRating(request.body?.rating);
  const now = Date.now();
  const { station } = validateQrPayload(
    request.body?.qrPayload,
    stationId,
    now,
  );
  const historyKey = database
    .ref(`users/${accessCode}/scanHistory`)
    .push().key;
  const userRef = database.ref(`users/${accessCode}`);
  const transaction = await userRef.transaction((user) => {
    if (!user?.registration?.studentId || user.isRedeemed) {
      return undefined;
    }
    user.stations ??= Array(EVENT_CONFIG.stations.length).fill(false);
    if (user.stations[stationId] === true) {
      return user;
    }
    user.stations[stationId] = true;
    user.ratings ??= {};
    user.ratings[stationId] = rating;
    user.scanHistory ??= {};
    user.scanHistory[historyKey] = {
      id: stationId,
      name: station.name,
      time: now,
    };
    return user;
  });
  if (!transaction.committed) {
    throw new DomainError(
      "STATION_UPDATE_REJECTED",
      "Station update was rejected.",
      409,
    );
  }
  sendJson(response, 200, {
    participant: sanitizeParticipant(accessCode, transaction.snapshot.val()),
  });
}

async function redeemParticipant(request, response, accessCode) {
  requireMethod(request, "POST");
  const rating = assertRating(
    request.body?.finalIntentionRating,
    "INVALID_FINAL_RATING",
  );
  const userRef = database.ref(`users/${accessCode}`);
  const transaction = await userRef.transaction((user) => {
    if (!user?.registration?.studentId) {
      return undefined;
    }
    const completed = Object.values(user.stations ?? {}).filter(Boolean).length;
    if (completed !== EVENT_CONFIG.stations.length) {
      return undefined;
    }
    if (!user.isRedeemed) {
      user.finalIntentionRating = rating;
      user.redeemTime = Date.now();
      user.isRedeemed = true;
    }
    return user;
  });
  if (!transaction.committed) {
    throw new DomainError(
      "REDEEM_NOT_READY",
      "All stations must be complete before redemption.",
      409,
    );
  }
  sendJson(response, 200, {
    participant: sanitizeParticipant(accessCode, transaction.snapshot.val()),
  });
}

async function drawParticipantCard(request, response, accessCode) {
  requireMethod(request, "POST");
  const userRef = database.ref(`users/${accessCode}`);
  const transaction = await userRef.transaction((user) => {
    if (!user?.registration?.studentId || !user.isRedeemed) {
      return undefined;
    }
    user.drawnCardId ??= randomInt(1, EVENT_CONFIG.destinyCardCount + 1);
    return user;
  });
  if (!transaction.committed) {
    throw new DomainError(
      "DRAW_NOT_READY",
      "Reward must be redeemed before drawing a card.",
      409,
    );
  }
  sendJson(response, 200, {
    participant: sanitizeParticipant(accessCode, transaction.snapshot.val()),
  });
}

function generateParticipantCodes(count) {
  const codes = new Set();
  const minimum = 10 ** (EVENT_CONFIG.participantCodeLength - 1);
  const maximum = minimum * 10;
  while (codes.size < count) {
    codes.add(String(randomInt(minimum, maximum)));
  }
  return Object.fromEntries(
    [...codes].map((code) => [
      code,
      {
        stations: Array(EVENT_CONFIG.stations.length).fill(false),
        isRedeemed: false,
      },
    ]),
  );
}

async function resetParticipantCodes(request, response) {
  requireMethod(request, "POST");
  if (request.body?.confirmation !== "RESET_ALL_USERS") {
    throw new DomainError(
      "RESET_CONFIRMATION_REQUIRED",
      "Explicit reset confirmation is required.",
    );
  }
  const users = generateParticipantCodes(
    EVENT_CONFIG.participantGenerationCount,
  );
  await database.ref().update({
    users,
    studentRegistrations: null,
  });
  sendJson(response, 200, { total: Object.keys(users).length });
}

async function clearParticipants(request, response) {
  requireMethod(request, "DELETE");
  if (request.body?.confirmation !== "DELETE_ALL_USERS") {
    throw new DomainError(
      "DELETE_CONFIRMATION_REQUIRED",
      "Explicit delete confirmation is required.",
    );
  }
  await database.ref().update({
    users: null,
    studentRegistrations: null,
  });
  sendJson(response, 200, { cleared: true });
}

async function getAdminUsers(request, response) {
  requireMethod(request, "GET");
  const snapshot = await database.ref("users").get();
  sendJson(response, 200, { users: snapshot.val() ?? {} });
}

async function route(request, response) {
  const pathname =
    request.path ??
    new URL(request.originalUrl, "https://api.local").pathname;

  if (pathname === "/health") {
    requireMethod(request, "GET");
    sendJson(response, 200, { ok: true });
    return;
  }
  if (pathname === "/registration/register") {
    await registerParticipant(request, response);
    return;
  }
  if (pathname === "/registration/recover") {
    await recoverParticipantCode(request, response);
    return;
  }
  if (pathname === "/participants/login") {
    await loginParticipant(request, response);
    return;
  }
  if (pathname === "/admin/users") {
    await getAdminUsers(request, response);
    return;
  }
  if (pathname === "/admin/codes/reset") {
    await resetParticipantCodes(request, response);
    return;
  }
  if (pathname === "/admin/users/clear") {
    await clearParticipants(request, response);
    return;
  }

  const participant = participantPath(pathname);
  if (participant) {
    const accessCode = normalizeAccessCode(participant[1]);
    const action = participant[2];
    if (!action) {
      requireMethod(request, "GET");
      await getParticipant(response, accessCode);
      return;
    }
    if (action.startsWith("stations/")) {
      await completeStation(
        request,
        response,
        accessCode,
        Number(participant[3]),
      );
      return;
    }
    if (action === "redeem") {
      await redeemParticipant(request, response, accessCode);
      return;
    }
    if (action === "draw") {
      await drawParticipantCard(request, response, accessCode);
      return;
    }
  }

  throw new DomainError("NOT_FOUND", "API route not found.", 404);
}

exports.api = onRequest(
  {
    region: REGION,
    cors: true,
    timeoutSeconds: 30,
    memory: "256MiB",
  },
  async (request, response) => {
    try {
      await route(request, response);
    } catch (error) {
      const isDomainError = error instanceof DomainError;
      if (!isDomainError) {
        logger.error("Unhandled API error", error);
      }
      sendJson(response, isDomainError ? error.status : 500, {
        error: {
          code: isDomainError ? error.code : "INTERNAL_ERROR",
          message: isDomainError
            ? error.message
            : "An unexpected server error occurred.",
        },
      });
    }
  },
);
