import QRToken from "../models/QRToken.js";
import User from "../models/User.js";
import Record from "../models/Record.js";
import Timeline from "../models/Timeline.js";
import Audit from "../models/Audit.js"

export const doctorView = async (req, res) => {
  try {
    const { token } = req.params;

    const tokenData = await QRToken.findOne({ token });

    if (!tokenData) return res.status(404).json({ message: "Invalid token" });

    if (tokenData.expiresAt < Date.now())
      return res.status(400).json({ message: "Token expired" });

     const patient = await User.findById(tokenData.userId).select(
      "-password -otp -otpExpires -verificationToken -verificationTokenExpires"
    );

    if(!patient)
        return res.status(404).json({ message: "Patient not found" });

    const records = await Record.find({ userId: patient._id })
    .sort({ createdAt: -1 });

    const timeline = await Timeline.find({ userId: patient._id })
    .sort({ date: -1 });

    await Audit.create({
        userId: patient._id,
        tokenUsed: token,
        ip: req.ip,
        detailsViewed: "records_and_timeline"
    })

    return res.json ({
        message: "Doctor view data",
        patient,
        records,
        timeline
    })
  } catch (error) {
    console.error("Doctor view error: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

