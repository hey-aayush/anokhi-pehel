const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  //service: 'gmail',
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  ...(process.env.SMTP_AUTH === "false" ? {} : { auth: {
    user: process.env.email,
    pass: process.env.password,
  } }),
});

module.exports = transporter;
