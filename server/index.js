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

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(cors());

// Ensure papers folder exists before paper uploads
ensurePapersFolder();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/antyodayaImages", express.static(path.join(__dirname, "antyodayaImages")));

// API Routes
app.use("/api/v1/user", router);

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds the allowed limit" });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err.message && err.message.includes("Only PDF or Word documents are allowed")) {
    return res.status(400).json({ error: err.message });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`.bgCyan.white);
});
