import crypto from "crypto";
import HospitalUploadToken from "../models/HospitalUploadToken.js";
import User from "../models/User.js";
import Record from "../models/Record.js";
import Timeline from "../models/Timeline.js";
import cloudinary from "../config/cloudinary.js";
import { decrypt } from "../utils/crypto.js";
import qrcode from "qrcode";
import Tesseract from "tesseract.js";
import fs from "fs";

export const generateHospitalUploadQR = async (req, res) => {
    try {
        const userId = req.user._id;

        const token = crypto.randomBytes(20).toString("hex");
        const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour

        await HospitalUploadToken.create({ userId, token, expiresAt });

        const patient = await User.findById(userId).select("name");

        const decryptedPatient = {
              ...patient._doc,
              name: patient.name ? decrypt(patient.name) : null,
        }

        const encodedName = Buffer.from(decryptedPatient.name).toString("base64");

        const uploadUrl = `${process.env.CLIENT_URL}/hospital-upload/${token}?p=${encodedName}`;

        const qrImage = await qrcode.toDataURL(uploadUrl);

        res.json({
            message: "Hospital Upload QR Generated",
            token,
            qrImage,
            patientName: decryptedPatient,
            expiresAt,
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const hospitalUpload = async (req, res) => {
    try {
        const { token } = req.params;

        const tokenData = await HospitalUploadToken.findOne({ token });

        if (!tokenData)
            return res.status(404).json({ message: "Invalid token" });

        if (tokenData.expiresAt < Date.now())
            return res.status(400).json({ message: "Token expired" });

        if (!req.file)
            return res.status(400).json({ message: "File required" });

        const patientId = tokenData.userId;

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "HealthLog",
            resource_type: "auto",
        });

        fs.unlinkSync(req.file.path);

        const record = await new Record({
            userId: patientId,
            fileUrl: uploadResult.secure_url,
            fileId: uploadResult.public_id,
            fileType: req.file.mimetype,
            date: new Date(),
            extractedText: "",
        }).save();

        const ocrResult = await Tesseract.recognize(uploadResult.secure_url, "eng");
        const extractedText = ocrResult.data.text.trim();

        record.extractedText = extractedText;
        await record.save();

        await new Timeline({
            userId: patientId,
            recordId: record._id,
            date: new Date(),
            summary: extractedText.substring(0, 100) + "...",
        }).save();

        return res.status(201).json({
            message: "File uploaded & processed successfully",
            record,
        });

    } catch (error) {
        console.error("Hospital Upload Error:", error);
        res.status(500).json({ message: "Upload failed" });
    }
};
