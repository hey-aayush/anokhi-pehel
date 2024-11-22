const express = require("express");
const router = express.Router();

router.use(require("./authRoute"));
router.use(require("./studentRoute"));
router.use(require("./addUserRoute"));
router.use(require("./addScoreRoute"));
router.use(require("./lineScheduleRoute"));
router.use(require("./classScheduleRoute"));
router.use(require("./attendanceRoute"));
router.use(require("./topicRoute"));
router.use(require("./emailRoutes"));

module.exports = router;
