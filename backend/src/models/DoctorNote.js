import mongoose from "mongoose";

const doctorNoteSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        doctorName: { type: String, required: true},
        diagnosis: { type: String, required: true },
        reccomendations: { type: String, required: true },
        followUpDate: { type:Date },
        tokenUsed: {type: String, required: true}
    },
    { timestamps: true }
)

export default mongoose.model("DoctorNote", doctorNoteSchema);