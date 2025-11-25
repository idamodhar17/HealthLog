import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../config/multer.js";
import { uploadRecord, getUserRecords } from "../controllers/recordController.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadRecord);
router.get("/all", authMiddleware, getUserRecords);

export default router;