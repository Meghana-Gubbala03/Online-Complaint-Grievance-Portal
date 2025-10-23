import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints/assigned", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  const updateStatus = async (id, status) => {
    const comment = prompt("Enter your comment:");
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/employee-update`,
        { status, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const requestEscalation = async (id) => {
    const reason = prompt("Reason for escalation:");
    if (!reason) return;
    await axios.put(
      `http://localhost:5000/api/complaints/${id}/escalate`,
      { escalation_reason: reason, escalation_level: "Level 2" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Escalation requested");
    fetchComplaints();
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="employee-dashboard">
      <h2>Employee Dashboard</h2>

      {complaints.length === 0 ? (
        <p>No assigned complaints yet.</p>
      ) : (
        complaints.map((c) => (
          <div key={c.id} className="complaint-card">
            <p><strong>ID:</strong> {c.id}</p>
            <p><strong>Category:</strong> {c.category}</p>
            <p><strong>Description:</strong> {c.description}</p>
            <p><strong>Status:</strong> {c.status}</p>

            <div className="actions">
              <button onClick={() => updateStatus(c.id, "Under Review")}>Under Review</button>
              <button onClick={() => updateStatus(c.id, "Resolved")}>Mark Resolved</button>
              <button onClick={() => requestEscalation(c.id)}>Request Escalation</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
