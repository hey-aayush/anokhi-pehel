const express = require("express");
const User = require("../models/User");
const router = express.Router();
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { updateMentor } = require("../controller/userController");
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

let upload = multer({ storage, fileFilter });
app.use(express.urlencoded({ extended: true }));
// Serve uploaded photos
app.use("/uploads", express.static("uploads"));

router.route("/createUser").post(upload.single("photo"), async (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const role = req.body.role;
  const regnumber = req.body.regnumber;
  const email = req.body.email;
  const photo = req.file.filename;
  const Ppassword = req.body.password;
  const branch = req.body.branch;
  const saltRounds = 10;

  try {
    // Check if user with the same registration number already exists
    const existingUser = await User.findOne({ regnumber: regnumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this registration number already exists" });
    }

    const password = await bcrypt.hash(Ppassword, saltRounds);
    const newUserData = {
      name,
      phone,
      role,
      regnumber,
      password,
      email,
      photo,
      branch,
    };

    const newUser = new User(newUserData);

    await newUser.save();
    res.json("Mentor Added");
  } catch (error) {
    console.error(error);
    res.status(400).json("Error: " + error.message);
  }
});

// changePassword
router.route("/changePassword").post(async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the old password provided by the user with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password with the new hashed password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/update-mentor", upload.single("photo"), updateMentor);

router.get("/mentorList", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Alumni" } }); // Exclude users with role "Alumni"

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//Route to get the Final Year and Alumni list
router.get("/teamList", async (req, res) => {
  try {
    const users = await User.find();
    // Sort users by name in alphabetical order
    users.sort((a, b) => a.name.localeCompare(b.name));
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/deleteUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/updateUserRole", async (req, res) => {
  const { id } = req.query; // Get user ID from query parameters
  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user's role
    user.role = req.body.role;
    await user.save();

    // Respond with success message
    return res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getMentorByUserId", async (req, res) => {
  // Extract the user ID from the request query parameters
  const mentor_id = req.query.mentorId;

  try {
    // Query the database to retrieve the user based on the ID
    const mentor = await User.findById(mentor_id);

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(mentor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
