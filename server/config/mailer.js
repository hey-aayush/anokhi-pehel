const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  //service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});

module.exports = transporter;