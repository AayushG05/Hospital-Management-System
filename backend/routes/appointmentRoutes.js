// backend/routes/appointmentRoutes.js
import express from "express";
import {
  addAppointment,
  getAppointments,
  deleteAppointment,
  setAppointmentDone
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/add", addAppointment);
router.get("/search", getAppointments);
router.delete("/:id", deleteAppointment);
router.patch("/:id/done", setAppointmentDone);

export default router;
