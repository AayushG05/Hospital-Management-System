import mongoose from "mongoose";

const receptionistDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Receptionist name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  shift: {
    type: String,
    required: [true, "Shift is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
});

const ReceptionistData = mongoose.model("ReceptionistData", receptionistDataSchema);
export default ReceptionistData;
