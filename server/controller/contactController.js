const transporter = require("../config/mailer");

const submitContact = async (req, res) => {
  const body = req.body || {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const alumni = body.alumni === "yes" ? "Yes" : body.alumni === "no" ? "No" : "Not specified";

  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 || phone.length > 30 || address.length > 200 ||
      !message || message.length > 3000) {
    return res.status(400).json({ message: "Please enter a valid name, email, and message." });
  }

  const recipient = process.env.CONTACT_EMAIL || process.env.email;
  if (!recipient || !process.env.email || (process.env.SMTP_AUTH !== "false" && !process.env.password)) {
    return res.status(503).json({ message: "Contact is temporarily unavailable. Please try again later." });
  }

  try {
    await transporter.sendMail({
      from: `Anokhi Pehel <${process.env.email}>`,
      to: recipient,
      replyTo: email,
      subject: "New Anokhi Pehel contact message",
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\nAlumni: ${alumni}\n\nMessage:\n${message}`,
    });
    return res.status(200).json({ message: "Your message has been sent. Thank you for reaching out." });
  } catch (error) {
    return res.status(502).json({ message: "Unable to send your message. Please try again later." });
  }
};

module.exports = { submitContact };
