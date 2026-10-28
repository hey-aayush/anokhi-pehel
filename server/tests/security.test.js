const { test, describe } = require("node:test");
const assert = require("node:assert");
const { createRateLimiter } = require("../middlewares/rateLimiter");
const { generateToken, generateTempToken, verifyToken } = require("../config/secret");
const { verifyUser, requireAdmin } = require("../middlewares/auth.middlewares");
const { paperUpload } = require("../middlewares/multer.middlewares");

describe("Rate Limiter Middleware", () => {
  test("allows requests within quota and populates rate limit headers", () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 3 });
    const req = { ip: "127.0.0.1", headers: {} };
    const headers = {};
    const res = {
      setHeader(k, v) {
        headers[k] = v;
      },
      status() {
        return this;
      },
      json() {
        return this;
      },
    };
    let calledNext = false;
    const next = () => {
      calledNext = true;
    };

    limiter(req, res, next);
    assert.strictEqual(calledNext, true);
    assert.strictEqual(headers["RateLimit-Limit"], 3);
    assert.strictEqual(headers["RateLimit-Remaining"], 2);
  });

  test("blocks requests with HTTP 429 when max quota is exceeded", () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 2 });
    const req = { ip: "192.168.1.100", headers: {} };
    let statusCode = null;
    let responseBody = null;
    const res = {
      setHeader() {},
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      },
    };

    // First request - allowed
    limiter(req, res, () => {});
    // Second request - allowed
    limiter(req, res, () => {});
    // Third request - rejected (exceeded max 2)
    let nextCalled = false;
    limiter(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCode, 429);
    assert.strictEqual(responseBody.message, "Too many requests, please try again later.");
  });
});

describe("Token Isolation & Password Reset Nonce Security", () => {
  test("temporary password reset token cannot be used to authenticate general API requests", async () => {
    const tempToken = generateTempToken("victimUserId", "nonce123");
    let statusCode = null;
    let responseBody = null;
    const req = {
      headers: {
        authorization: `Bearer ${tempToken}`,
      },
    };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      },
    };
    let nextCalled = false;

    await verifyUser(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(responseBody.message, "Unauthorized - Invalid token type");
  });

  test("generateTempToken embeds single-use nonce and password_reset purpose", () => {
    const token = generateTempToken("testId", "sampleHashFragment");
    const decoded = verifyToken(token);

    assert.strictEqual(decoded.user.id, "testId");
    assert.strictEqual(decoded.purpose, "password_reset");
    assert.strictEqual(decoded.nonce, "sampleHashFragment");
  });
});

describe("Paper Upload MIME Type Restrictions", () => {
  test("paperUpload filter accepts valid PDF and Word MIME types", () => {
    const filter = paperUpload.fileFilter;
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    allowedMimes.forEach((mimetype) => {
      let accepted = null;
      filter({}, { mimetype }, (err, result) => {
        assert.strictEqual(err, null);
        accepted = result;
      });
      assert.strictEqual(accepted, true);
    });
  });

  test("paperUpload filter rejects dangerous or unexpected MIME types", () => {
    const filter = paperUpload.fileFilter;
    const blockedMimes = [
      "application/x-sh",
      "application/x-msdownload",
      "text/javascript",
      "image/jpeg",
    ];

    blockedMimes.forEach((mimetype) => {
      let filterError = null;
      let accepted = null;
      filter({}, { mimetype }, (err, result) => {
        filterError = err;
        accepted = result;
      });
      assert.ok(filterError instanceof Error);
      assert.match(filterError.message, /Only PDF or Word documents are allowed/);
      assert.strictEqual(accepted, false);
    });
  });
});

