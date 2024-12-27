const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/sendEmail", async (req, res) => {
  const { name, email, message, tel, address, alumni } = req.body;

 



  // Set up Nodemailer transporter (static email for authentication)
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use other services too
    auth: {
      user: process.env.email, // The fixed email (used to send the email)
      pass: process.env.password, // App password for the sending email
    },
  });

  // Configure email options
  const mailOptions = {
    from: email, // This is the dynamic sender's email (provided by the user)
    to: process.env.email, // This is your email where the message will be received
    subject: `Message from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Address: ${address}
      Phone: ${tel}
      Alumni: ${alumni}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
