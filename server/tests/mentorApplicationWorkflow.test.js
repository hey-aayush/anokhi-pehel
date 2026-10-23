const { test } = require("node:test");
const assert = require("node:assert/strict");
const MentorApplication = require("../models/MentorApplication");
const workflow = require("../services/mentorApplicationService");

test("Coordinator votes are supporting and cannot complete approval", async () => {
  const originalUpdate = MentorApplication.findOneAndUpdate;
  let update;
  MentorApplication.findOneAndUpdate = async (query, changes) => {
    update = { query, changes };
    return { status: "interviewed", approvals: [{ countsTowardApproval: false }] };
  };
  try {
    const record = await workflow.approve("AP-2026-TEST", { _id: "coordinator-1", name: "Coordinator", role: "Coordinator" });
    assert.equal(record.status, "interviewed");
    assert.equal(update.changes.$push.approvals.countsTowardApproval, false);
    assert.equal(update.query.$expr, undefined);
    assert.deepEqual(update.query["approvals.reviewerId"], { $ne: "coordinator-1" });
  } finally {
    MentorApplication.findOneAndUpdate = originalUpdate;
  }
});

test("third qualifying vote moves an interviewed application to approved", async () => {
  const originalUpdate = MentorApplication.findOneAndUpdate;
  const calls = [];
  MentorApplication.findOneAndUpdate = async (query, changes) => {
    calls.push({ query, changes });
    return calls.length === 1
      ? { status: "interviewed", approvals: [{ countsTowardApproval: false }, ...Array(3).fill({ countsTowardApproval: true })] }
      : { status: "approved", approvals: Array(3).fill({ countsTowardApproval: true }) };
  };
  try {
    const record = await workflow.approve("AP-2026-TEST", { _id: "reviewer-3", name: "Alumni", role: "Alumni" });
    assert.equal(record.status, "approved");
    assert.equal(calls[0].changes.$push.approvals.countsTowardApproval, true);
    assert.ok(calls[0].query.$expr);
    assert.equal(calls[1].query.status, "interviewed");
    assert.equal(calls[1].changes.$set.status, "approved");
  } finally {
    MentorApplication.findOneAndUpdate = originalUpdate;
  }
});
