import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const serviceSource = await readFile(
  new URL("../public/assets/js/shared/firebase-service.js", import.meta.url),
  "utf8",
);

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function pathParts(path = "") {
  return String(path).split("/").filter(Boolean);
}

function valueAt(root, path) {
  return pathParts(path).reduce(
    (value, key) => value?.[key],
    root,
  );
}

function setValueAt(database, path, value) {
  const parts = pathParts(path);
  if (!parts.length) {
    database.data = clone(value);
    return;
  }

  let cursor = database.data;
  for (const part of parts.slice(0, -1)) {
    cursor[part] ??= {};
    cursor = cursor[part];
  }
  const finalPart = parts.at(-1);
  if (value === null) delete cursor[finalPart];
  else cursor[finalPart] = clone(value);
}

class FakeSnapshot {
  constructor(value) {
    this.value = clone(value);
  }

  exists() {
    return this.value !== null && this.value !== undefined;
  }

  val() {
    return clone(this.value);
  }
}

class FakeReference {
  constructor(database, path = "") {
    this.database = database;
    this.path = path;
  }

  async once() {
    this.database.readPaths.add(this.path);
    return new FakeSnapshot(valueAt(this.database.data, this.path));
  }

  async transaction(update) {
    const current = clone(valueAt(this.database.data, this.path));
    if (!this.database.warmTransactionPaths.has(this.path)) {
      this.database.warmTransactionPaths.add(this.path);
      const localNext = update(null);
      if (localNext === undefined) {
        return {
          committed: false,
          snapshot: new FakeSnapshot(current),
        };
      }
    }
    const next = update(current);
    if (next === undefined) {
      return {
        committed: false,
        snapshot: new FakeSnapshot(current),
      };
    }
    setValueAt(this.database, this.path, next);
    return {
      committed: true,
      snapshot: new FakeSnapshot(next),
    };
  }

  async update(updates) {
    for (const [path, value] of Object.entries(updates)) {
      const target = [this.path, path].filter(Boolean).join("/");
      setValueAt(this.database, target, value);
    }
  }

  push() {
    this.database.pushIndex += 1;
    return { key: `history-${this.database.pushIndex}` };
  }
}

class FakeDatabase {
  constructor(data) {
    this.data = clone(data);
    this.pushIndex = 0;
    this.readPaths = new Set();
    this.warmTransactionPaths = new Set();
  }

  ref(path = "") {
    return new FakeReference(this, path);
  }
}

function createService(data = {}) {
  const database = new FakeDatabase(data);
  const window = {
    crypto: webcrypto,
    OpenHouseConfig: {
      participants: {
        codeLength: 6,
        generationCount: 3,
      },
      qr: {
        maxAgeMs: 90_000,
        allowedFutureClockSkewMs: 5_000,
      },
      stations: [
        { id: 0, name: "Library journey", qrCode: "QR_STN_01" },
        { id: 1, name: "Query Quarry", qrCode: "QR_STN_02" },
      ],
      destinyCards: [{ id: 1 }, { id: 2 }],
    },
    openHouseDb: database,
  };
  vm.runInNewContext(serviceSource, {
    console,
    Date,
    Math,
    Object,
    RegExp,
    String,
    Uint32Array,
    window,
  });
  return { api: window.OpenHouseApi, database };
}

function emptyParticipant() {
  return {
    stations: [false, false],
    isRedeemed: false,
  };
}

function activityEvaluation() {
  return {
    overallSatisfaction: 5,
    stationPreferences: { 0: 4, 1: 5 },
    favoriteStationId: 1,
    suggestion: "Great event",
  };
}

test("registration allocates the lowest unused code and is idempotent", async () => {
  const { api, database } = createService({
    users: {
      "200002": emptyParticipant(),
      "100002": emptyParticipant(),
      "100001": emptyParticipant(),
    },
  });

  const created = await api.registration.register("1234567890", "yes", "bachelor");
  assert.ok(database.readPaths.has("users/100001"));
  assert.deepEqual(
    { ...created },
    { accessCode: "100001", created: true },
  );
  assert.equal(
    database.data.users["100001"].registration.studentId,
    "1234567890",
  );
  assert.equal(
    database.data.studentRegistrations["1234567890"].accessCode,
    "100001",
  );
  assert.equal(
    database.data.users["100001"].registration.educationLevel,
    "bachelor",
  );

  const repeated = await api.registration.register("1234567890", "no", "master");
  assert.deepEqual(
    { ...repeated },
    { created: false },
  );
  assert.equal(
    database.data.users["100001"].registration.hasVisitedOpenHouse,
    true,
  );
  assert.equal(api.registration.recover, undefined);
});

