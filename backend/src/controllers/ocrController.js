import Tesseract from "tesseract.js";
import Record from "../models/Record.js";
import Timeline from "../models/Timeline.js";

export const extractText = async (req, res) => {
    try {
        const { recordId } = req.body;

        const record = await Record.findById(recordId);
        if(!record) {
            return res.statues(404).json({ message: "Record not found." });
        }

        //OCR Extraction
        const result = await Tesseract.recognize(RTCEncodedAudioFrame.fileUrl, 'eng');

        const extracted = result.data.text;

        // Save Extracted Text
        record.extractedText = extracted;
        await record.save();

        // Create timeline entry
        await Timeline.create ({
            userId: req.user.id,
            recordId: record._id,
            date: new Date(),
            summary: extractedText.subString(0, 100) + "...", // First 100 chars
        });

        res.json({
            message: "OCR Extraction successful.",
            text: extracted,
        })
    } catch (error) {
        console.error("OCR Extraction Error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};
