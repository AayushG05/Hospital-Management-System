// backend/controllers/appointmentController.js
import Appointment from "../models/appointmentModel.js";

/**
 * Add Appointment
 * POST /api/appointments/add
 */
export const addAppointment = async (req, res) => {
  try {
    const { patientName, patientEmail, patientPhone, doctor, date, time, notes } = req.body;

    if (!patientName || !patientPhone || !doctor || !date || !time) {
      return res.status(400).json({ message: "patientName, patientPhone, doctor, date and time are required" });
    }

    const appointment = new Appointment({ patientName, patientEmail, patientPhone, doctor, date, time, notes });
    await appointment.save();
    return res.status(201).json({ message: "Appointment added successfully", appointment });
  } catch (err) {
    console.error("Error adding appointment:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get Appointments (search/filter)
 * GET /api/appointments/search
 * optional query params: doctor, patientName, patientPhone, date
 */
export const getAppointments = async (req, res) => {
  try {
    const { doctor, patientName, patientPhone, date } = req.query;
    const q = {};

    if (doctor) q.doctor = { $regex: doctor, $options: "i" };
    if (patientName) q.patientName = { $regex: patientName, $options: "i" };
    if (patientPhone) q.patientPhone = { $regex: patientPhone, $options: "i" };
    if (date) q.date = date; // exact date string match YYYY-MM-DD

    const appointments = await Appointment.find(q).sort({ date: 1, time: 1, createdAt: -1 });
    return res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Delete appointment
 * DELETE /api/appointments/:id
 */
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    return res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Patch appointment done status
 * PATCH /api/appointments/:id/done
 * body: { done: true/false }
 */
export const setAppointmentDone = async (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;
    if (typeof done !== "boolean") return res.status(400).json({ message: "done must be boolean" });

    const updated = await Appointment.findByIdAndUpdate(id, { done }, { new: true });
    if (!updated) return res.status(404).json({ message: "Appointment not found" });

    return res.status(200).json({ message: "Status updated", appointment: updated });
  } catch (err) {
    console.error("Error updating appointment status:", err);
    return res.status(500).json({ message: err.message });
  }
};
