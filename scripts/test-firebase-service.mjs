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
    return new FakeSnapshot(valueAt(this.database.data, this.path));
  }

  async transaction(update) {
    const current = clone(valueAt(this.database.data, this.path));
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

test("registration allocates the lowest unused code and is idempotent", async () => {
  const { api, database } = createService({
    users: {
      "200002": emptyParticipant(),
      "100002": emptyParticipant(),
      "100001": emptyParticipant(),
    },
  });

  const created = await api.registration.register("1234567890", "yes");
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

  const repeated = await api.registration.register("1234567890", "no");
  assert.deepEqual(
    { ...repeated },
    { accessCode: "100001", created: false },
  );
  assert.equal(
    database.data.users["100001"].registration.hasVisitedOpenHouse,
    true,
  );

  const recovered = await api.registration.recover("1234567890");
  assert.equal(recovered.accessCode, "100001");
});

test("participant completes stations, redeems, and draws once", async () => {
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

  await assert.rejects(
    api.participant.redeem("100001", 5),
    (error) => error.code === "REDEEM_NOT_READY",
  );

  const first = await api.participant.completeStation(
    "100001",
    0,
    5,
    `QR_STN_01|${Date.now()}`,
  );
  assert.equal(first.participant.stations[0], true);
  assert.equal(first.participant.ratings[0], 5);

  await api.participant.completeStation(
    "100001",
    1,
    4,
    `QR_STN_02|${Date.now()}`,
  );
  const redeemed = await api.participant.redeem("100001", 5);
  assert.equal(redeemed.participant.isRedeemed, true);

  const drawn = await api.participant.draw("100001");
  const drawnAgain = await api.participant.draw("100001");
  assert.ok([1, 2].includes(drawn.participant.drawnCardId));
  assert.equal(
    drawnAgain.participant.drawnCardId,
    drawn.participant.drawnCardId,
  );
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
    api.registration.register("1234567890", false),
    (error) => error.code === "NO_AVAILABLE_CODES",
  );
});
