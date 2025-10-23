import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="brand" onClick={() => navigate("/")}>
          Resolve<span>IT</span>
        </h2>
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/login">User Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/admin">Admin Login</Link>
        <Link to="/employee/login">Employee Login</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
