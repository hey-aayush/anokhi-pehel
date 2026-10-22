const mongoose = require("mongoose");

const { Schema } = mongoose;

const AttendanceSchema = new Schema({
  classId: {
    type: String,
    required: true,
  },
  mentorId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  attendance: [
    {
      studentId: {
        type: String,
        required: true,
      },
      status: {
        type: String, // Change the type to String
        enum: ["present", "absent"], // Add an enum to restrict values to "present" and "absent"
        required: true,
        // default: "present", // Set a default value if needed
      },
    },
  ],
});

AttendanceSchema.index({ classId: 1, date: 1 });
AttendanceSchema.index({ date: 1 });

module.exports = mongoose.model("attendance", AttendanceSchema);
