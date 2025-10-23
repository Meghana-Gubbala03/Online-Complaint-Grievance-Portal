import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="hero">
        <h1>ResolveIT — Smart Grievance & Feedback System</h1>
        <p>
          Submit complaints, track progress, and receive resolutions faster than ever. 
          A transparent and digital grievance portal for all users.
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-secondary">Track Complaints</Link>
        </div>
      </div>

      <section className="steps">
        <h2>How It Works</h2>
        <div className="step-cards">
          <div className="card">
            <h3>1. Submit</h3>
            <p>File your grievance online with category, description, and priority.</p>
          </div>
          <div className="card">
            <h3>2. Review</h3>
            <p>Admins review and assign your complaint to the right department.</p>
          </div>
          <div className="card">
            <h3>3. Resolve</h3>
            <p>Receive real-time status updates until your issue is resolved.</p>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 ResolveIT Portal | Empowering Transparency</p>
      </footer>
    </div>
  );
}
