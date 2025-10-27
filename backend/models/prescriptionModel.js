// backend/models/prescriptionModel.js
import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientEmail: { type: String },
  patientPhone: { type: String },
  doctorName: { type: String },   // optional; you may fill doctor name
  doctorEmail: { type: String },
  medicines: { type: [String], default: [] }, // array of medicine strings
  notes: { type: String }
}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
