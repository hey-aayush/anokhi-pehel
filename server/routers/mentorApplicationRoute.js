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
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = express.Router();
router.post("/mentorApplications", createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }), upload.single('photo'), applyAsMentor);
router.get("/mentorApplications", verifyUser, listApplications);
router.get("/mentorApplications/:applicationId", verifyUser, getApplication);
router.patch("/mentorApplications/:applicationId/status", verifyUser, requireAdmin, updateReviewStatus);
router.post("/mentorApplications/:applicationId/approvals", verifyUser, approveApplication);
router.post("/mentorApplications/:applicationId/activate", verifyUser, requireAdmin, activateApplication);

module.exports = router;
