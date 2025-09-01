// routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

// Signup
router.post(
  "/signup",
  [
    body("username").trim().isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;
    try {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "User already exists" });

      // schema pre-save hashes; pass plain password
      const user = new User({ username, email, password });
      await user.save();

      const token = signToken(user._id);
      res.status(201).json({ message: "User created", token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Login
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = signToken(user._id);
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
