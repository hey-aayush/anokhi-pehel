const { test, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const { getHealthStatus, getDatabaseStatus } = require("../controller/healthController");
const healthRouter = require("../routers/healthRoute");

describe("Health Check & Observability", () => {
  test("getDatabaseStatus returns valid state object", () => {
    const status = getDatabaseStatus();
    assert.ok(status);
    assert.strictEqual(typeof status.status, "string");
    assert.strictEqual(typeof status.readyState, "number");
  });

  test("getHealthStatus returns 503 degraded telemetry when database is disconnected", () => {
    let statusCode = null;
    let responseData = null;

    const req = {};
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      },
    };

    const originalState = mongoose.connection.readyState;
    try {
      mongoose.connection.readyState = 0; // Disconnected
      getHealthStatus(req, res);

      assert.strictEqual(statusCode, 503);
      assert.ok(responseData);
      assert.strictEqual(responseData.status, "degraded");
      assert.strictEqual(responseData.database.status, "disconnected");
      assert.strictEqual(responseData.database.readyState, 0);
      assert.ok(responseData.timestamp);
      assert.strictEqual(typeof responseData.uptimeSeconds, "number");
      assert.ok(responseData.system);
      assert.strictEqual(typeof responseData.system.nodeVersion, "string");
      assert.strictEqual(typeof responseData.system.memoryUsageMB.rss, "number");
    } finally {
      mongoose.connection.readyState = originalState;
    }
  });

  test("getHealthStatus returns 200 healthy telemetry when database is connected", () => {
    let statusCode = null;
    let responseData = null;

    const req = {};
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      },
    };

    const originalState = mongoose.connection.readyState;
    try {
      mongoose.connection.readyState = 1; // Connected
      getHealthStatus(req, res);

      assert.strictEqual(statusCode, 200);
      assert.ok(responseData);
      assert.strictEqual(responseData.status, "healthy");
      assert.strictEqual(responseData.database.status, "connected");
      assert.strictEqual(responseData.database.readyState, 1);
    } finally {
      mongoose.connection.readyState = originalState;
    }
  });

  test("healthRouter registers GET / route handler", () => {
    const layer = healthRouter.stack.find(
      (l) => l.route && l.route.path === "/" && l.route.methods.get
    );
    assert.ok(layer, "GET / must be registered in healthRouter");
    assert.strictEqual(typeof layer.route.stack[0].handle, "function");
  });
});
