const express = require("express");
const Settings = require("../models/Settings");
const {
  allSettings,
  updateSettings,
} = require("../controller/settingsController");
const router = express.Router();

// Get all settings
router.get("/settings", allSettings);

// Update specific setting
router.post("/updateSettings", updateSettings);

module.exports = router;
