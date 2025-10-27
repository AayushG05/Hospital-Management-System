import Doctor from "../models/doctorModel.js";

// Add Doctor
export const addDoctor = async (req, res) => {
    try {
        const { name, email, phone, specialization, availability } = req.body;

        if (!name || !email || !phone || !specialization || !availability) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await Doctor.findOne({ email });
        if (existing) return res.status(400).json({ message: "Doctor with this email already exists" });

        const newDoctor = new Doctor({ name, email, phone, specialization, availability });
        await newDoctor.save();

        res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });
    } catch (err) {
        console.error("Error adding doctor:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get Doctors (with optional query)
export const getDoctors = async (req, res) => {
    try {
        const { name, email, phone, specialization, availability } = req.query;

        const query = {};
        if (name) query.name = { $regex: name, $options: "i" };
        if (email) query.email = { $regex: email, $options: "i" };
        if (phone) query.phone = { $regex: phone, $options: "i" };
        if (specialization) query.specialization = { $regex: specialization, $options: "i" };
        if (availability) query.availability = availability;

        const doctors = await Doctor.find(query).sort({ name: 1 });
        res.status(200).json(doctors);
    } catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({ message: err.message });
    }
};

// Delete Doctor
export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        await Doctor.findByIdAndDelete(id);
        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (err) {
        console.error("Error deleting doctor:", err);
        res.status(500).json({ message: err.message });
    }
};
