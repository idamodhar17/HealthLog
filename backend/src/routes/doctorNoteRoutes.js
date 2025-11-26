import express from "express";
import { addNoteViaQR } from "../controllers/doctorNoteController.js";

const router = express.Router();

router.post("/add/:token", addNoteViaQR);

export default router;