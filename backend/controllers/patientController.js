import Patient from "../models/patientModel.js";

// Add Patient
export const addPatient = async (req, res) => {
    try {
        const { name, email, phone, age, gender, address } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: "Name, Email, and Phone are required" });
        }

        const newPatient = new Patient({ name, email, phone, age, gender, address });
        await newPatient.save();

        res.status(201).json({ message: "Patient added successfully", patient: newPatient });
    } catch (err) {
        console.error("Error adding patient:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get Patients (all or filtered)
export const getPatients = async (req, res) => {
    try {
        const query = {};
        if (req.query.name) query.name = { $regex: req.query.name, $options: "i" };
        if (req.query.email) query.email = { $regex: req.query.email, $options: "i" };
        if (req.query.phone) query.phone = { $regex: req.query.phone, $options: "i" };

        const patients = await Patient.find(query).sort({ createdAt: -1 });
        res.status(200).json(patients);
    } catch (err) {
        console.error("Error fetching patients:", err);
        res.status(500).json({ message: err.message });
    }
};

// Delete Patient
export const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        await Patient.findByIdAndDelete(id);
        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (err) {
        console.error("Error deleting patient:", err);
        res.status(500).json({ message: err.message });
    }
};
