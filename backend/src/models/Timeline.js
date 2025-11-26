import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
      required: true,
    },

    date: { type: Date, default: Date.now },

    summary: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Timeline", timelineSchema);
