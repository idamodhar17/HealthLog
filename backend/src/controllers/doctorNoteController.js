import DoctorNote from "../models/DoctorNote.js";
import QRToken from "../models/QRToken.js";

export const addNoteViaQR = async (req, res) => {
    try {
        const { token } = req.params;
        const { doctorName, diagnosis, recommendations, followUpDate } = req.body;

        const tokenData = await QRToken.findOne({ token });

        if(!tokenData)
            return res.status(404).json({ message: "Invalid Token" });

        if(tokenData.expiresAt < Date.now())
            return res.status(400).json({ message: "Token Expired" });

        const note = await DoctorNote.create({
            doctorName,
            diagnosis,
            reccomendations,
            followUpDate,
            tokenUsed: token,
        });

        return res.status(201).json({ message: "Note added", note });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};