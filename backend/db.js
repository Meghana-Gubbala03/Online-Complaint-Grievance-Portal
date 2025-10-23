import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create and export MySQL connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "grievance_portal",
});
