const moment = require("moment");
const Attendance = require("../models/Attendance");

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

module.exports = {
  monthlyAttendance,
  lastFiveDaysAttendance,
  getAttendance,
  getAttendanceTotal,
  parseTargetDate,
};
