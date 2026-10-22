const { test, describe } = require("node:test");
const assert = require("node:assert");
const {
  generateToken,
  verifyToken,
  generateTempToken,
} = require("../config/secret");

describe("JWT Secret & Token Management", () => {
  test("generateToken generates a valid token", () => {
    const token = generateToken("user123", { role: "Coordinator" });
    assert.ok(typeof token === "string");
    assert.ok(token.length > 20);
  });

  test("verifyToken decodes valid token without prefix", () => {
    const token = generateToken("user123", { role: "Coordinator" });
    const decoded = verifyToken(token);
    assert.strictEqual(decoded.user.id, "user123");
    assert.strictEqual(decoded.user.role, "Coordinator");
    assert.ok(decoded.exp);
  });

  test("verifyToken decodes valid token with 'Bearer ' prefix", () => {
    const token = generateToken("user456");
    const decoded = verifyToken(`Bearer ${token}`);
    assert.strictEqual(decoded.user.id, "user456");
  });

  test("verifyToken throws error on empty or invalid token", () => {
    assert.throws(() => verifyToken(""), /No token provided/);
    assert.throws(() => verifyToken(null), /No token provided/);
    assert.throws(() => verifyToken("invalid.token.signature"));
  });

  test("generateTempToken generates a valid short-lived token", () => {
    const token = generateTempToken("tempUser1");
    const decoded = verifyToken(token);
    assert.strictEqual(decoded.user.id, "tempUser1");
    // Verify it expires approximately in 30 minutes (1800s)
    const expiresIn = decoded.exp - decoded.iat;
    assert.strictEqual(expiresIn, 1800);
  });
});
