const express = require("express");
const router = express.Router();
const { sendMailsFromSheet } = require("../controller/email.controller.js");
const { verifyUser, requireAdmin } = require("../middlewares/auth.middlewares.js");

router.post("/send-mail", verifyUser, requireAdmin, sendMailsFromSheet);
module.exports = router;