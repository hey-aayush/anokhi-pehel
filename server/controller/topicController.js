const Topic = require("../models/Topic");

const parseTargetDate = (date) => {
  if (!date || date === "undefined" || date === "null") {
    return new Date().toISOString().split("T")[0];
  }
  const dateStr =
    typeof date === "string" && date.includes("T")
      ? date.split("T")[0]
      : String(date).trim();
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    return new Date().toISOString().split("T")[0];
  }
  return dateStr;
};

const getTopicCovered = async (req, res) => {
  const { classId, date } = req.query;
  const targetDate = parseTargetDate(date);

  try {
    const filter = {
      date: {
        $gte: new Date(targetDate + "T00:00:00.000Z"),
        $lte: new Date(targetDate + "T23:59:59.999Z"),
      },
    };
    if (classId) {
      filter.classId = classId;
    }

    const topicsCovered = await Topic.find(filter);

    res.status(200).json({ topicsCovered });
  } catch (error) {
    console.error("Error fetching topics covered:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTopicCovered,
  parseTargetDate,
};
