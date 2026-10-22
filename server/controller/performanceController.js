const mongoose = require("mongoose");
const Student = require("../models/Student");
const Test = require("../models/TestScore"); 
const {authorize, uploadFile} = require('../utils/googleConfig.js')
const fs = require("fs");
const { deleteFile } = require("../utils/fileUtils.js");

const submitScore = async (req, res) => {
  let uploadedFilePath = req?.file?.path;
  try {
      const { classId, subject, date, scores, mentorId, totalMarks } = req.body;
      if (!classId) {
          deleteFile(uploadedFilePath);
          return res.status(401).json({ error: "classId is required" });
      }
      if (!subject) {
          deleteFile(uploadedFilePath);
          return res.status(401).json({ error: "subject is required" });
      }
      if (!date) {
          deleteFile(uploadedFilePath);
          return res.status(401).json({ error: "date is required" });
      }
      if (!scores) {
          deleteFile();
          return res.status(401).json({ error: "scores is required" });
      }
      if (!mentorId) {
          deleteFile(uploadedFilePath);
          return res.status(401).json({ error: "mentorId is required" });
      }
      if (!req.file) {
          return res.status(401).json({ error: "file is required" });
      }

      let parsedScores;
      try {
          parsedScores = JSON.parse(scores);
      } catch (error) {
          console.error("Error parsing scores:", error);
          deleteFile(uploadedFilePath);
          return res.status(400).json({ error: "Invalid scores format" });
      }

      if (!Array.isArray(parsedScores) || parsedScores.length === 0) {
          deleteFile(uploadedFilePath);
          return res.status(400).json({ error: "Scores array must not be empty" });
      }

      // Deduplicate student scores in payload to prevent concurrent document mutations
      const uniqueScores = Array.from(
        new Map(parsedScores.map((s) => [String(s.studentId), s])).values()
      );

      for (const score of uniqueScores) {
          if (!score.studentId || typeof score.score !== "number") {
              deleteFile(uploadedFilePath);
              return res.status(403).json({ error: "Invalid score data" });
          }
      }

      // **CHECK IF DATA ALREADY EXISTS BEFORE FILE UPLOAD (Batch optimized)**
      const studentIds = uniqueScores.map((s) => s.studentId);
      const existingRecords = await Test.find({
        student: { $in: studentIds },
        subject,
        className: classId,
      });

      const targetDateStr = new Date(date).toISOString().split("T")[0];
      const recordMap = new Map();

      for (const rec of existingRecords) {
        const hasDuplicate = rec.tests.some(
          (test) =>
            new Date(test.date).toISOString().split("T")[0] === targetDateStr
        );

        if (hasDuplicate) {
          deleteFile(uploadedFilePath);
          return res.status(409).json({
            message: `Data already exists for current date and subject`,
          });
        }
        recordMap.set(rec.student.toString(), rec);
      }

      let fileId = null;
      if (req.file) {
          if (
              req.file.mimetype !== "application/pdf" &&
              req.file.mimetype !== "application/msword" &&
              req.file.mimetype !==
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
              deleteFile(uploadedFilePath);
              return res.status(400).json({ error: "Only PDF or Word files are allowed!" });
          }
          const authClient = await authorize();
          const uploadedFileUrl = await uploadFile(authClient, req.file, classId, subject, date);
          fileId = uploadedFileUrl;
      }

      // Parallel batch save for all score records
      const savePromises = [];
      for (const score of uniqueScores) {
          const { studentId, score: studentScore } = score;
          let testRecord = recordMap.get(studentId.toString());

          if (testRecord) { 
              testRecord.tests.push({ totalMarks: totalMarks, score: studentScore, mentorId: mentorId, fileId: fileId, date: date });
              savePromises.push(testRecord.save());
          } else {
              const newTest = new Test({
                  student: studentId,
                  className: classId,
                  subject,
                  tests: [{ totalMarks: totalMarks, score: studentScore, mentorId: mentorId, fileId: fileId, date: date }],
              });
              savePromises.push(newTest.save());
          }
      }
      await Promise.all(savePromises);

      return res.status(200).json({ message: "Scores submitted successfully !!" });
  } 
  catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: error.message || "Internal Server Error" });
  } 
  finally {
      deleteFile(uploadedFilePath); // Ensure file is deleted no matter what
  }
};


