require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
console.log("Starting server")
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email from .env
        pass: process.env.EMAIL_PASS  // Your app password from .env
    }
});
console.log("Setting up transporter ")
// API Route for Sending Email
app.post("/send-email", async (req, res) => {
    console.log("Inside send email")
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // Sending email to the user
        subject: "Thank you for registering as a contributor!",
        text: `Hello ${name},\n\nThank you for your interest in contributing! We will get back to you soon.\n\nYour Message:\n${message}\n\nBest Regards,\nFood Rescue Team`
    };

    try {
        console.log(mailOptions)
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info);
        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
