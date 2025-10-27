// backend/controllers/adminController.js
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js"; // we'll use User later for receptionists

// ---------- DOCTOR endpoints ----------

// GET /api/admin/doctors?name=&email=&phone=&specialization=&sort=
export const getDoctors = async (req, res) => {
  try {
    const { name, email, phone, specialization, sort } = req.query;
    const q = {};
    if (name) q.name = { $regex: name, $options: "i" };
    if (email) q.email = { $regex: email, $options: "i" };
    if (phone) q.phone = { $regex: phone, $options: "i" };
    if (specialization) q.specialization = { $regex: specialization, $options: "i" };

    let cursor = Doctor.find(q);
    if (sort === "name") cursor = cursor.sort({ name: 1 });
    if (sort === "phone") cursor = cursor.sort({ phone: 1 });
    if (sort === "email") cursor = cursor.sort({ email: 1 });

    const doctors = await cursor.exec();
    res.status(200).json(doctors);
  } catch (err) {
    console.error("Error getDoctors:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/doctors
export const addDoctorByAdmin = async (req, res) => {
  try {
    const { name, email, phone, specialization } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ message: "name, email, phone required" });

    // optional: prevent duplicate emails
    const exists = await Doctor.findOne({ email });
    if (exists) return res.status(400).json({ message: "Doctor with this email already exists" });

    const doc = new Doctor({ name, email, phone, specialization });
    await doc.save();
    res.status(201).json({ message: "Doctor added", doctor: doc });
  } catch (err) {
    console.error("Error addDoctorByAdmin:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/doctors/:id
export const deleteDoctorByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ message: "Doctor deleted" });
  } catch (err) {
    console.error("Error deleteDoctorByAdmin:", err);
    res.status(500).json({ message: err.message });
  }
};
