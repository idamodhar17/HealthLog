import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { generateQRToken } from "../controllers/qrController.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateQRToken);

export default router;