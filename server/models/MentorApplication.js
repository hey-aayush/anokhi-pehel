const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  reviewerName: { type: String, required: true },
  reviewerRole: { type: String, required: true },
  countsTowardApproval: { type: Boolean, required: true },
  at: { type: Date, default: Date.now },
}, { _id: false });

const historySchema = new mongoose.Schema({
  from: { type: String },
  to: { type: String, required: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  at: { type: Date, default: Date.now },
}, { _id: false });

const mentorApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  regnumber: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  passwordHash: { type: String, required: true, select: false },
  socialMedia: {
    linkedin: String,
    instagram: String,
  },
  status: {
    type: String,
    enum: ["pending", "in_review", "interviewed", "approved", "activated"],
    default: "pending",
    required: true,
  },
  approvals: { type: [approvalSchema], default: [] },
  history: { type: [historySchema], default: [] },
  activatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
}, { timestamps: true });

mentorApplicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("mentorapplication", mentorApplicationSchema);
