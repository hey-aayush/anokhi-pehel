const express = require("express");
const Settings = require("../models/Settings");
const {
  allSettings,
  updateSettings,
} = require("../controller/settingsController");
const { verifyUser, requireAdmin } = require("../middlewares/auth.middlewares");
const router = express.Router();

// Get all settings (public so landing pages can check registration state)
router.get("/settings", allSettings);

// Update specific setting (requires administrative access)
router.post("/updateSettings", verifyUser, requireAdmin, updateSettings);

module.exports = router;
