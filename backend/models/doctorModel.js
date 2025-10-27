import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    availability: { type: String, enum: ["Available", "Not Available"], required: false }
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
