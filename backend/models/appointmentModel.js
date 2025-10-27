// backend/models/appointmentModel.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientEmail: { type: String },
  patientPhone: { type: String, required: true },
  doctor: { type: String, required: true },    // doctor's name (or id if you change later)
  date: { type: String, required: true },      // "YYYY-MM-DD"
  time: { type: String, required: true },      // "HH:MM"
  notes: { type: String },
  done: { type: Boolean, default: false }      // mark completed
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
