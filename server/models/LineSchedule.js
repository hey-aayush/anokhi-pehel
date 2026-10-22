const mongoose = require("mongoose");

const { Schema } = mongoose;

const LineScheduleSchema = new Schema({
  location: {
    type: String,
    required: true,
  },
  schedule: [
    {
      day: {
        type: String,
        required: true,
      },
      pickup: {
        type: String,
        required: true,
      },
      drop: {
        type: String,
        required: true,
      },
      pickup1: {
        type: String,
        required: false,
      },
      drop1: {
        type: String,
        required: false,
      },
    },
  ],
});

LineScheduleSchema.index({ location: 1 });

module.exports = mongoose.model("lineschedule", LineScheduleSchema);
