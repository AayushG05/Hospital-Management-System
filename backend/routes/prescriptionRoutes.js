// backend/routes/prescriptionRoutes.js
import express from "express";
import { addPrescription, getPrescriptions, deletePrescription } from "../controllers/prescriptionController.js";

const router = express.Router();

router.post("/add", addPrescription);
router.get("/all", getPrescriptions);
router.delete("/:id", deletePrescription);

export default router;
