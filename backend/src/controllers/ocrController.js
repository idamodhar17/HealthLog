import Tesseract from "tesseract.js";
import Record from "../models/Record.js";
import Timeline from "../models/Timeline.js";

export const extractText = async (req, res) => {
  try {
    const { recordId } = req.body;

    if (!recordId) {
      return res.status(400).json({ message: "recordId is required." });
    }

    const record = await Record.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    // Run OCR
    const result = await Tesseract.recognize(record.fileUrl, "eng");
    const extractedText = result?.data?.text?.trim() || "";

    // Update record
    record.extractedText = extractedText;
    await record.save();

    // Add timeline entry
    await Timeline.create({
      userId: req.user._id,
      recordId,
      date: new Date(),
      summary: extractedText.substring(0, 120) + "..."
    });

    res.status(200).json({
      message: "OCR Extraction successful.",
      extractedText
    });
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ message: "OCR failed. Try again." });
  }
};

export const getAllExtractedText = async (req, res) => {
  try {
    const userId = req.user._id;

    const records = await Record.find({ userId })
      .select("extractedText fileUrl createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
    
  } catch (error) {
    console.error("Fetch OCR Text Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch extracted text",
    });
  }
};