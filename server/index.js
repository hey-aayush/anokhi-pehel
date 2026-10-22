// Compatibility shim for Node.js 24+ where SlowBuffer is deprecated/removed
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

const express = require("express");
require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const mongoDB = require("./config/db");
const router = require("./routers");
const { ensurePapersFolder } = require("./utils/fileUtils");

// Connect to MongoDB
mongoDB();

app.use(cors());

// Ensure papers folder exists before paper uploads
ensurePapersFolder();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/antyodayaImages", express.static(path.join(__dirname, "antyodayaImages")));

// API Routes
app.use("/api/v1/user", router);

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`.bgCyan.white);
});
