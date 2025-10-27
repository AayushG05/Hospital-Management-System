import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

// ✅ Register User
export const registerUser = async (req, res) => {
    try {
        const { password } = req.body;

        // hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ✅ Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Get All Users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
