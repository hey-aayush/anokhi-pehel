const { test } = require("node:test");
const assert = require("node:assert/strict");
const transporter = require("../config/mailer");
const workflow = require("../services/mentorApplicationService");
const mentorRouter = require("../routers/mentorApplicationRoute");
const contactRouter = require("../routers/contactRoute");
const { applyAsMentor } = require("../controller/mentorApplicationController");
const { submitContact } = require("../controller/contactController");

const response = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

test("public form routes are rate limited and do not change the protected createUser route", () => {
  for (const [router, path] of [[mentorRouter, "/mentorApplications"], [contactRouter, "/contact"]]) {
    const route = router.stack.find((layer) => layer.route?.path === path);
    assert.ok(route);
    assert.equal(route.route.methods.post, true);
    assert.equal(route.route.stack.length, 2);
  }
});

test("mentor application returns a pending ID and emails it without trusting requested privileges", async () => {
  const originalSubmit = workflow.submit;
  const originalSend = transporter.sendMail;
  const originalEmail = process.env.email;
  const originalAuth = process.env.SMTP_AUTH;
  let submitted;
  let mail;
  process.env.email = "smtp@example.com";
  process.env.SMTP_AUTH = "false";
  workflow.submit = async (values) => { submitted = values; return { record: { applicationId: "AP-2026-ABC123" } }; };
  transporter.sendMail = async (options) => { mail = options; };
  try {
    const res = response();
    await applyAsMentor({ body: {
      name: "Applicant", email: "APPLICANT@example.com", phone: "1234567890",
      regnumber: "ABC123", branch: "Computer Science", password: "Strong123!",
      role: "Coordinator", isAdmin: true, isActive: true,
    } }, res);
    assert.equal(res.statusCode, 201);
    assert.equal(submitted.email, "applicant@example.com");
    assert.equal(submitted.role, undefined);
    assert.equal(submitted.isAdmin, undefined);
    assert.equal(res.body.applicationId, "AP-2026-ABC123");
    assert.equal(res.body.status, "pending");
    assert.equal(res.body.emailSent, true);
    assert.equal(mail.to, "applicant@example.com");
    assert.match(mail.text, /AP-2026-ABC123/);
  } finally {
    workflow.submit = originalSubmit;
    transporter.sendMail = originalSend;
    if (originalEmail === undefined) delete process.env.email; else process.env.email = originalEmail;
    if (originalAuth === undefined) delete process.env.SMTP_AUTH; else process.env.SMTP_AUTH = originalAuth;
  }
});

test("closed mentor applications return 403", async () => {
  const originalSubmit = workflow.submit;
  workflow.submit = async () => ({ error: "closed" });
  try {
    const res = response();
    await applyAsMentor({ body: {
      name: "Applicant", email: "applicant@example.com", phone: "1234567890",
      regnumber: "ABC123", branch: "Computer Science", password: "Strong123!",
    } }, res);
    assert.equal(res.statusCode, 403);
  } finally {
    workflow.submit = originalSubmit;
  }
});

test("contact submission sends to the configured inbox and reports success", async () => {
  const originalSend = transporter.sendMail;
  const originalEmail = process.env.email;
  const originalPassword = process.env.password;
  const originalRecipient = process.env.CONTACT_EMAIL;
  let mail;
  process.env.email = "smtp@example.com";
  process.env.password = "test-password";
  process.env.CONTACT_EMAIL = "team@example.com";
  transporter.sendMail = async (options) => { mail = options; };
  try {
    const res = response();
    await submitContact({ body: { name: "Visitor", email: "visitor@example.com", message: "I would like to help." } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(mail.to, "team@example.com");
    assert.equal(mail.replyTo, "visitor@example.com");
    assert.match(mail.text, /I would like to help/);
  } finally {
    transporter.sendMail = originalSend;
    if (originalEmail === undefined) delete process.env.email; else process.env.email = originalEmail;
    if (originalPassword === undefined) delete process.env.password; else process.env.password = originalPassword;
    if (originalRecipient === undefined) delete process.env.CONTACT_EMAIL; else process.env.CONTACT_EMAIL = originalRecipient;
  }
});
