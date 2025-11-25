import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { encrypt, decrypt } from "../utils/crypto.js";
import { hashEmail } from "../utils/hashEmail.js";

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOtp = () => ({
  otp: Math.floor(100000 + Math.random() * 900000).toString(),
  expires: Date.now() + 10 * 60 * 1000,
});

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // Validate email format
    if (typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const emailHash = hashEmail(email);

    const existing = await User.findOne({ emailHash });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const encryptedName = encrypt(name);
    const encryptedEmail = encrypt(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const { otp, expires } = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await User.create({
      name: encryptedName,
      emailEncrypted: encryptedEmail,
      emailHash,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpires: expires,
      isVerified: false,
    });

    // SEND OTP SAFELY
    try {
      await transporter.sendMail({
        to: email,
        subject: "Email Verification OTP - HealthLog",
        html: `
          <p>Hello <b>${name}</b>,</p>
          <p>Your OTP to verify your HealthLog account is:</p>
          <h2>${otp}</h2>
          <p>This OTP expires in <b>10 minutes</b>.</p>
        `,
      });
    } catch (err) {
      console.error("Email send error:", err);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    return res.status(201).json({
      message: "OTP sent to your email. Please verify to complete signup.",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailHash = hashEmail(email);
    const user = await User.findOne({ emailHash });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(400).json({ message: "Verify your email first" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        name: decrypt(user.name),
        email: decrypt(user.emailEncrypted),
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// VERIFY EMAIL OTP
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const emailHash = hashEmail(email);
    const user = await User.findOne({ emailHash });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp)
      return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// RESEND OTP
export const resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const emailHash = hashEmail(email);
    const user = await User.findOne({ emailHash });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const { otp, expires } = generateOtp();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = expires;

    await user.save();

    try {
      await transporter.sendMail({
        to: email,
        subject: "Your New OTP - HealthLog",
        html: `
          <p>Your new OTP is:</p>
          <h2>${otp}</h2>
          <p>Expires in 10 minutes.</p>
        `,
      });
    } catch (err) {
      console.error("Email send error:", err);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    return res.json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};