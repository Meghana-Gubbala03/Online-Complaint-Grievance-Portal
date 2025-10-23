import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaints.js";
import employeeRoutes from "./routes/employees.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/employees", employeeRoutes); // ✅ important
app.use("/api/users", userRoutes);

app.listen(process.env.PORT || 5000, () => console.log("✅ Server running on port 5000"));
