import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  saveEmergencyProfile,
  generateEmergencyQR,
  viewEmergencyProfile
} from "../controllers/emergencyController.js";

const router = express.Router();

router.post("/save", authMiddleware, saveEmergencyProfile);

router.post("/generate", authMiddleware, generateEmergencyQR);

router.get("/view/:token", viewEmergencyProfile);

export default router;
