import React from "react";
import { useNavigate, Routes, Route } from "react-router-dom";

import UserManagement from "./UserManagement";
import ResidentManagement from "./ResidentManagement";
import HouseholdManagement from "./HouseholdManagement";
import BlotterRecords from "./BlotterRecords";

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
        <h2 className="dashboard-title">Barangay System Dashboard</h2>
        <p className="dashboard-user">
          Welcome, <b>{user.full_name}</b> ({user.role})
        </p>
      </div>

      {/* NAV BUTTONS */}
      <div className="dashboard-nav">
        <button onClick={() => navigate("/dashboard/residents")}>
          Residents
        </button>

        <button onClick={() => navigate("/dashboard/households")}>
          Households
        </button>

        <button onClick={() => navigate("/dashboard/blotters")}>
          Blotters
        </button>

        <button onClick={() => navigate("/dashboard/users")}>
          Users
        </button>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="dashboard-content">
        <Routes>
          <Route
            index
            element={
              <div className="dashboard-home">
                <h3>Welcome to the system</h3>
                <p>Select a module from above to manage records.</p>
              </div>
            }
          />
          <Route path="users" element={<UserManagement />} />
          <Route path="residents" element={<ResidentManagement />} />
          <Route path="households" element={<HouseholdManagement />} />
          <Route path="blotters" element={<BlotterRecords />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;