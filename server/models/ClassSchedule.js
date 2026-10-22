const mongoose = require("mongoose");

const { Schema } = mongoose;

const ScheduleSchema = new Schema({
  className: {
    type: String,
    required: true,
  },
  schedule: [
    {
      day: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      mentor: {
        type: String,
        required: true,
      },
      mentor1: {
        type: String,
        required: false,
      },
    },
  ],
});

ScheduleSchema.index({ className: 1 });

module.exports = mongoose.model("schedule", ScheduleSchema);
