const express = require("express");
const { createRateLimiter } = require("../middlewares/rateLimiter");
const { submitContact } = require("../controller/contactController");

const router = express.Router();
router.post("/contact", createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }), submitContact);

module.exports = router;
