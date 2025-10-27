import express from "express";
import {
  addReceptionist,
  getAllReceptionists,
  deleteReceptionist,
  searchReceptionists,
} from "../controllers/receptionistDataController.js";

const router = express.Router();

router.post("/", addReceptionist);
router.get("/", getAllReceptionists);
router.delete("/:id", deleteReceptionist);
router.get("/search", searchReceptionists);

export default router;
