import EmergencyProfile from "../models/EmergencyProfile.js";
import EmergencyQRToken from "../models/EmergencyQRToken.js";
import crypto from 'crypto';
import qrcode from 'qrcode';

export const saveEmergencyProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const { name, bloodGroup, allergies, medications, emergencyContacts } = req.body;

        let profile = await EmergencyProfile.findOne({ userId });

        if(profile){
            profile.name = name;
            profile.bloodGroup = bloodGroup;
            profile.allergies = allergies;
            profile.medications = medications;
            profile.emergencyContacts = emergencyContacts;
            profile.updatedAt = new Date();
            await profile.save();
        } else {
            profile = await EmergencyProfile.Create({
                name,
                bloodGroup,
                allergies,
                medications,
                emergencyContacts,
            });
        }

        return res.json({ message: "Emergency Profile Saved", profile });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const generateEmergencyQR = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await EmergencyProfile.findOne({ userId });

    if (!profile)
      return res.status(404).json({ message: "Create emergency profile first" });

    const token = crypto.randomBytes(20).toString("hex");

    await EmergencyQRToken.create({
      userId,
      token,
      expiresAt: null
    });

    const qrUrl = `${process.env.CLIENT_URL}/ice/${token}`;

    const qrImage = await qrcode.toDataURL(qrUrl);

    return res.json({
      message: "Emergency QR generated",
      token,
      qrImage
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const viewEmergencyProfile = async (req, res) => {
  try {
    const { token } = req.params;

    const tokenData = await EmergencyQRToken.findOne({ token });
    if (!tokenData)
      return res.status(404).json({ message: "Invalid token" });

    const profile = await EmergencyProfile.findOne({
      userId: tokenData.userId
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    return res.json({ profile });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
