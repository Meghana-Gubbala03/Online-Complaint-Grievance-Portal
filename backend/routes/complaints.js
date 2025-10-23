// backend/routes/complaints.js
import express from "express";
import multer from "multer";
import { pool } from "../db.js";
import  authMiddleware  from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* -------------------- USER ROUTES -------------------- */
// Submit complaint
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { category, description, priority } = req.body;
    const file_path = req.file ? req.file.path : null;
    const user_id = req.user.id;

    const [result] = await pool.query(
      "INSERT INTO complaints (user_id, category, description, priority, file_path, status) VALUES (?, ?, ?, ?, ?, 'New')",
      [user_id, category, description, priority, file_path]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Error inserting complaint:", error);
    res.status(500).json({ success: false, msg: "Error submitting complaint" });
  }
});

// Fetch user's own complaints
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* -------------------- ADMIN ROUTES -------------------- */
// Fetch all complaints
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  const [rows] = await pool.query("SELECT * FROM complaints ORDER BY created_at DESC");
  res.json(rows);
});

// Update complaint status/comment
router.put("/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status, admin_comment } = req.body;
  try {
    await pool.query("UPDATE complaints SET status = ?, admin_comment = ? WHERE id = ?", [
      status,
      admin_comment,
      id,
    ]);

    // ✅ Create notification for the complaint's user
    const [complaint] = await pool.query("SELECT user_id FROM complaints WHERE id = ?", [id]);
    if (complaint[0]) {
      await pool.query(
        "INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, NOW())",
        [complaint[0].user_id, `Your complaint #${id} is now ${status}`]
      );
    }

    res.json({ message: "Status updated and notification sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating status" });
  }
});


// Assign complaint to employee
router.put("/:id/assign", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  const { employee } = req.body;
  await pool.query("UPDATE complaints SET assigned_to=? WHERE id=?", [employee, req.params.id]);
  res.json({ msg: "Complaint assigned" });
});

// Escalate complaint (Admin)
router.put("/:id/escalate", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  const { escalation_reason, escalation_level } = req.body;

  try {
    await pool.query(
      "UPDATE complaints SET status='Escalated', escalation_reason=?, escalation_level=? WHERE id=?",
      [escalation_reason || "No reason specified", escalation_level || "Level 1", req.params.id]
    );
    res.json({ msg: "Complaint escalated successfully" });
  } catch (err) {
    console.error("Error escalating complaint:", err);
    res.status(500).json({ msg: "Error escalating complaint" });
  }
});

// Get all escalated complaints
router.get("/escalated", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });

  try {
    const [rows] = await pool.query(
      "SELECT * FROM complaints WHERE status='Escalated' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching escalated complaints:", err);
    res.status(500).json({ msg: "Error fetching escalated complaints" });
  }
});

/* -------------------- EMPLOYEE ROUTES -------------------- */
// Fetch complaints assigned to employee
router.get("/assigned", authMiddleware, async (req, res) => {
  if (req.user.role !== "employee") return res.status(403).json({ msg: "Forbidden" });
  try {
    const [rows] = await pool.query(
      "SELECT * FROM complaints WHERE assigned_to = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Employee updates status or comment
router.put("/:id/employee-update", authMiddleware, async (req, res) => {
  if (req.user.role !== "employee") return res.status(403).json({ msg: "Forbidden" });
  const { status, comment } = req.body;
  try {
    await pool.query(
      "UPDATE complaints SET status = ?, employee_comment = ? WHERE id = ? AND assigned_to = ?",
      [status, comment, req.params.id, req.user.id]
    );
    res.json({ msg: "Status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating complaint" });
  }
});

export default router;
