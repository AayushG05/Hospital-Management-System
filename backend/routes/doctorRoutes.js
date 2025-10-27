import express from "express";
import { addDoctor, getDoctors, deleteDoctor } from "../controllers/doctorController.js";

const router = express.Router();

// Add Doctor
router.post("/add", addDoctor);

// Get Doctors (with optional search query)
router.get("/search", getDoctors);

// Delete Doctor
router.delete("/:id", deleteDoctor);

export default router;
