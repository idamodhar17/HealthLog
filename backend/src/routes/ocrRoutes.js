import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { extractText } from "../controllers/ocrController.js";

const router = express.Router();

router.post("/extract", authMiddleware, extractText);

export default router;