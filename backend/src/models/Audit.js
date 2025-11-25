import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    ip: { type: String },

    accessedAt: { type: Date, default: Date.now },

    detailsViewed: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Audit", auditSchema);
