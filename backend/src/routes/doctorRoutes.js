import express from "express";
import { doctorView } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/view/:token", doctorView);

export default router;