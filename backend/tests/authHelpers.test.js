import { test } from "node:test";
import assert from "node:assert/strict";

import {
  validateRegistration,
  mapRegistrationError,
} from "../utils/authHelpers.js";

const good = {
  name: "Ganitha B",
  email: "ganitha@example.com",
  password: "supersecret1",
};

test("accepts valid details and normalises them", () => {
  const result = validateRegistration({
    name: "  Ganitha   B  ",
    email: "  Ganitha@Example.COM ",
    password: "supersecret1",
  });

  assert.equal(result.error, undefined);
  assert.deepEqual(result.value, {
    name: "Ganitha B",
    email: "ganitha@example.com",
    password: "supersecret1",
  });
});

test("rejects missing or blank fields", () => {
  for (const body of [
    undefined,
    null,
    {},
    { ...good, name: "" },
    { ...good, name: "   " },
    { ...good, email: "" },
    { ...good, password: "" },
  ]) {
    assert.equal(validateRegistration(body).error, "Please fill in all fields");
  }
});

test("rejects non-string input instead of crashing", () => {
  for (const body of [
    { ...good, email: 123 },
    { ...good, name: { first: "x" } },
    { ...good, password: 12345678 },
    { ...good, email: ["a@b.co"] },
  ]) {
    assert.equal(validateRegistration(body).error, "Please fill in all fields");
  }
});

test("rejects invalid email addresses", () => {
  for (const email of ["plainaddress", "a@b", "a b@c.com", "@c.com", "a@.com "]) {
    assert.equal(
      validateRegistration({ ...good, email }).error,
      "Please enter a valid email address",
      email
    );
  }
});

test("enforces name length", () => {
  assert.match(validateRegistration({ ...good, name: "A" }).error, /at least 2/);
  assert.match(
    validateRegistration({ ...good, name: "A".repeat(81) }).error,
    /80 characters or fewer/
  );
});

test("enforces password length including the bcrypt 72-byte limit", () => {
  assert.match(
    validateRegistration({ ...good, password: "short" }).error,
    /at least 8/
  );
  assert.equal(
    validateRegistration({ ...good, password: "a".repeat(72) }).error,
    undefined
  );
  assert.match(
    validateRegistration({ ...good, password: "a".repeat(73) }).error,
    /72 bytes/
  );
  // 25 emoji = 100 bytes, only 25 characters
  assert.match(
    validateRegistration({ ...good, password: "😀".repeat(25) }).error,
    /72 bytes/
  );
});

test("maps a duplicate key error to 409", () => {
  assert.deepEqual(mapRegistrationError({ code: 11000 }), {
    status: 409,
    message: "Email already registered",
  });
});

test("maps a mongoose validation error to 400", () => {
  assert.equal(mapRegistrationError({ name: "ValidationError" }).status, 400);
});

test("maps database connectivity errors to 503", () => {
  for (const error of [
    { name: "MongooseServerSelectionError", message: "x" },
    { name: "MongoNetworkError", message: "x" },
    { name: "MongooseError", message: "Operation `users.findOne()` buffering timed out after 10000ms" },
  ]) {
    assert.equal(mapRegistrationError(error).status, 503);
  }
});

test("maps anything else to a generic 500 without leaking details", () => {
  const result = mapRegistrationError(new Error("secret internal detail"));

  assert.equal(result.status, 500);
  assert.ok(!result.message.includes("secret"));
});
