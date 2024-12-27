const express = require("express");
require("colors");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const path = require("path");

// Load environment variables from .env file
dotenv.config();






// Use port from environment or default to 5000 if undefined
const PORT = process.env.PORT || 5000;  

const mongoDB = require("./config/db");
const router = require("./routers");
const emailRoutes = require("./routers/emailRoutes");

// Connect to MongoDB
mongoDB();

app.use(cors());

// Allow CORS for your frontend
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://anokhi-pehel.azurewebsites.net"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());

// Serve images
app.use("/images", express.static("images"));
app.use("/antyodayaImages",express.static("antyodayaImages"));
// Routes
app.use("/api/v1/user", router);
app.use("/api/v1/email", emailRoutes);

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, "../client/dist")));

// Send the frontend HTML file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`.bgCyan.white);
});




