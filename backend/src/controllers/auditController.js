import Audit from "../models/Audit.js";

export const getAuditLogs = async (req, res) => {
    try {
        const logs = await Audit.find({ userId: req.user._id })
        .sort({ accessedAt: -1 });

        res.json({ logs });
    } catch (error) {
        console.error("Audit Logs Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}