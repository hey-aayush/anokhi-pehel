const mongoose = require("mongoose");

const { Schema } = mongoose;

const ClassDescriptionSchema = new Schema({
  classId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  subject: {
    type: String,
    required: true,
  },
  mentorId: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
});

ClassDescriptionSchema.index({ classId: 1, date: 1 });
ClassDescriptionSchema.index({ date: 1 });

module.exports = mongoose.model("classtopic", ClassDescriptionSchema);
