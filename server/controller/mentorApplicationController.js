const MentorApplication = require("../models/MentorApplication");
const transporter = require("../config/mailer");
const workflow = require("../services/mentorApplicationService");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const readApplicationValues = (body = {}) => {
  const fields = ["name", "email", "phone", "regnumber", "branch", "password"];
  const values = Object.fromEntries(
    fields.map((field) => [field, typeof body[field] === "string" ? body[field].trim() : ""])
  );
  values.email = values.email.toLowerCase();
  values.linkedin = typeof body.linkedin === "string" ? body.linkedin.trim() : "";
  values.instagram = typeof body.instagram === "string" ? body.instagram.trim() : "";
  const invalid = fields.some((field) => !values[field]) ||
    values.name.length > 100 || values.email.length > 254 ||
    values.phone.length > 30 || values.regnumber.length > 50 ||
    values.branch.length > 100 || values.password.length > 72 ||
    values.linkedin.length > 100 || values.instagram.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ||
    !passwordPattern.test(values.password);
  return invalid ? null : values;
};

const applyAsMentor = async (req, res) => {
  const values = readApplicationValues(req.body);
  if (!values) return res.status(400).json({ message: "Please provide valid application details and a strong password." });

  try {
    const result = await workflow.submit(values);
    if (result.error === "closed") return res.status(403).json({ message: "Mentor applications are currently closed." });
    if (result.error === "duplicate") return res.status(409).json({ message: "An application or account already exists with this email or registration number." });

    const id = result.record.applicationId;
    let emailSent = false;
    if (process.env.email && (process.env.password || process.env.SMTP_AUTH === "false")) {
      try {
        await transporter.sendMail({
          from: `Anokhi Pehel <${process.env.email}>`,
          to: values.email,
          subject: `Your Anokhi Pehel application ID: ${id}`,
          text: `Thank you for applying to be a mentor.\n\nYour application ID is ${id}. Keep it for your records. Your application is pending review.\n\nAnokhi Pehel`,
        });
        emailSent = true;
      } catch {
        // The saved application and visible ID remain valid when email delivery fails.
      }
    }
    return res.status(201).json({
      applicationId: id,
      status: "pending",
      emailSent,
      message: "Application submitted. Keep your application ID for your records.",
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An application or account already exists with this email or registration number." });
    return res.status(500).json({ message: "Unable to submit your application. Please try again." });
  }
};

const listApplications = async (req, res) => {
  if (!workflow.canReviewApplications(req.user)) return res.status(403).json({ message: "Reviewer access required." });
  try {
    const records = await MentorApplication.find()
      .select("applicationId name email status approvals createdAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return res.json(records);
  } catch {
    return res.status(500).json({ message: "Unable to load applications." });
  }
};

const getApplication = async (req, res) => {
  if (!workflow.canReviewApplications(req.user)) return res.status(403).json({ message: "Reviewer access required." });
  try {
    const record = await MentorApplication.findOne({ applicationId: req.params.applicationId });
    return record ? res.json(record) : res.status(404).json({ message: "Application not found." });
  } catch {
    return res.status(500).json({ message: "Unable to load the application." });
  }
};

const updateReviewStatus = async (req, res) => {
  const { status } = req.body || {};
  const from = status === "in_review" ? "pending" : status === "interviewed" ? "in_review" : null;
  if (!from) return res.status(400).json({ message: "Invalid status transition." });
  try {
    const record = await workflow.transition(req.params.applicationId, from, status, req.user._id);
    if (record) return res.json(record);
    const exists = await MentorApplication.exists({ applicationId: req.params.applicationId });
    return res.status(exists ? 409 : 404).json({ message: exists ? "This application is not in the expected state." : "Application not found." });
  } catch {
    return res.status(500).json({ message: "Unable to update the application." });
  }
};

const approveApplication = async (req, res) => {
  if (!workflow.canVote(req.user)) return res.status(403).json({ message: "Only Coordinators, Final Year Coordinators, and Alumni can vote." });
  try {
    const record = await workflow.approve(req.params.applicationId, req.user);
    if (record) return res.json(record);
    const exists = await MentorApplication.exists({ applicationId: req.params.applicationId });
    return res.status(exists ? 409 : 404).json({ message: exists ? "Voting requires an interviewed application and a distinct voter." : "Application not found." });
  } catch {
    return res.status(500).json({ message: "Unable to record the approval." });
  }
};

const activateApplication = async (req, res) => {
  try {
    const result = await workflow.activate(req.params.applicationId, req.user._id);
    if (result.record) return res.json(result.record);
    const messages = {
      not_found: "Application not found.",
      not_approved: "Three approvals are required before activation.",
      reviewers_changed: "Three distinct qualifying reviewers are required.",
      account_exists: "A different account already uses this email or registration number.",
    };
    return res.status(result.error === "not_found" ? 404 : 409).json({ message: messages[result.error] });
  } catch {
    return res.status(500).json({ message: "Unable to activate this application." });
  }
};

module.exports = {
  applyAsMentor,
  listApplications,
  getApplication,
  updateReviewStatus,
  approveApplication,
  activateApplication,
};
