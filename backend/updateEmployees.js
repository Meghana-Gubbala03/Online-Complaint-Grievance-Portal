// updateEmployees.js
import bcrypt from "bcrypt";
import { pool } from "./db.js"; // ✅ adjust if needed (this assumes db.js is in same folder)

const employees = [
  { email: "emp1@example.com", password: "password" },
  { email: "emp2@example.com", password: "password" },
  { email: "emp3@example.com", password: "password" },
];

async function updateEmployeePasswords() {
  try {
    for (const emp of employees) {
      const hash = await bcrypt.hash(emp.password, 10);
      await pool.query("UPDATE users SET password=? WHERE email=?", [hash, emp.email]);
      console.log(`✅ Updated password for ${emp.email}`);
    }
    console.log("All employee passwords updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating employee passwords:", err);
    process.exit(1);
  }
}

updateEmployeePasswords();
