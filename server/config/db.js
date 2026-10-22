const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      console.warn("DB_URL environment variable is missing".bgYellow.black);
      return;
    }
    await mongoose.connect(dbUrl);
    console.log(`Mongodb connected: ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.error(`Mongodb Server Issue: ${error.message}`.bgRed.white);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
