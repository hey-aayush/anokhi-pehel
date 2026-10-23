const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const MentorApplication = require("../models/MentorApplication");
const User = require("../models/User");
const Settings = require("../models/Settings");

const QUALIFYING_ROLES = ["Final Year Coordinator", "Alumni"];
const VOTING_ROLES = ["Coordinator", ...QUALIFYING_ROLES];
const APPROVALS_REQUIRED = 3;

const applicationId = () => `AP-${new Date().getFullYear()}-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

const canReviewApplications = (user) =>
  user?.isAdmin === true ||
  ["Coordinator", "Final Year Coordinator", "admin"].includes(user?.role) ||
  VOTING_ROLES.includes(user?.role);

const canVote = (user) => user?.isActive !== false && VOTING_ROLES.includes(user?.role);
const qualifyingApprovalCount = (record) => record.approvals.filter((approval) => approval.countsTowardApproval).length;

const submit = async (values) => {
  const setting = await Settings.findOne({ key: "isAcceptingResponse" });
  if (!setting?.value) return { error: "closed" };

  const duplicateUser = await User.findOne({ $or: [{ email: values.email }, { regnumber: values.regnumber }] });
  const duplicateApplication = await MentorApplication.findOne({ $or: [{ email: values.email }, { regnumber: values.regnumber }] });
  if (duplicateUser || duplicateApplication) return { error: "duplicate" };

  const record = await MentorApplication.create({
    applicationId: applicationId(),
    name: values.name,
    email: values.email,
    phone: values.phone,
    regnumber: values.regnumber,
    branch: values.branch,
    passwordHash: await bcrypt.hash(values.password, 10),
    socialMedia: { linkedin: values.linkedin, instagram: values.instagram },
    status: "pending",
    history: [{ to: "pending" }],
  });
  return { record };
};

const transition = async (id, from, to, actorId) => MentorApplication.findOneAndUpdate(
  { applicationId: id, status: from },
  { $set: { status: to }, $push: { history: { from, to, actorId } } },
  { new: true }
);

const approve = async (id, reviewer) => {
  const countsTowardApproval = QUALIFYING_ROLES.includes(reviewer.role);
  const query = {
    applicationId: id,
    status: "interviewed",
    "approvals.reviewerId": { $ne: reviewer._id },
  };
  if (countsTowardApproval) {
    query.$expr = { $lt: [{ $size: { $filter: {
      input: "$approvals",
      as: "vote",
      cond: { $eq: ["$$vote.countsTowardApproval", true] },
    } } }, APPROVALS_REQUIRED] };
  }
  const record = await MentorApplication.findOneAndUpdate(
    query,
    { $push: { approvals: {
      reviewerId: reviewer._id,
      reviewerName: reviewer.name,
      reviewerRole: reviewer.role,
      countsTowardApproval,
    } } },
    { new: true }
  );
  if (!record) return null;

  if (qualifyingApprovalCount(record) === APPROVALS_REQUIRED) {
    return transition(id, "interviewed", "approved", reviewer._id);
  }
  return record;
};

const activate = async (id, actorId) => {
  const record = await MentorApplication.findOne({ applicationId: id }).select("+passwordHash");
  if (!record) return { error: "not_found" };
  if (record.status === "activated") return { record };
  if (record.status !== "approved" || qualifyingApprovalCount(record) !== APPROVALS_REQUIRED) return { error: "not_approved" };

  const reviewerIds = [...new Set(record.approvals.filter((approval) => approval.countsTowardApproval).map((approval) => String(approval.reviewerId)))];
  if (reviewerIds.length !== APPROVALS_REQUIRED) return { error: "reviewers_changed" };

  let user = await User.findOne({ email: record.email });
  if (user && user.applicationId !== id) return { error: "account_exists" };
  if (!user) {
    const regnumberExists = await User.exists({ regnumber: record.regnumber });
    if (regnumberExists) return { error: "account_exists" };
    try {
      user = await User.create({
        name: record.name,
        email: record.email,
        phone: record.phone,
        regnumber: record.regnumber,
        branch: record.branch,
        password: record.passwordHash,
        socialMedia: record.socialMedia,
        role: "Mentor",
        isAdmin: false,
        isActive: true,
        applicationId: id,
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      user = await User.findOne({ email: record.email, applicationId: id });
      if (!user) return { error: "account_exists" };
    }
  }
  if (!user.isActive) {
    user.isActive = true;
    await user.save();
  }
  const activated = await MentorApplication.findOneAndUpdate(
    { applicationId: id, status: "approved" },
    { $set: { status: "activated", activatedUserId: user._id }, $push: { history: { from: "approved", to: "activated", actorId } } },
    { new: true }
  );
  return { record: activated || await MentorApplication.findOne({ applicationId: id }) };
};

module.exports = {
  QUALIFYING_ROLES,
  VOTING_ROLES,
  APPROVALS_REQUIRED,
  canReviewApplications,
  canVote,
  qualifyingApprovalCount,
  submit,
  transition,
  approve,
  activate,
};
