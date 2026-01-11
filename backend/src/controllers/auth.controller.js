// src/controllers/auth.controller.js
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendResetEmail } from "../services/brevoEmail.js";

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendResetEmail(email, link);

    res.json({ message: "Reset link sent" });
  } catch (error) {
    console.error(
      "FORGOT PASSWORD BREVO ERROR:",
      error?.response?.body || error
    );

    // IMPORTANT: do NOT lie with 401
    res.status(500).json({
      message: "Brevo Campaign API failed",
      details: error?.response?.body || "Unknown error",
    });
  }
};


// VERIFY TOKEN
export const verifyToken = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  res.json({ message: "Valid token" });
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();
  res.json({ message: "Password updated" });
};
// src/controllers/auth.controller.js

export const register = async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashed,
  });

  res.status(201).json({ message: "Registration successful" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email not registered" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  res.json({ message: "Login successful" });
}