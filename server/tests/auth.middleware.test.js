const { test, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const { verifyUser, requireAdmin } = require("../middlewares/auth.middlewares");
const { generateToken } = require("../config/secret");
const User = require("../models/User");

describe("Authentication & Authorization Middlewares", () => {
  describe("requireAdmin", () => {
    test("returns 401 if req.user is missing", () => {
      const req = {};
      let statusCode = null;
      let jsonPayload = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              jsonPayload = data;
            },
          };
        },
      };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      requireAdmin(req, res, next);
      assert.strictEqual(statusCode, 401);
      assert.strictEqual(nextCalled, false);
      assert.strictEqual(jsonPayload.message, "Unauthorized");
    });

    test("returns 403 for unauthorized regular student role", () => {
      const req = { user: { role: "Student", isAdmin: false } };
      let statusCode = null;
      let jsonPayload = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              jsonPayload = data;
            },
          };
        },
      };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      requireAdmin(req, res, next);
      assert.strictEqual(statusCode, 403);
      assert.strictEqual(nextCalled, false);
      assert.match(jsonPayload.message, /Forbidden/);
    });

    test("allows Coordinator role to proceed", () => {
      const req = { user: { role: "Coordinator" } };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      requireAdmin(req, {}, next);
      assert.strictEqual(nextCalled, true);
    });

    test("allows Final Year Coordinator role to proceed", () => {
      const req = { user: { role: "Final Year Coordinator" } };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      requireAdmin(req, {}, next);
      assert.strictEqual(nextCalled, true);
    });

    test("allows isAdmin flag to proceed", () => {
      const req = { user: { isAdmin: true } };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      requireAdmin(req, {}, next);
      assert.strictEqual(nextCalled, true);
    });
  });

  describe("verifyUser", () => {
    test("returns 401 if authorization header is absent", async () => {
      const req = { headers: {} };
      let statusCode = null;
      let jsonPayload = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              jsonPayload = data;
            },
          };
        },
      };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      await verifyUser(req, res, next);
      assert.strictEqual(statusCode, 401);
      assert.match(jsonPayload.message, /No token provided/);
      assert.strictEqual(nextCalled, false);
    });

    test("returns 401 if token is expired or malformed", async () => {
      const req = { headers: { authorization: "Bearer invalid-token" } };
      let statusCode = null;
      let jsonPayload = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              jsonPayload = data;
            },
          };
        },
      };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      await verifyUser(req, res, next);
      assert.strictEqual(statusCode, 401);
      assert.match(jsonPayload.message, /Invalid or expired token/);
      assert.strictEqual(nextCalled, false);
    });

    test("attaches user to request and calls next when token and user are valid", async () => {
      const token = generateToken("validUser42");
      const req = { headers: { authorization: `Bearer ${token}` } };
      const res = {};
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      // Mock User.findById
      const originalFindById = User.findById;
      User.findById = (id) => ({
        select: () => ({
          lean: async () => ({ _id: id, name: "Test User", isActive: true, role: "Coordinator" }),
        }),
      });

      try {
        await verifyUser(req, res, next);
        assert.strictEqual(nextCalled, true);
        assert.strictEqual(req.userId, "validUser42");
        assert.strictEqual(req.user.name, "Test User");
      } finally {
        User.findById = originalFindById;
      }
    });

    test("returns 401 when account isActive is false", async () => {
      const token = generateToken("inactiveUser");
      const req = { headers: { authorization: `Bearer ${token}` } };
      let statusCode = null;
      let jsonPayload = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              jsonPayload = data;
            },
          };
        },
      };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      const originalFindById = User.findById;
      User.findById = (id) => ({
        select: () => ({
          lean: async () => ({ _id: id, isActive: false }),
        }),
      });

      try {
        await verifyUser(req, res, next);
        assert.strictEqual(statusCode, 401);
        assert.match(jsonPayload.message, /Account is inactive/);
        assert.strictEqual(nextCalled, false);
      } finally {
        User.findById = originalFindById;
      }
    });
  });
});
