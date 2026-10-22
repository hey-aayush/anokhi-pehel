const mongoose = require("mongoose");

const { Schema } = mongoose;

const StudentAdmissionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mentorId: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  aadhar: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  photo: {
    type: String,
  },
  inAnokhiPehel: {
    type: String,
    default: false,
    required: true,
  },
});

StudentAdmissionSchema.index({ aadhar: 1 });

module.exports = mongoose.model("Admission", StudentAdmissionSchema);
