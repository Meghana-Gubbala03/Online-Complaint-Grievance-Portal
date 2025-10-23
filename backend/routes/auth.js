import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

// 🧠 Admin/User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      console.log("❌ No user found with email:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const user = rows[0];
    console.log("✅ Found user:", user.email, "Role:", user.role);

    // ✅ Compare password
    const match = await bcrypt.compare(password, user.password);
    console.log("Password match result:", match);

    if (!match) {
      console.log("❌ Wrong password for user:", user.email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "mysecretkey123",
      { expiresIn: "1d" }
    );

    console.log("✅ Login success for:", user.email);

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// 🧠 Register (for users only)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')", [
      name,
      email,
      hashed,
    ]);
    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Error registering user" });
  }
});



export default router;
