import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from '../config/multer.js'
import {
    generateHospitalUploadQR,
    hospitalUpload
} from "../controllers/hospitalController.js";

const router = express.Router();

router.post("generate", authMiddleware, generateHospitalUploadQR);

router.post("upload/:token", authMiddleware, hospitalUpload);

export default router;