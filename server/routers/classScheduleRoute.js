const express = require("express");
const ClassSchedule = require("../models/ClassSchedule");
const { verifyUser, requireAdmin } = require("../middlewares/auth.middlewares");
const router = express.Router();

router.post("/addClassSchedule", verifyUser, requireAdmin, async (req, res) => {
  try {
    const classScheduleData = req.body;

    // Check if a schedule with the same location exists
    const existingSchedule = await ClassSchedule.findOne({
      className: classScheduleData.className,
    });

    if (existingSchedule) {
      return res
        .status(400)
        .json({ error: "Schedule for this class already exists" });
    }

    const newClassSchedule = new ClassSchedule(classScheduleData);
    await newClassSchedule.save();
    res.status(200).json("Schedule Added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getClassSchedule", verifyUser, async (req, res) => {
  try {
    const classScheduleData = await ClassSchedule.find(); // Fetch all schedule documents
    res.status(200).json(classScheduleData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
