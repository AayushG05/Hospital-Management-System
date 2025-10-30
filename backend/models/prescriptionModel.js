import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientEmail: { type: String },
  patientPhone: { type: String },
  gender: { type: String },
  age: { type: Number },
  weight: { type: Number },
  problem: { type: String },
  doctorName: { type: String },
  doctorEmail: { type: String },
  medicines: { type: [String], default: [] },
  notes: { type: String }
}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
