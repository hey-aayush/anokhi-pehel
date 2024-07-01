const User = require("../models/User");

const updateMentor = async (req, res) => {
  try {
    const { field, newValue } = req.body;
    const mentorId = req.body.userId;

    // Find mentor by ID
    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Update mentor field based on the provided field value
    if (field === "name") {
      mentor.name = newValue;
    } else if (field === "phone") {
      mentor.phone = newValue;
    } else if (field === "instagram") {
      mentor.socialMedia.instagram = newValue;
    } else if (field === "linkedin") {
      mentor.socialMedia.linkedin = newValue;
    } else if (field === "branch") {
      mentor.branch = newValue;
    } else if (field === "photo") {
      if (req.file) {
        // Check if file was uploaded
        mentor.photo = req.file.filename; // Use the uploaded filename
      } else {
        return res.status(400).json({ error: "No file uploaded" });
      }
    } else {
      return res.status(400).json({ error: "Invalid field" });
    }

    // Save updated mentor
    await mentor.save();

    // Send success response
    res.status(200).json({ message: "Mentor updated successfully" });
  } catch (error) {
    console.error("Error updating mentor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateMentor };
