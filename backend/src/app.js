import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import ocrRoutes from "./routes/ocrRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js"
import qrRoutes from "./routes/qrRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"
import auditRoutes from "./routes/auditRoutes.js"
import iceRoutes from "./routes/emergencyRoutes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/audit/", auditRoutes)
app.use("api/ice", iceRoutes)

export default app;
