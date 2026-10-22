const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const User = require("../models/User");
const {
  generateToken,
  verifyToken,
  generateTempToken,
} = require("../config/secret");
const transporter = require("../config/mailer.js");

const login = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success, error: "Try Logging in with correct credentials" });
    }

    if (!user.isActive) {
      return res.status(200).json({
        success,
        error: "Your account is not active. Please contact admin.",
      });
    }

    const pwdCompare = await bcrypt.compare(password, user.password);
    if (!pwdCompare) {
      return res
        .status(200)
        .json({ success, error: "Try Logging in with correct credentials" });
    }

    success = true;
    const authToken = generateToken(user.id);
    res.json({ success, authToken });
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
};

const getUserData = async (req, res) => {
  // Get the token from the request header
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded.purpose === "password_reset") {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Extract user ID from the decoded token
      const userId = decoded.user?.id || decoded.userId || decoded.id;

      // Fetch user data from the database excluding password hash
      const user = await User.findById(userId).select("-password").lean();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isActive === false) {
        return res.status(401).json({ message: "Your account is not active. Please contact admin." });
      }

      // Return user data as JSON
      res.json({ success: true, data: user });
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Token not provided" });
  }
};


//Generate link with temporary token to reset the password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    // Check if an account is associated with entered email id
    const oldUser = await User.findOne({ email });
    // Prevent user enumeration: respond identically if email is not found
    if (!oldUser) {
      return res.status(200).send({
        message: "Password reset instructions sent to your email.",
        success: true,
      });
    }

    // Embed current password hash snippet as nonce: once password changes, token is invalidated
    const nonce = oldUser.password ? oldUser.password.slice(-10) : "";
    const token = generateTempToken(oldUser.id, nonce);

    // Resolve base url dynamically to support different deployment environments
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.get("host") || "anokhi-pehel.azurewebsites.net";
    const baseUrl = process.env.BASE_SERVER_URL || `${protocol}://${host}`;
    const link = `${baseUrl.replace(/\/+$/, "")}/api/v1/user/reset-password/${oldUser._id}/${token}`;

    // The mail content to be sent to user
    var mailOptions = {
      from: `Anokhi Pehel <${process.env.email}>`,
      to: `${email}`,
      subject: "Reset your login password",
      text: `Dear User,

      You have requested to reset your password. Please follow the link below to reset your password:
      
      ${link}
      
      If you did not request this, please ignore this email.
      
      Regards,
      Web Team,
      Anokhi Pehel`,
    };

    // Function to send mail
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(500).send({
          message: "Something went wrong",
          success: false,
        });
      } else {
        return res.status(200).send({
          message: "Password reset instructions sent to your email.",
          success: true,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong",
      success: false,
    });
  }
};

// TO reset password
const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  try {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.status(400).send({
        message: "Invalid or expired reset link",
        success: false,
      });
    }

    // Verify the token received as param
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(400).send({
        message: "Invalid or expired reset token",
        success: false,
      });
    }

    if (!decoded || (decoded.user?.id !== id && decoded.userId !== id) || decoded.purpose !== "password_reset") {
      return res.status(400).send({
        message: "Invalid or expired reset token",
        success: false,
      });
    }

    // Verify single-use nonce against current user password
    const expectedNonce = oldUser.password ? oldUser.password.slice(-10) : "";
    if (decoded.nonce && decoded.nonce !== expectedNonce) {
      return res.status(400).send({
        message: "This password reset link has already been used.",
        success: false,
      });
    }

    // Generation of a random secure password
    const password = generator.generate({
      length: 12,
      numbers: true,
      symbols: false,
    });

    // Hashing and updation of password in database
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    // Content to be mailed
    var mailOptions = {
      from: `Anokhi Pehel <${process.env.email}>`,
      to: `${oldUser.email}`,
      subject: "Updated Password",
      text: `Dear User,
  
        You have requested to reset your password. This is your new password:
        
        ${password}
        
        Use it to login to Anokhi Pehel website and change this password after successful login.
        
        Regards,
        Web Team,
        Anokhi Pehel`,
    };

    // Function to send mail
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(500).send({
          message: "Something went wrong",
          success: false,
        });
      } else {
        return res
          .status(200)
          .send(
            "New password has been sent to mail. Please Check spam section as well if not received."
          );
      }
    });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};


module.exports = { login, getUserData, forgotPassword, resetPassword };
