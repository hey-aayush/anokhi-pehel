const Settings = require("../models/Settings");

const allSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching settings" });
  }
};

const updateSettings = async (req, res) => {
  const { key, value } = req.body;

  try {
    const setting = await Settings.findOneAndUpdate(
      { key },
      { value },
      { new: true }
    );

    if (!setting) {
      return res.status(400).json({ error: "Setting not found" });
    }

    res.json({ success: true, message: "Setting updated successfully" });
  } catch (error) {
    console.error("Error updating setting", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { allSettings, updateSettings };
