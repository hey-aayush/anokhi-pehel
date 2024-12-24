const mongoose = require("mongoose");

const { Schema } = mongoose;

const settingsSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Boolean, required: true },
});

module.exports = mongoose.model("settings", settingsSchema);
