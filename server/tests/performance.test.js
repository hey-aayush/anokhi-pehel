const { test, describe } = require("node:test");
const assert = require("node:assert");

describe("Database Model Index Configurations", () => {
  const Attendance = require("../models/Attendance");
  const Topic = require("../models/Topic");
  const Student = require("../models/Student");
  const Participant = require("../models/AntyodayaParticipant");
  const POC = require("../models/PointOfContact");
  const ClassSchedule = require("../models/ClassSchedule");
  const LineSchedule = require("../models/LineSchedule");
  const Issue = require("../models/Issue");

  test("Attendance model has compound index on classId and date", () => {
    const indexes = Attendance.schema.indexes();
    const hasClassDate = indexes.some(
      ([fields]) => fields.classId === 1 && fields.date === 1
    );
    const hasDate = indexes.some(([fields]) => fields.date === 1);
    assert.ok(hasClassDate, "Attendance must have compound index on { classId: 1, date: 1 }");
    assert.ok(hasDate, "Attendance must have index on { date: 1 }");
  });

  test("Topic model has compound index on classId and date", () => {
    const indexes = Topic.schema.indexes();
    const hasClassDate = indexes.some(
      ([fields]) => fields.classId === 1 && fields.date === 1
    );
    assert.ok(hasClassDate, "Topic must have compound index on { classId: 1, date: 1 }");
  });

  test("Student model has compound index on className and active, and index on aadhar", () => {
    const indexes = Student.schema.indexes();
    const hasClassActive = indexes.some(
      ([fields]) => fields.className === 1 && fields.active === 1
    );
    const hasAadhar = indexes.some(([fields]) => fields.aadhar === 1);
    assert.ok(hasClassActive, "Student must have index on { className: 1, active: 1 }");
    assert.ok(hasAadhar, "Student must have index on { aadhar: 1 }");
  });

  test("Antyodaya Participant model has compound indexes for quota and event queries", () => {
    const indexes = Participant.schema.indexes();
    const hasYearPoc = indexes.some(
      ([fields]) => fields.year === 1 && fields.poc === 1
    );
    const hasYearSchool = indexes.some(
      ([fields]) => fields.year === 1 && fields.school === 1
    );
    const hasEvents = indexes.some(([fields]) => fields.events === 1);
    assert.ok(hasYearPoc, "Participant must have index on { year: 1, poc: 1 }");
    assert.ok(hasYearSchool, "Participant must have index on { year: 1, school: 1 }");
    assert.ok(hasEvents, "Participant must have index on { events: 1 }");
  });

  test("POC and Schedule models have required lookup indexes", () => {
    const pocIndexes = POC.schema.indexes();
    assert.ok(
      pocIndexes.some(([fields]) => fields.year === 1 && fields.school === 1),
      "POC must have index on { year: 1, school: 1 }"
    );

    const classSchedIndexes = ClassSchedule.schema.indexes();
    assert.ok(
      classSchedIndexes.some(([fields]) => fields.className === 1),
      "ClassSchedule must have index on { className: 1 }"
    );

    const lineSchedIndexes = LineSchedule.schema.indexes();
    assert.ok(
      lineSchedIndexes.some(([fields]) => fields.location === 1),
      "LineSchedule must have index on { location: 1 }"
    );

    const issueIndexes = Issue.schema.indexes();
    assert.ok(
      issueIndexes.some(([fields]) => fields.status === 1),
      "Issue must have index on { status: 1 }"
    );
  });
});

describe("Dashboard Consolidated Overview Route", () => {
  const attendanceRouter = require("../routers/attendanceRoute");

  test("GET /dashboardOverview route is registered and protected with verifyUser", () => {
    const layer = attendanceRouter.stack.find(
      (l) => l.route && l.route.path === "/dashboardOverview" && l.route.methods.get
    );
    assert.ok(layer, "GET /dashboardOverview route must exist");
    const { verifyUser } = require("../middlewares/auth.middlewares");
    assert.ok(
      layer.route.stack.some((fn) => fn.name === "verifyUser" || fn.handle === verifyUser),
      "GET /dashboardOverview must have verifyUser middleware"
    );
  });
});
