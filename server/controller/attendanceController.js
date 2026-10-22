const moment = require("moment");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Topic = require("../models/Topic");

const parseTargetDate = (date) => {
  if (!date || date === "undefined" || date === "null") {
    return new Date().toISOString().split("T")[0];
  }
  const dateStr =
    typeof date === "string" && date.includes("T")
      ? date.split("T")[0]
      : String(date).trim();
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    return new Date().toISOString().split("T")[0];
  }
  return dateStr;
};

// Get monthly attendance for any class for a particular month
const monthlyAttendance = async (req, res) => {
  const { classId, month } = req.query;

  try {
    const startOfMonth = moment(month, "YYYY-MM").startOf("month").toDate();
    const endOfMonth = moment(month, "YYYY-MM").endOf("month").toDate();

    const attendanceData = await Attendance.find({
      classId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.status(200).json({ students: attendanceData });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const lastFiveDaysAttendance = async (req, res) => {
  try {
    const { classId } = req.query;

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4);

    const attendanceRecords = await Attendance.find({
      classId,
      date: { $gte: fiveDaysAgo, $lte: today },
    }).sort({ date: -1 });

    const result = {};

    const studentIds = [
      ...new Set(
        attendanceRecords.flatMap((record) =>
          record.attendance.map((item) => item.studentId)
        )
      ),
    ];

    const dateStrings = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (4 - i));
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    studentIds.forEach((studentId) => {
      result[studentId] = dateStrings.map((dateStr) => {
        const record = attendanceRecords.find((r) => {
          const rd = new Date(r.date);
          return (
            `${rd.getDate()}/${rd.getMonth() + 1}` === dateStr &&
            r.attendance.some((a) => a.studentId === studentId)
          );
        });

        if (record) {
          const attendance = record.attendance.find(
            (a) => a.studentId === studentId
          );
          return {
            date: dateStr,
            status: attendance.status,
            marked: true,
          };
        } else {
          return {
            date: dateStr,
            status: null,
            marked: false,
          };
        }
      });
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAttendance = async (req, res) => {
  const { classId, date } = req.query;
  const targetDate = parseTargetDate(date);

  try {
    const attendanceRecords = await Attendance.find({
      classId,
      date: {
        $gte: new Date(targetDate + "T00:00:00.000Z"),
        $lte: new Date(targetDate + "T23:59:59.999Z"),
      },
    });

    if (attendanceRecords.length > 0) {
      let totalStudents = 0;
      let totalPresentStudents = 0;

      attendanceRecords.forEach((record) => {
        totalStudents += record.attendance.length;
        totalPresentStudents += record.attendance.filter(
          (item) => item.status === "present"
        ).length;
      });

      res.status(200).json({
        totalStudents,
        totalPresentStudents,
      });
    } else {
      res.status(404).json({
        error: "Attendance data not found for the given classId and date",
      });
    }
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAttendanceTotal = async (req, res) => {
  const { date } = req.query;
  const targetDate = parseTargetDate(date);

  try {
    const attendanceRecords = await Attendance.find({
      date: {
        $gte: new Date(targetDate + "T00:00:00.000Z"),
        $lte: new Date(targetDate + "T23:59:59.999Z"),
      },
    });

    if (attendanceRecords.length > 0) {
      let totalStudents = 0;
      let totalPresentStudents = 0;

      attendanceRecords.forEach((record) => {
        totalStudents += record.attendance.length;
        totalPresentStudents += record.attendance.filter(
          (item) => item.status === "present"
        ).length;
      });

      res.status(200).json({
        totalStudents,
        totalPresentStudents,
      });
    } else {
      res.status(404).json({
        error: "Attendance data not found for the given date",
      });
    }
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDashboardOverview = async (req, res) => {
  const { date } = req.query;
  const targetDate = parseTargetDate(date);
  const startOfDay = new Date(targetDate + "T00:00:00.000Z");
  const endOfDay = new Date(targetDate + "T23:59:59.999Z");

  try {
    const [classCounts, attendanceRecords, topicsCovered] = await Promise.all([
      Student.aggregate([
        { $match: { active: { $ne: false } } },
        { $group: { _id: "$className", count: { $sum: 1 } } },
      ]),
      Attendance.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).lean(),
      Topic.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).lean(),
    ]);

    const countsByClass = {};
    classCounts.forEach((item) => {
      if (item._id) {
        countsByClass[item._id] = item.count;
      }
    });

    const attendanceByClass = {};
    attendanceRecords.forEach((record) => {
      const classId = record.classId;
      if (!attendanceByClass[classId]) {
        attendanceByClass[classId] = { total: 0, present: 0 };
      }
      const attList = Array.isArray(record.attendance) ? record.attendance : [];
      attendanceByClass[classId].total += attList.length;
      attendanceByClass[classId].present += attList.filter(
        (item) => item.status === "present"
      ).length;
    });

    const topicsByClass = {};
    topicsCovered.forEach((item) => {
      const classId = item.classId;
      if (!topicsByClass[classId]) {
        topicsByClass[classId] = [];
      }
      if (item.topic && item.topic.trim()) {
        topicsByClass[classId].push({
          topic: item.topic.trim(),
          subject: item.subject ? item.subject.trim() : "",
        });
      }
    });

    res.status(200).json({
      targetDate,
      countsByClass,
      attendanceByClass,
      topicsByClass,
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  monthlyAttendance,
  lastFiveDaysAttendance,
  getAttendance,
  getAttendanceTotal,
  getDashboardOverview,
  parseTargetDate,
};