const testData = async (req, res) => {
  try {
    const { selectedClass, subject } = req.query;
    // Fetch all students because may be some student get promoted to next class and in the prev class remainig students have the test
    const testRecord = await Test.find({ className: selectedClass, subject: subject })
      .select("tests")
      .lean();

    if (!testRecord || testRecord.length === 0) {
      return res.status(404).json({ message: "No tests found for the given class and subject" });
    }

    const testDates = [];
    const dateSet = new Set(); // To store unique dates

    testRecord.forEach(record => {
      record.tests.forEach(test => {
        const testDateStr = new Date(test.date).toISOString(); // Convert to a standard format

        if (!dateSet.has(testDateStr)) {
          dateSet.add(testDateStr);
          testDates.push({ date: test.date, id: test._id });
        }
      });
    });

    // console.log("Test Dates:", testDates);

    return res.status(200).json(testDates);
  } catch (error) {
    console.error("Error fetching test dates:", error);
    return res.status(500).json({ message: "Error fetching test dates", error });
  }
}

const graphData = async (req, res) => {
  let { studentId, subjectId, classId } = req.query;

  // console.log("Received Query:", { studentId, subjectId });

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ error: "Invalid studentId format" });
  }

  try {
    const performance = await Test.findOne({
      student: new mongoose.Types.ObjectId(studentId),
      subject: subjectId,
      className: classId
    })
      .select("tests")
      .lean();

    // console.log("Found Performance:", performance);

    if (!performance) {
      return res.status(404).json({ message: "No performance data found for this student and subject." });
    }

    const formattedTests = performance.tests.map(test => {
      const total = test.totalMarks > 0 ? test.totalMarks : 100;
      return {
        score: Math.round(((test.score * 100) / total) * 100) / 100,
        date: new Date(test.date).toISOString().split("T")[0],
      };
    });

    res.status(200).json({ status: 200, data: formattedTests, message: "Performance data retrieved successfully" });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const averageData = async(req, res) => {
  try {
    const { classId, subjectId } = req.query;

    const classData = await Test.find({ className: classId , subject: subjectId });
    if (!classData || classData.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const performanceByDate = {};

    classData.forEach((entry) => {
        entry.tests.forEach((test) => {
            if (!test.date || typeof test.score !== "number") {
                return;
            }

            const dateKey = new Date(test.date).toISOString().split("T")[0]; // Ensure consistent date format

            if (!performanceByDate[dateKey]) {
                performanceByDate[dateKey] = { sum: 0, count: 0 };
            }

            if (test.score > -1) {
              const total = test.totalMarks > 0 ? test.totalMarks : 100;
              performanceByDate[dateKey].sum += (test.score * 100) / total;
              performanceByDate[dateKey].count += 1;
            }
        });
    });

    const averagePerformance = Object.entries(performanceByDate).map(([date, data]) => ({
      date, // Formatted as YYYY-MM-DD
      score: data.count > 0 ? Math.round((data.sum / data.count) * 100) / 100 : 0,  
    }));

    return res.json({ success: true, data: averagePerformance });
  } catch (error) {
    console.error("Error fetching average data:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

const testsScore = async (req, res) => {
  try {
    const { testDate } = req.query; // Get the test date from the request query

    if (!testDate) {
      return res.status(400).json({ error: "Test date is required" });
    }

    const results = await Test.find({ "tests.date": testDate })
      .populate("student", "name") 

    if (!results.length) {
      return res.status(404).json({ message: "No test scores found for the given date" });
    }

    // Format response to include only the required details (with null-safe student access)
    const response = results.map((test) => ({
      studentId: test.student?._id || test.student,
      studentName: test.student?.name || "Unknown Student",
      subject: test.subject,
      className: test.className,
      scores: test.tests
      .filter((t) => {
        const recordDate = new Date(t.date).toISOString().split("T")[0];
        const queryDate = new Date(testDate).toISOString().split("T")[0];
        return recordDate === queryDate;
      })
      .map((t) => ({
        score: t.score,
        totalMarks: t.totalMarks,
        mentorId: t.mentorId,
        paperLink: t.fileId,
        date: t.date,
      })),
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching test scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = { 
    submitScore, 
    testData,
    graphData, 
    averageData,
    testsScore 
};
