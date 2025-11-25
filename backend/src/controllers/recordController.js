import Record from "../models/Record.js";
import Timeline from "../models/Timeline.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadRecord = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "HealthLog",
            resource_type: "auto",
        });

        fs.unlinkSync(req.file.path);

        // Save Cloudinary URL in DB
        const record = await new Record({
            userId: req.user.id,
            fileUrl: result.secure_url,
            fileId: result.public_id,
            fileType: req.file.mimetype,
            date: new Date(),
            extractedText: "",
        }).save();

        // Add timeline entry
        await new Timeline({
            userId: req.user.id,
            recordId: record._id,
            date: new Date(),
            summary: "Medical report uploaded. OCR Processing pending.",
        }).save();

        return res.status(201).json({
            message: "File uploaded successfully",
            record,
        });

    } catch (error) {
        console.error("Upload Record Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getUserRecords = async (req, res) => {
    try {
        const records = await Record.find({ userId: req.user._id })
        .sort({ createdAt: -1 });

        return res.json({ recors });
    } catch (error) {
        console.error("Get Records Error:", error.message);
        res.status(500).json({ message: "Server error!" });
    }
};