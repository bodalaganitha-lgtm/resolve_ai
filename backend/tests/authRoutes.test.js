// Exercises the real POST /register handler in routes/authRoutes.js with the
// database, express, bcrypt and jwt replaced by in-memory fakes, so account
// creation can be verified without MongoDB.
//
// Run with `npm test` (needs Node >= 20.18 / 22.3 for module mocking).

import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";

const handlers = {};
const users = [];

// Behaviour switches the tests can flip.
let createError = null;
let findError = null;

const fakeUser = {
  async findOne({ email }) {
    if (findError) throw findError;
    return users.find((user) => user.email === email) || null;
  },

  async create(doc) {
    if (createError) throw createError;

    if (users.some((user) => user.email === doc.email)) {
      throw Object.assign(new Error("E11000 duplicate key"), { code: 11000 });
    }

    const user = { _id: `id${users.length + 1}`, ...doc };
    users.push(user);
    return user;
  },
};

mock.module("express", {
  defaultExport: {
    Router: () => ({
      post: (path, handler) => {
        handlers[path] = handler;
      },
    }),
  },
});

mock.module("bcryptjs", {
  defaultExport: {
    hash: async (password) => `hashed:${password}`,
    compare: async () => true,
  },
});

mock.module("jsonwebtoken", { defaultExport: { sign: () => "token" } });
mock.module("../models/User.js", { defaultExport: fakeUser });

await import("../routes/authRoutes.js");

const callRegister = async (body) => {
  const res = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  await handlers["/register"]({ body }, res);
  return res;
};

const validBody = {
  name: "Ganitha B",
  email: "Ganitha@Example.com",
  password: "supersecret1",
};

beforeEach(() => {
  users.length = 0;
  createError = null;
  findError = null;
  mock.method(console, "error", () => {});
});

test("creates a customer account and never returns the password", async () => {
  const res = await callRegister(validBody);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.success, true);
  assert.deepEqual(res.body.user, {
    id: "id1",
    name: "Ganitha B",
    email: "ganitha@example.com",
    role: "customer",
  });
  assert.equal(JSON.stringify(res.body).includes("supersecret1"), false);
  assert.equal(JSON.stringify(res.body).includes("hashed:"), false);
});

test("stores a hashed password and a lower-cased email", async () => {
  await callRegister(validBody);

  assert.equal(users[0].password, "hashed:supersecret1");
  assert.equal(users[0].email, "ganitha@example.com");
});

test("cannot be used to create a manager account", async () => {
  const res = await callRegister({ ...validBody, role: "manager" });

  assert.equal(res.statusCode, 201);
  assert.equal(users[0].role, "customer");
});

test("rejects an email that is already registered (any letter case)", async () => {
  await callRegister(validBody);

  const res = await callRegister({
    ...validBody,
    email: "  GANITHA@example.com ",
  });

  assert.equal(res.statusCode, 409);
  assert.equal(res.body.message, "Email already registered");
  assert.equal(users.length, 1);
});

test("returns 409 when two sign-ups race past the duplicate check", async () => {
  createError = Object.assign(new Error("E11000"), { code: 11000 });

  const res = await callRegister(validBody);

  assert.equal(res.statusCode, 409);
  assert.equal(res.body.message, "Email already registered");
});

test("returns clear 400 messages for invalid input", async () => {
  const cases = [
    [{}, "Please fill in all fields"],
    [{ ...validBody, email: "not-an-email" }, "Please enter a valid email address"],
    [{ ...validBody, password: "short" }, "Password must be at least 8 characters"],
    [{ ...validBody, email: 42 }, "Please fill in all fields"],
  ];

  for (const [body, message] of cases) {
    const res = await callRegister(body);

    assert.equal(res.statusCode, 400, message);
    assert.equal(res.body.message, message);
  }

  assert.equal(users.length, 0);
});

test("handles a missing request body without crashing", async () => {
  const res = await callRegister(undefined);

  assert.equal(res.statusCode, 400);
});

test("returns 503 when the database is unreachable", async () => {
  findError = Object.assign(new Error("connect failed"), {
    name: "MongooseServerSelectionError",
  });

  const res = await callRegister(validBody);

  assert.equal(res.statusCode, 503);
  assert.match(res.body.message, /temporarily unavailable/);
});

test("returns a generic 500 for unexpected errors without leaking details", async () => {
  createError = new Error("secret internal detail");

  const res = await callRegister(validBody);

  assert.equal(res.statusCode, 500);
  assert.equal(res.body.success, false);
  assert.equal(res.body.message.includes("secret"), false);
});
