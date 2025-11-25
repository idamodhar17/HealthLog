import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    fileUrl: { type: String, required: true },
    fileType: { type: String },
    extractedText: { type: String, default: "" },

    uploadDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Record", recordSchema);
