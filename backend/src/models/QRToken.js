import mongoose from "mongoose";

const qrTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: { type: String, required: true, unique: true },

    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("QRToken", qrTokenSchema);
