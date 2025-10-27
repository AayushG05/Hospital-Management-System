// backend/controllers/prescriptionController.js
import Prescription from "../models/prescriptionModel.js";

/**
 * Add Prescription
 * POST /api/prescriptions/add
 */
export const addPrescription = async (req, res) => {
  try {
    const { patientName, patientEmail, patientPhone, doctorName, doctorEmail, medicines, notes } = req.body;
    if (!patientName) return res.status(400).json({ message: "patientName is required" });

    // ensure medicines is array
    const meds = Array.isArray(medicines) ? medicines : (typeof medicines === "string" ? medicines.split("\n").map(s => s.trim()).filter(Boolean) : []);
    const presc = new Prescription({ patientName, patientEmail, patientPhone, doctorName, doctorEmail, medicines: meds, notes });
    await presc.save();
    return res.status(201).json({ message: "Prescription saved", prescription: presc });
  } catch (err) {
    console.error("Error adding prescription:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get all prescriptions (or filter)
 * GET /api/prescriptions/all
 * optional query params: doctorName, patientName
 */
export const getPrescriptions = async (req, res) => {
  try {
    const { doctorName, patientName } = req.query;
    const q = {};
    if (doctorName) q.doctorName = { $regex: doctorName, $options: "i" };
    if (patientName) q.patientName = { $regex: patientName, $options: "i" };

    const prescriptions = await Prescription.find(q).sort({ createdAt: -1 });
    return res.status(200).json(prescriptions);
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Delete prescription
 * DELETE /api/prescriptions/:id
 */
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    await Prescription.findByIdAndDelete(id);
    return res.status(200).json({ message: "Prescription deleted" });
  } catch (err) {
    console.error("Error deleting prescription:", err);
    return res.status(500).json({ message: err.message });
  }
};
