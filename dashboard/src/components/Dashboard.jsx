import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Dashboard.css";

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Barangay System Dashboard</h2>
        <p>
          Welcome, <b>{user.full_name}</b> ({user.role})
        </p>
      </div>

      {/* NAV BUTTONS */}
      <div className="dashboard-nav">
        <button onClick={() => navigate("/residents")}>Residents</button>
        <button onClick={() => navigate("/households")}>Households</button>
        <button onClick={() => navigate("/blotters")}>Blotters</button>
        <button onClick={() => navigate("/users")}>Users</button>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;