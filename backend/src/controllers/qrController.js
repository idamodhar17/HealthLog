import crypto from "crypto";
import ORToken from "../models/QRToken.js";
import qrcode from "qrcode";

export const generateQRToken = async (res, req) => {
    try {
        const userId = req.user._id;

        const token = crypto.randomBytes(20).toString("hex");
        const expiresAt = Date.now() + 1000 * 60 * 30;


        // Save token to DB 
        await QRToken.create ({
            userId,
            toke,
            expiresAt,
        });

        // Generate QR Code Image
        const qrDataUrl = await qrcode.toDatUrl(
            `${process.env.CLIENT_URL}/doctor/${token}`
        );

        return res.json ({ 
            message: "QR Code Generated",
            token,
            qrImage: qrDataUrl,
            expiresAt,
        });

    } catch (error) {
        console.error("QR Error:", error.message);
        res.status(500).json({message: "Server error"})
    }
};