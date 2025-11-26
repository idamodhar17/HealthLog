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

    tokenUsed: { 
      type: String,
      default: "N/A" 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Audit", auditSchema);