describe("Router Security Configuration & Middleware Stacks", () => {
  const settingsRouter = require("../routers/settingsRoute");
  const attendanceRouter = require("../routers/attendanceRoute");
  const topicRouter = require("../routers/topicRoute");
  const antyodayaRouter = require("../routers/antyodayaRoute");
  const emailRouter = require("../routers/email.route");
  const addScoreRouter = require("../routers/addScoreRoute");
  const issueRouter = require("../routers/issue");
  const classScheduleRouter = require("../routers/classScheduleRoute");
  const lineScheduleRouter = require("../routers/lineScheduleRoute");

  const getRouteLayer = (router, path, method) => {
    return router.stack.find(
      (layer) =>
        layer.route &&
        layer.route.path === path &&
        layer.route.methods[method.toLowerCase()]
    );
  };

  test("POST /updateSettings is guarded by verifyUser and requireAdmin", () => {
    const layer = getRouteLayer(settingsRouter, "/updateSettings", "POST");
    assert.ok(layer, "Route POST /updateSettings must exist");
    assert.ok(
      layer.route.stack.some((fn) => fn.name === "verifyUser" || fn.handle === verifyUser),
      "POST /updateSettings must have verifyUser"
    );
    assert.ok(
      layer.route.stack.some((fn) => fn.name === "requireAdmin" || fn.handle === requireAdmin),
      "POST /updateSettings must have requireAdmin"
    );
  });

  test("POST /submitAttendance is guarded by verifyUser", () => {
    const layer = getRouteLayer(attendanceRouter, "/submitAttendance", "POST");
    assert.ok(layer, "Route POST /submitAttendance must exist");
    assert.ok(
      layer.route.stack.some((fn) => fn.name === "verifyUser" || fn.handle === verifyUser),
      "POST /submitAttendance must have verifyUser"
    );
  });

  test("POST /send-mail is guarded by requireAdmin and verifyUser", () => {
    const layer = getRouteLayer(emailRouter, "/send-mail", "POST");
    assert.ok(layer, "Route POST /send-mail must exist");
    assert.ok(
      layer.route.stack.some((fn) => fn.name === "requireAdmin" || fn.handle === requireAdmin),
      "POST /send-mail must have requireAdmin"
    );
  });

  test("Antyodaya administrative mutation routes are guarded by requireAdmin", () => {
    const addEventLayer = getRouteLayer(antyodayaRouter, "/addEvent", "POST");
    assert.ok(addEventLayer, "POST /addEvent must exist");
    assert.ok(
      addEventLayer.route.stack.some((fn) => fn.name === "requireAdmin" || fn.handle === requireAdmin),
      "POST /addEvent must have requireAdmin"
    );

    const deleteEventLayer = getRouteLayer(antyodayaRouter, "/deleteEvent", "DELETE");
    assert.ok(deleteEventLayer, "DELETE /deleteEvent must exist");
    assert.ok(
      deleteEventLayer.route.stack.some((fn) => fn.name === "requireAdmin" || fn.handle === requireAdmin),
      "DELETE /deleteEvent must have requireAdmin"
    );

    const deleteParticipantLayer = getRouteLayer(antyodayaRouter, "/deleteParticipants/:studentId", "DELETE");
    assert.ok(deleteParticipantLayer, "DELETE /deleteParticipants must exist");
    assert.ok(
      deleteParticipantLayer.route.stack.some((fn) => fn.name === "requireAdmin" || fn.handle === requireAdmin),
      "DELETE /deleteParticipants must have requireAdmin"
    );

    const statsLayer = getRouteLayer(antyodayaRouter, "/antyodaya-dashboard-stats", "GET");
    assert.ok(statsLayer, "GET /antyodaya-dashboard-stats must exist");
    assert.ok(
      statsLayer.route.stack.some((fn) => fn.name === "verifyUser" || fn.handle === verifyUser),
      "GET /antyodaya-dashboard-stats must have verifyUser"
    );
  });

  test("Schedule mutation routes require admin privileges", () => {
    const classSched = getRouteLayer(classScheduleRouter, "/addClassSchedule", "POST");
    assert.ok(classSched, "POST /addClassSchedule must exist");
    assert.ok(
      classSched.route.stack.some((fn) => fn.name === "requireAdmin" || fn.handle === requireAdmin)
    );

    const lineSched = getRouteLayer(lineScheduleRouter, "/addLineSchedule", "POST");
    assert.ok(lineSched, "POST /addLineSchedule must exist");
    assert.ok(
      lineSched.route.stack.some((fn) => fn.name === "requireAdmin" || fn.handle === requireAdmin)
    );
  });

  test("Issue deletion requires admin privileges", () => {
    const deleteIssue = getRouteLayer(issueRouter, "/deleteIssues/:id", "DELETE");
    assert.ok(deleteIssue, "DELETE /deleteIssues/:id must exist");
    assert.ok(
      deleteIssue.route.stack.some((fn) => fn.name === "requireAdmin" || fn.handle === requireAdmin)
    );
  });
});
