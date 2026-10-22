const express = require("express");
const router = express.Router();
const { getHealthStatus } = require("../controller/healthController");

router.get("/", getHealthStatus);

module.exports = router;
