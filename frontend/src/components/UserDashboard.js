import React, { useState, useEffect } from "react";
import axios from "axios";
import ComplaintForm from "./ComplaintForm";
import "./UserDashboard.css";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("submit");
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch complaints from backend
  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data.reverse());
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Refetch when tab changes (except submit)
  useEffect(() => {
    if (activeTab !== "submit") {
      fetchComplaints();
    }
  }, [activeTab]);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status !== "Resolved").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  // Helper to compute progress percentage
  const getProgress = (status) => {
    switch (status) {
      case "New":
        return 33;
      case "Under Review":
        return 66;
      case "Resolved":
        return 100;
      default:
        return 0;
    }
  };

  const getColor = (status) => {
    switch (status) {
      case "New":
        return "#ff4d4d";
      case "Under Review":
        return "#ffa500";
      case "Resolved":
        return "#4caf50";
      default:
        return "#ccc";
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">ResolveIT Dashboard</h2>

      <div className="user-box">
        <p>Welcome, Gubbala Meghana</p>
        <p className="email">meghana.gubbala@gmail.com</p>
      </div>

      <h3 className="complaint-summary-heading">Your Complaint Summary</h3>
      <div className="summary">
        <div className="summary-card">
          <p className="count">{total}</p>
          <p>Total</p>
        </div>
        <div className="summary-card">
          <p className="count">{pending}</p>
          <p>Pending</p>
        </div>
        <div className="summary-card">
          <p className="count">{resolved}</p>
          <p>Resolved</p>
        </div>
      </div>

      <div className="recent">
        <h3>Recent Complaints</h3>
        {complaints.slice(0, 3).map((c, index) => (
          <div className="complaint-box" key={index}>
            <span
              className={`badge ${
                c.status === "Resolved" ? "resolved" : "pending"
              }`}
            >
              {c.status}
            </span>
            <span className="complaint-text">
              {c.description || c.category || "No description"}
            </span>
          </div>
        ))}
      </div>

      <div className="tab-buttons">
        <button
          onClick={() => setActiveTab("submit")}
          className={activeTab === "submit" ? "tab-active" : "tab-btn"}
        >
          Submit Complaint
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={activeTab === "my" ? "tab-active" : "tab-btn"}
        >
          My Complaints
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={activeTab === "timeline" ? "tab-active" : "tab-btn"}
        >
          Timeline
        </button>
      </div>

      {/* Submit Complaint */}
      {activeTab === "submit" && (
        <div>
          <ComplaintForm onCreated={fetchComplaints} />
        </div>
      )}

      {/* My Complaints */}
      {activeTab === "my" && (
        <div>
          <h3>My Submitted Complaints</h3>
          {complaints.length === 0 ? (
            <p>No complaints submitted yet.</p>
          ) : (
            complaints.map((c, index) => (
              <div key={index} className="complaint-card">
                <p>
                  <strong>ID:</strong> {c.id}
                </p>
                <p>
                  <strong>Category:</strong> {c.category}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        c.status === "Resolved"
                          ? "green"
                          : c.status === "Under Review"
                          ? "orange"
                          : "red",
                    }}
                  >
                    {c.status}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="timeline-container">
          <h3>Complaint Timeline</h3>
          {complaints.length === 0 ? (
            <p>No complaints yet.</p>
          ) : (
            complaints.map((c, index) => (
              <div key={index} className="timeline-card">
                <div className="timeline-header">
                  <h4>Complaint #{c.id}</h4>
                  <span
                    className={`status-badge ${
                      c.status === "Resolved"
                        ? "resolved"
                        : c.status === "Under Review"
                        ? "review"
                        : "new"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p>
                  <strong>Category:</strong> {c.category}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {c.description || "No description provided"}
                </p>

                <div className="progress-track">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${getProgress(c.status)}%`,
                      background: getColor(c.status),
                    }}
                  ></div>
                </div>
                <div className="progress-labels">
                  <span>New</span>
                  <span>Under Review</span>
                  <span>Resolved</span>
                </div>

                <p className="timeline-date">
                  Submitted:{" "}
                  {new Date(c.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  <strong>Admin Comment:</strong>{" "}
                  {c.admin_comment || "No update yet"}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
