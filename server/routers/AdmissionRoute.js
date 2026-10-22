const express = require("express");
const Admission = require("../models/Admission");
const router = express.Router();
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { verifyUser, requireAdmin } = require("../middlewares/auth.middlewares");
const app = express();

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

router.route("/addStudentAdmission").post(verifyUser, upload.single("photo"), async (req, res) => {
  const name = req.body.name;
  const mentorId = req.body.mentorId;
  const className = req.body.class;
  const inAnokhiPehel = req.body.inAnokhiPehel;
  const phone = req.body.phone;
  const location = req.body.location;
  const dob = req.body.dob;
  const aadhar = req.body.aadhar;
  const address = req.body.address;
  const discription = req.body.discription;
  const school = req.body.school;
  const photo = req.file ? req.file.filename : "";
  try {
    const existingStudentAdmission = await Admission.findOne({ aadhar: aadhar });
    if (existingStudentAdmission) {
      return res.json("Student with this Aadhar number already exists");
    }
    const newStudentAdmissionData = {
      name,
      mentorId,
      className,
      inAnokhiPehel,
      phone,
      location,
      dob,
      aadhar,
      address,
      discription,
      school,
      photo,
    };

    const newStudentAdmission = new Admission(newStudentAdmissionData);

    await newStudentAdmission.save();
    res.json("Student Admission Added");
  } catch (error) {
    res.json("ALL INPUT IS NOT FILLED");
  }
});

router.get("/admittedStudentList", verifyUser, async (req, res) => {
  try {
    const students = await Admission.find();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getAdmittedStudentByUserId", verifyUser, async (req, res) => {
  const student_id = req.query.studentid;

  try {
    const student = await Admission.findById(student_id);
    if (!student) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteAdmittedStudents/:id", verifyUser, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Admission.findOneAndDelete({ _id: id });

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

module.exports = router;
