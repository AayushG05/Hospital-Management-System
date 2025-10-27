// backend/routes/adminRoutes.js
import express from "express";
import { getDoctors, addDoctorByAdmin, deleteDoctorByAdmin } from "../controllers/adminController.js";

const router = express.Router();

// Doctor endpoints
router.get("/doctors", getDoctors);
router.post("/doctors", addDoctorByAdmin);
router.delete("/doctors/:id", deleteDoctorByAdmin);

// NOTE: receptionist endpoints will be added in the next step (receptionist management)
export default router;
