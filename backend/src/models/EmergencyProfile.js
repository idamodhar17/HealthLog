import mongoose from "mongoose";

const emergencyProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        name: { type: String, required: true },
        bloodGroup: { type: String, required: true },
        allergies: { type: String },
        medications: { type: String },
        emergencyContacts: {
            name: String,
            phone: String,
            relation: String
        },
    },
    { timestamps: true }
);

export default mongoose.model("EmergencyProfile", emergencyProfileSchema);