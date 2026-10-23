const express = require("express");
const Student = require("../models/Student");
const Test = require("../models/TestScore");
const router = express.Router();
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const app = express();
const {
  getStudentsFromLastAttendance,
  promoteStudent,
  changeStatus,
  getStudentCounts,
} = require("../controller/studentController");
const { verifyUser, requireAdmin } = require("../middlewares/auth.middlewares.js");
const { listStudents } = require("../controller/listController");

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

router.route("/addStudent").post(verifyUser, upload.single("photo"), async (req, res) => {
  const name = req.body.name;
  const className = req.body.class;
  const phone = req.body.phone;
  const location = req.body.location;
  const mode = req.body.mode;
  const dob = req.body.dob;
  const aadhar = req.body.aadhar;
  const address = req.body.address;
  const school = req.body.school;
  const photo = req.file ? req.file.filename : "";

  try {
    // Check if student with the same Aadhar number already exists
    const existingStudent = await Student.findOne({ aadhar: aadhar });
    if (existingStudent) {
      return res.json("Student with this Aadhar number already exists");
    }

    const newStudentData = {
      name,
      className,
      phone,
      location,
      mode,
      dob,
      aadhar,
      address,
      school,
      photo,
    };

    const newStudent = new Student(newStudentData);

    await newStudent.save();
    res.json("Student Added");
  } catch (error) {
    res.json("ALL INPUT IS NOT FILLED");
  }
});

router.get("/studentList", verifyUser, listStudents);

router.get("/getstudentByUserId", verifyUser, async (req, res) => {
  const student_id = req.query.studentid;

  try {
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getMarksByUserId", verifyUser, async (req, res) => {
  try {
    const studentId = req.query.studentid;
    const marks = await Test.find({ "score.studentId": studentId });

    if (marks && marks.length > 0) {
      res.json(marks);
    } else {
      res.json({ message: "Data not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/students", verifyUser, async (req, res) => {
  try {
    const selectedClass = req.query.class;

    const students = await Student.find({ className: selectedClass });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/getStudentByUserId", verifyUser, async (req, res) => {
  try {
    const { studentIds } = req.body;

    const students = await Student.find({ _id: { $in: studentIds } });

    const studentNames = students.map((student) => ({
      _id: student._id,
      name: student.name,
    }));

    res.json(studentNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update student details by ID
router.put("/updateStudent", verifyUser, async (req, res) => {
  try {
    const id = req.body._id;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/deleteStudents/:id", verifyUser, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findOneAndDelete({ _id: id });

    if (deletedStudent) {
      res
        .status(200)
        .json({ message: "Student deleted successfully", deletedStudent });
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/studentTable", verifyUser, getStudentsFromLastAttendance);
router.put("/promoteStudent/:id", verifyUser, requireAdmin, promoteStudent);
router.put("/updateStudentStatus/:id", verifyUser, requireAdmin, changeStatus);
router.get("/studentCounts", verifyUser, getStudentCounts);

module.exports = router;
