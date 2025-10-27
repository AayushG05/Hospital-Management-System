// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import receptionistDataRoutes from "./routes/receptionistDataRoutes.js";

// Load environment variables
dotenv.config({ path: path.resolve("./backend/.env") });

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(cors());         // enable CORS

// Routes
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/receptionistdata", receptionistDataRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
