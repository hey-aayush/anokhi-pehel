const multer = require("multer");

const paperStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./papers/"); // Save files in the "papers" directory
  },
  filename: function (req, file, cb) {
    cb(null, "Test_" + Date.now()); // Unique filename
  },
});

const paperFileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or Word documents are allowed"), false);
  }
};

const paperUpload = multer({
  storage: paperStorage,
  fileFilter: paperFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = { paperUpload };
