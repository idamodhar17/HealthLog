import express from "express";
const router = express.Router();
import { registerUser, loginUser, verifyEmailOtp, resendEmailOtp } from "../controllers/authController.js";

router.post("/register", registerUser);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/resend-email-otp", resendEmailOtp);
router.post("/login", loginUser);

export default router;