test("participant evaluates the final station before staff confirms reward", async () => {
  const { api } = createService({
    users: {
      "100001": {
        ...emptyParticipant(),
        registration: {
          studentId: "1234567890",
          hasVisitedOpenHouse: false,
          registeredAt: Date.now(),
        },
      },
    },
    studentRegistrations: {
      "1234567890": {
        accessCode: "100001",
      },
    },
  });

  const login = await api.participant.login("100001");
  assert.ok(login.participant.loginTime);
  assert.ok(login.sessionToken);

  await assert.rejects(
    api.participant.confirmReward("100001", login.sessionToken),
    (error) => error.code === "REWARD_NOT_READY",
  );

  const first = await api.participant.completeStation(
    "100001",
    login.sessionToken,
    0,
    5,
    `QR_STN_01|${Date.now()}`,
  );
  assert.equal(first.participant.stations[0], true);
  assert.equal(first.participant.ratings[0], 5);

  await assert.rejects(
    api.participant.completeStation(
      "100001",
      login.sessionToken,
      1,
      4,
      `QR_STN_02|${Date.now()}`,
    ),
    (error) => error.code === "ACTIVITY_EVALUATION_REQUIRED",
  );

  await api.participant.completeStation(
    "100001",
    login.sessionToken,
    1,
    4,
    `QR_STN_02|${Date.now()}`,
    activityEvaluation(),
  );
  const evaluated = await api.participant.get("100001");
  assert.equal(evaluated.participant.activityEvaluation.overallSatisfaction, 5);
  assert.equal(evaluated.participant.isRedeemed, false);

  const redeemed = await api.participant.confirmReward("100001", login.sessionToken);
  assert.equal(redeemed.participant.isRedeemed, true);

  const drawn = await api.participant.draw("100001", login.sessionToken);
  const drawnAgain = await api.participant.draw("100001", login.sessionToken);
  assert.ok([1, 2].includes(drawn.participant.drawnCardId));
  assert.equal(
    drawnAgain.participant.drawnCardId,
    drawn.participant.drawnCardId,
  );
});

test("a newer login replaces the previous participant session", async () => {
  const { api } = createService({
    users: {
      "100001": {
        ...emptyParticipant(),
        registration: {
          studentId: "1234567890",
          hasVisitedOpenHouse: false,
          educationLevel: "master",
          registeredAt: Date.now(),
        },
      },
    },
  });

  const firstLogin = await api.participant.login("100001");
  const secondLogin = await api.participant.login("100001");
  assert.notEqual(firstLogin.sessionToken, secondLogin.sessionToken);
  await assert.rejects(
    api.participant.completeStation(
      "100001",
      firstLogin.sessionToken,
      0,
      5,
      `QR_STN_01|${Date.now()}`,
    ),
    (error) => error.code === "SESSION_REPLACED",
  );
  const updated = await api.participant.completeStation(
    "100001",
    secondLogin.sessionToken,
    0,
    5,
    `QR_STN_01|${Date.now()}`,
  );
  assert.equal(updated.participant.stations[0], true);
});

test("a previously completed participant can submit the new evaluation", async () => {
  const { api } = createService({
    users: {
      "100001": {
        stations: [true, true],
        isRedeemed: false,
        registration: { studentId: "1234567890" },
      },
    },
  });
  const login = await api.participant.login("100001");
  const result = await api.participant.submitEvaluation(
    "100001",
    login.sessionToken,
    activityEvaluation(),
  );
  assert.equal(result.participant.activityEvaluation.favoriteStationId, 1);
  assert.equal(result.participant.isRedeemed, false);
});

test("registration fails clearly when no unused code remains", async () => {
  const { api } = createService({
    users: {
      "100001": {
        ...emptyParticipant(),
        registration: {
          studentId: "1111111111",
        },
      },
    },
  });

  await assert.rejects(
    api.registration.register("1234567890", false, "doctorate"),
    (error) => error.code === "NO_AVAILABLE_CODES",
  );
});

test("concurrent requests for one student keep only one claimed code", async () => {
  const { api, database } = createService({
    users: {
      "100001": emptyParticipant(),
      "100002": emptyParticipant(),
    },
  });

  const results = await Promise.all([
    api.registration.register("1234567890", "yes", "bachelor"),
    api.registration.register("1234567890", "yes", "bachelor"),
  ]);
  assert.equal(results.filter((result) => result.created).length, 1);
  assert.equal(results.find((result) => result.created).accessCode, "100001");
  assert.equal(
    Object.values(database.data.users).filter(
      (user) => user.registration?.studentId === "1234567890",
    ).length,
    1,
  );
});
