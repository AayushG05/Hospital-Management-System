import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },  // ✅ new field added
  role: { type: String, required: true }, // doctor, receptionist, admin
  specialization: { type: String },
  experience: { type: String },
  degree: { type: String },
  university: { type: String },
  availableDays: { type: [String] },
  timeSlots: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;
