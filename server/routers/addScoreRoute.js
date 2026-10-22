const express = require("express");
const router = express.Router();
const { paperUpload } = require("../middlewares/multer.middlewares.js");
const { verifyUser } = require("../middlewares/auth.middlewares.js");
const { 
  submitScore,
  testData, 
  graphData, 
  averageData, 
  testsScore 
} = require("../controller/performanceController.js");

router.post("/submitScore", verifyUser, paperUpload.single("file"), submitScore);

router.get("/tests", verifyUser, testData);

router.get("/get-graph", verifyUser, graphData);

router.get("/getAverage", verifyUser, averageData);

router.get("/testsScore", verifyUser, testsScore);

module.exports = router;
