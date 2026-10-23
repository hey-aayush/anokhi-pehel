const express = require("express");
const { createRateLimiter } = require("../middlewares/rateLimiter");
const { verifyUser, requireAdmin } = require("../middlewares/auth.middlewares");
const {
  applyAsMentor,
  listApplications,
  getApplication,
  updateReviewStatus,
  approveApplication,
  activateApplication,
} = require("../controller/mentorApplicationController");

const router = express.Router();
router.post("/mentorApplications", createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }), applyAsMentor);
router.get("/mentorApplications", verifyUser, listApplications);
router.get("/mentorApplications/:applicationId", verifyUser, getApplication);
router.patch("/mentorApplications/:applicationId/status", verifyUser, requireAdmin, updateReviewStatus);
router.post("/mentorApplications/:applicationId/approvals", verifyUser, approveApplication);
router.post("/mentorApplications/:applicationId/activate", verifyUser, requireAdmin, activateApplication);

module.exports = router;
