const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  login,
  getUserData,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");
const { createRateLimiter } = require("../middlewares/rateLimiter");

const cors = require("cors");

router.use(cors());

// Rate limiters for brute-force and email spam prevention
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again after 15 minutes.",
});

const forgotPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many password reset requests. Please try again after 15 minutes.",
});

router.post(
  "/login",
  loginLimiter,
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  login
);

router.get("/userData", getUserData);

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

router.get("/reset-password/:id/:token", resetPassword);


module.exports = router;
