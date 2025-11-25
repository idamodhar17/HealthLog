import mongoose from "mongoose";
const hospitalUploadTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        token: { type: String, required: true, unique: true },
        expiresAt: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

export default mongoose.model("HospitalUploadToken", hospitalUploadTokenSchema);