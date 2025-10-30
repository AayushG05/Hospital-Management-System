import Prescription from "../models/prescriptionModel.js";

/**
 * Add a new prescription
 * POST /api/prescriptions/add
 */
export const addPrescription = async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      gender,
      age,
      weight,
      problem,
      doctorName,
      doctorEmail,
      medicines,
      notes
    } = req.body;

    if (!patientName || !patientEmail || !gender || !age || !weight) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Ensure medicines is stored as array
    const meds = Array.isArray(medicines)
      ? medicines
      : typeof medicines === "string"
      ? medicines.split("\n").map(s => s.trim()).filter(Boolean)
      : [];

    const newPrescription = new Prescription({
      patientName,
      patientEmail,
      patientPhone,
      gender,
      age,
      weight,
      problem,
      doctorName,
      doctorEmail,
      medicines: meds,
      notes
    });

    await newPrescription.save();
    res.status(201).json({
      message: "Prescription added successfully",
      prescription: newPrescription
    });
  } catch (err) {
    console.error("Error adding prescription:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all prescriptions (with optional filters)
 * GET /api/prescriptions/all
 */
export const getPrescriptions = async (req, res) => {
  try {
    const { patientName, problem } = req.query;
    const query = {};
    if (patientName) query.patientName = { $regex: patientName, $options: "i" };
    if (problem) query.problem = { $regex: problem, $options: "i" };

    const prescriptions = await Prescription.find(query).sort({ createdAt: -1 });
    res.status(200).json(prescriptions);
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a prescription
 * DELETE /api/prescriptions/:id
 */
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    await Prescription.findByIdAndDelete(id);
    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (err) {
    console.error("Error deleting prescription:", err);
    res.status(500).json({ message: "Server error" });
  }
};
