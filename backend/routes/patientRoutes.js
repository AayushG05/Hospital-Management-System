import express from "express";
import { addPatient, getPatients, deletePatient } from "../controllers/patientController.js";

const router = express.Router();

// Add patient
router.post("/add", addPatient);

// Get patients (search/all)
router.get("/search", getPatients);
router.get("/all", getPatients); // optional for load all without query

// Delete patient
router.delete("/:id", deletePatient);

export default router;
