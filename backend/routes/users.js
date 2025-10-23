import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// ✅ Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, college, skills FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Update profile (name, college, skills)
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, college, skills } = req.body;
  try {
    await pool.query(
      "UPDATE users SET name = ?, college = ?, skills = ? WHERE id = ?",
      [name, college, skills, req.user.id]
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Change password
import bcrypt from "bcryptjs";
router.put("/change-password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const [user] = await pool.query("SELECT password FROM users WHERE id = ?", [req.user.id]);
    const isMatch = await bcrypt.compare(oldPassword, user[0].password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect old password" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashed, req.user.id]);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error changing password" });
  }
});

export default router;
