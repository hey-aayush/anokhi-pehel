const { test, describe } = require("node:test");
const assert = require("node:assert");
const { parseTargetDate } = require("../controller/attendanceController");
const { parseTargetDate: parseTopicDate } = require("../controller/topicController");
const { addParticipants } = require("../controller/antyodayaController");

describe("Date Parsing Helpers", () => {
  test("parseTargetDate extracts YYYY-MM-DD from ISO timestamp", () => {
    const result = parseTargetDate("2026-10-22T15:30:00.000Z");
    assert.strictEqual(result, "2026-10-22");
  });

  test("parseTargetDate handles plain YYYY-MM-DD string", () => {
    const result = parseTargetDate("2026-05-15");
    assert.strictEqual(result, "2026-05-15");
  });

  test("parseTargetDate defaults to today for null, undefined, or string 'undefined'", () => {
    const today = new Date().toISOString().split("T")[0];
    assert.strictEqual(parseTargetDate(null), today);
    assert.strictEqual(parseTargetDate(undefined), today);
    assert.strictEqual(parseTargetDate("undefined"), today);
    assert.strictEqual(parseTargetDate("null"), today);
    assert.strictEqual(parseTargetDate(""), today);
  });

  test("parseTargetDate falls back to today for invalid date string", () => {
    const today = new Date().toISOString().split("T")[0];
    assert.strictEqual(parseTargetDate("not-a-valid-date"), today);
  });

  test("topicController parseTargetDate behaves consistently", () => {
    const result = parseTopicDate("2026-08-20T00:00:00.000Z");
    assert.strictEqual(result, "2026-08-20");
  });
});

describe("Antyodaya Controller Validation", () => {
  test("addParticipants rejects submission without photo", async () => {
    const req = {
      body: {
        name: "Test Student",
        class: "5",
        phone: "9999999999",
        school: "Test School",
        address: "Test Address",
      },
      file: null,
    };
    let statusCode = null;
    let responseBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      send(body) {
        responseBody = body;
        return this;
      },
    };

    await addParticipants(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseBody, "Photo is required");
  });

  test("addParticipants rejects submission missing required text fields", async () => {
    const req = {
      body: {
        name: "",
        class: "5",
        phone: "",
        school: "Test School",
        address: "Test Address",
      },
      file: { filename: "photo-123.jpg" },
    };
    let statusCode = null;
    let responseBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      send(body) {
        responseBody = body;
        return this;
      },
    };

    await addParticipants(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseBody, "All required fields must be filled");
  });

  test("addParticipants rejects more than 2 events", async () => {
    const req = {
      body: {
        name: "Test Student",
        class: "5",
        phone: "9999999999",
        school: "Test School",
        address: "Test Address",
        events: "ev1,ev2,ev3",
      },
      file: { filename: "photo-123.jpg" },
    };
    let statusCode = null;
    let responseBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      send(body) {
        responseBody = body;
        return this;
      },
    };

    await addParticipants(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseBody, "Maximum 2 events allowed per participant");
  });
});
