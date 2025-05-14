import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
  issuedAt: { type: Date, default: Date.now },
  certificateUrl: { type: String },
  collegeID: { type: String, required: true },
});

export const Certificate = mongoose.model("Certificate", certificateSchema);