import ReceptionistData from "../models/receptionistDataModel.js";

// ✅ Add new receptionist
export const addReceptionist = async (req, res) => {
  try {
    const newRec = new ReceptionistData(req.body);
    await newRec.save();
    res.status(201).json({ message: "Receptionist added successfully", newRec });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all receptionists
export const getAllReceptionists = async (req, res) => {
  try {
    const data = await ReceptionistData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete receptionist
export const deleteReceptionist = async (req, res) => {
  try {
    const deleted = await ReceptionistData.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Receptionist not found" });
    res.json({ message: "Receptionist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Search receptionist
export const searchReceptionists = async (req, res) => {
  try {
    const query = req.query.query;
    const data = await ReceptionistData.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { shift: { $regex: query, $options: "i" } },
      ],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
