import express from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

/**
 * ✅ Add New Employee
 * Only admin can add employees
 */
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, email, password, experience } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if employee already exists
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    await pool.query(
      "INSERT INTO users (name, email, password, role, experience) VALUES (?, ?, ?, 'employee', ?)",
      [name, email, hashedPassword, experience || "0 years"]
    );

    res.json({ message: "✅ Employee added successfully" });
  } catch (err) {
    console.error("❌ Error adding employee:", err);
    res.status(500).json({ error: "Server error while adding employee" });
  }
});

/**
 * ✅ Get All Employees
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, experience FROM users WHERE role = 'employee'"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching employees:", err);
    res.status(500).json({ error: "Server error while fetching employees" });
  }
});

/**
 * ✅ Delete Employee by ID
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM users WHERE id = ? AND role = 'employee'",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "🗑️ Employee deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting employee:", err);
    res.status(500).json({ error: "Server error while deleting employee" });
  }
});

export default router;
