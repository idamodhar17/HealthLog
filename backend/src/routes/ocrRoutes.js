import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { extractText, getAllExtractedText } from "../controllers/ocrController.js";

const router = express.Router();

router.post("/extract", authMiddleware, extractText);
router.get("/all", authMiddleware, getAllExtractedText);

export default router;