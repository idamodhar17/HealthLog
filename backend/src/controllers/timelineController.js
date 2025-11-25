import Timeline from "../models/Timeline.js";

export const getTimeline = async (req, res) => {
    try {
        const timeline = await Timeline.find({ userId: req.user._id })
        .populate("recordId", "fileUrl fileType extractedText")
        .sort({ date: -1 });

        return res.json({ timeline });
    } catch (error) {
        console.error("Timeline Error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
}