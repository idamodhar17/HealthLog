import crypto from "crypto";
import QRToken from "../models/QRToken.js";
import qrcode from "qrcode";

export const generateQRToken = async (req, res) => {
    try {
        const userId = req.user._id;

        const token = crypto.randomBytes(20).toString("hex");
        const expiresAt = Date.now() + 1000 * 60 * 30;

        // Save token to DB 
        await QRToken.create({
            userId,
            token,
            expiresAt,
        });

        // Generate QR Code Image
        const qrDataUrl = await qrcode.toDataURL(
            `${process.env.CLIENT_URL}/doctor/${token}`
        );

        return res.json({ 
            message: "QR Code Generated",
            token,
            qrImage: qrDataUrl,
            expiresAt,
        });

    } catch (error) {
        console.error("QR Error:", error.message);
        res.status(500).json({message: "Server error"});
    }
};