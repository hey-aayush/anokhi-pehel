const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const Student = require("../models/Student");
const Participant = require("../models/AntyodayaParticipant");
const { listStudents, listParticipants } = require("../controller/listController");

const response = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

describe("list endpoint compatibility and pagination", () => {
  test("student list keeps its array response when pagination is omitted", async (t) => {
    const students = [{ _id: "one", name: "A" }];
    t.mock.method(Student, "find", (filter) => {
      assert.deepEqual(filter, {});
      return Promise.resolve(students);
    });
    const res = response();
    await listStudents({ query: {} }, res);
    assert.deepEqual(res.body, students);
  });

  test("student list applies filters, stable page order and a total count", async (t) => {
    let foundFilter;
    const query = {
      sort(value) { assert.deepEqual(value, { _id: 1 }); return this; },
      skip(value) { assert.equal(value, 40); return this; },
      limit(value) { assert.equal(value, 40); return this; },
      lean() { return Promise.resolve([{ _id: "two", name: "A" }]); },
    };
    t.mock.method(Student, "find", (filter) => { foundFilter = filter; return query; });
    t.mock.method(Student, "countDocuments", (filter) => {
      assert.deepEqual(filter, foundFilter);
      return Promise.resolve(61);
    });
    const res = response();
    await listStudents({ query: { page: "2", limit: "40", classes: "1,2", locations: "North", name: "A.*" } }, res);
    assert.deepEqual(res.body, { items: [{ _id: "two", name: "A" }], page: 2, limit: 40, total: 61 });
    assert.deepEqual(foundFilter.className, { $in: ["1", "2"] });
    assert.deepEqual(foundFilter.location, { $in: ["North"] });
    assert.equal(foundFilter.name.$regex, "A\\.\\*");
  });

  test("participant list keeps the existing year-filtered array contract", async (t) => {
    t.mock.method(Participant, "find", (filter) => {
      assert.deepEqual(filter, { year: 2025 });
      return { lean: async () => [{ _id: "one" }] };
    });
    const res = response();
    await listParticipants({ query: { year: "2025" } }, res);
    assert.deepEqual(res.body, [{ _id: "one" }]);
  });

  test("participant pages filter before counting and sorting", async (t) => {
    let foundFilter;
    const query = {
      sort(value) { assert.deepEqual(value, { year: -1, name: 1, _id: 1 }); return this; },
      skip(value) { assert.equal(value, 0); return this; },
      limit(value) { assert.equal(value, 40); return this; },
      lean() { return Promise.resolve([{ name: "A" }]); },
    };
    t.mock.method(Participant, "find", (filter) => { foundFilter = filter; return query; });
    t.mock.method(Participant, "countDocuments", (filter) => {
      assert.deepEqual(filter, foundFilter);
      return Promise.resolve(2);
    });
    const res = response();
    await listParticipants({ query: { page: "1", limit: "40", years: "2024,2025", classes: "2", school: "School" } }, res);
    assert.deepEqual(foundFilter.year, { $in: [2024, 2025] });
    assert.deepEqual(foundFilter.class, { $in: ["2"] });
    assert.deepEqual(res.body, { items: [{ name: "A" }], page: 1, limit: 40, total: 2 });
  });

  test("rejects invalid pagination without querying MongoDB", async (t) => {
    t.mock.method(Student, "find", () => { throw new Error("Unexpected query"); });
    const res = response();
    await listStudents({ query: { page: "0", limit: "1000" } }, res);
    assert.equal(res.statusCode, 400);
  });
});
