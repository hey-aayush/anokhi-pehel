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
router.use(require("./emailRoutes")); // From ConnectWithUs
router.use(require("./AdmissionRoute")); // From both branches
router.use(require("./antyodayaRoute")); // From main branch
router.use(require("./issue")); // From both branches
router.use(require("./settingsRoute")); // From both branches
module.exports = router;
