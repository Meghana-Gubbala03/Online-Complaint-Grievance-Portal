import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "./Modal";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [employee, setEmployee] = useState("");
  const [search, setSearch] = useState("");
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [escalationReason, setEscalationReason] = useState("");
  const [newEmp, setNewEmp] = useState({ name: "", email: "", password: "", experience: "" });

  const token = localStorage.getItem("token");

  // Fetch all complaints
  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching complaints", err);
    }
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchEmployees();
  }, []);

  // Search filter
  useEffect(() => {
    setFiltered(
      complaints.filter(
        (c) =>
          c.category?.toLowerCase().includes(search.toLowerCase()) ||
          c.description?.toLowerCase().includes(search.toLowerCase()) ||
          c.status?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, complaints]);

  // Update complaint status
  const updateStatus = async (id) => {
    if (!status) return alert("Select status");
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status, admin_comment: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Status updated!");
      setStatus("");
      setComment("");
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  // Assign employee
  const assignToEmployee = async (id) => {
    if (!employee) return alert("Select employee name");
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/assign`,
        { employee },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Complaint assigned to ${employee}`);
      setEmployee("");
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Error assigning employee");
    }
  };

  // Escalation modal controls
  const openEscalateModal = (complaint) => {
    setSelectedComplaint(complaint);
    setEscalationReason("");
    setShowEscalateModal(true);
  };

  const handleEscalateSubmit = async () => {
    if (!escalationReason) return alert("Please enter a reason");
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${selectedComplaint.id}/escalate`,
        { escalation_reason: escalationReason, escalation_level: "Level 1" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Complaint escalated!");
      setShowEscalateModal(false);
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Error escalating complaint");
    }
  };

  // ✅ Add new employee (corrected route and added experience)
  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/employees/add", newEmp, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Employee added successfully!");
      setNewEmp({ name: "", email: "", password: "", experience: "" });
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Error adding employee");
    }
  };

  // Export CSV and PDF
  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(complaints);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Complaints");
    XLSX.writeFile(wb, "complaints_report.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Complaints Report", 14, 10);
    doc.autoTable({
      head: [["ID", "Category", "Description", "Priority", "Status", "Assigned", "Date"]],
      body: complaints.map((c) => [
        c.id,
        c.category,
        c.description,
        c.priority,
        c.status,
        c.assigned_to || "",
        c.created_at,
      ]),
    });
    doc.save("complaints_report.pdf");
  };

  const chartData = [
    { name: "New", value: complaints.filter((c) => c.status === "New").length },
    { name: "Under Review", value: complaints.filter((c) => c.status === "Under Review").length },
    { name: "Resolved", value: complaints.filter((c) => c.status === "Resolved").length },
    { name: "Escalated", value: complaints.filter((c) => c.status === "Escalated").length },
  ];
  const COLORS = ["#ff4d4d", "#ffa500", "#4caf50", "#6a5acd"];

  return (
    <div className="admin-dashboard">
      <h2 className="admin-title">ResolveIT - Admin Panel</h2>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={activeTab === "dashboard" ? "tab-active" : "tab-btn"}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={activeTab === "employees" ? "tab-active" : "tab-btn"}
        >
          Employees
        </button>
        <button
          onClick={() => setActiveTab("escalated")}
          className={activeTab === "escalated" ? "tab-active" : "tab-btn"}
        >
          Escalated
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={activeTab === "reports" ? "tab-active" : "tab-btn"}
        >
          Reports
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <>
          <input
            type="text"
            placeholder="🔍 Search by keyword or status..."
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filtered.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="complaint-card">
                <p><strong>ID:</strong> {c.id}</p>
                <p><strong>Category:</strong> {c.category}</p>
                <p><strong>Description:</strong> {c.description}</p>
                <p>
                  <strong>Status:</strong>
                  <span className={`status-tag ${c.status.replace(" ", "").toLowerCase()}`}>
                    {c.status}
                  </span>
                </p>

                <div className="update-box">
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Select Status</option>
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Admin comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button onClick={() => updateStatus(c.id)}>Update</button>

                  <select
  value={employee}
  onChange={(e) => setEmployee(e.target.value)}
>
  <option value="">Assign Employee</option>
  {employees.map((emp) => (
    <option key={emp.id} value={emp.id}>
      {emp.name}
    </option>
  ))}
</select>

                  <button onClick={() => assignToEmployee(c.id)}>Assign</button>

                  <button
                    onClick={() => openEscalateModal(c)}
                    style={{ backgroundColor: "#d9534f", color: "white", marginLeft: "10px" }}
                  >
                    Escalate
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* ✅ Updated Employee Management Section */}
      {activeTab === "employees" && (
        <div className="employees-tab">
          <h3>Add New Employee</h3>
          <form className="employee-form" onSubmit={addEmployee}>
            <input
              type="text"
              placeholder="Employee Name"
              value={newEmp.name}
              onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Employee Email"
              value={newEmp.email}
              onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newEmp.password}
              onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Experience (e.g. 2 years)"
              value={newEmp.experience}
              onChange={(e) => setNewEmp({ ...newEmp, experience: e.target.value })}
            />
            <button type="submit">Add Employee</button>
          </form>

          <h3>Employee List ({employees.length})</h3>
          {employees.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Experience</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.experience || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Escalated Complaints */}
      {activeTab === "escalated" && (
        <div className="escalated-tab">
          <h3>Escalated Complaints</h3>
          {complaints.filter((c) => c.status === "Escalated").length === 0 ? (
            <p>No escalated complaints found.</p>
          ) : (
            complaints
              .filter((c) => c.status === "Escalated")
              .map((c) => (
                <div key={c.id} className="complaint-card escalated">
                  <p><strong>ID:</strong> {c.id}</p>
                  <p><strong>Category:</strong> {c.category}</p>
                  <p><strong>Description:</strong> {c.description}</p>
                  <p><strong>Reason:</strong> {c.escalation_reason || "N/A"}</p>
                  <p><strong>Level:</strong> {c.escalation_level}</p>
                </div>
              ))
          )}
        </div>
      )}

      {/* Reports */}
      {activeTab === "reports" && (
        <div className="reports-container">
          <h3>Reports & Analytics</h3>
          <div className="charts">
            <PieChart width={300} height={250}>
              <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>

            <BarChart width={400} height={250} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#1e90ff" />
            </BarChart>
          </div>

          <div className="report-buttons">
            <button onClick={exportCSV}>Export CSV</button>
            <button onClick={exportPDF}>Export PDF</button>
          </div>
        </div>
      )}

      {/* Escalation Modal */}
      {showEscalateModal && selectedComplaint && (
        <Modal
          title={`Escalate Complaint #${selectedComplaint.id}`}
          onClose={() => setShowEscalateModal(false)}
          onConfirm={handleEscalateSubmit}
          confirmText="Submit"
        >
          <textarea
            placeholder="Enter escalation reason..."
            value={escalationReason}
            onChange={(e) => setEscalationReason(e.target.value)}
          ></textarea>
        </Modal>
      )}
    </div>
  );
}
