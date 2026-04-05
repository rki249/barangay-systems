import React from "react";
import { useNavigate, Routes, Route } from "react-router-dom";

import UserManagement from "./UserManagement";
import ResidentManagement from "./ResidentManagement";
import HouseholdManagement from "./HouseholdManagement";
import BlotterRecords from "./BlotterRecords";

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div>
      <h2>Barangay System Dashboard</h2>
      <p>Welcome, {user.full_name} ({user.role})</p>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard/residents")}>
          Resident Management
        </button>

        <button onClick={() => navigate("/dashboard/households")}>
          Household Management
        </button>

        <button onClick={() => navigate("/dashboard/blotters")}>
          Blotter Records
        </button>

        <button onClick={() => navigate("/dashboard/users")}>
          User Management
        </button>

        <button onClick={logout}>Logout</button>
      </div>

      {/* Nested Routes */}
      <Routes>
        <Route index element={<p>Select a section to manage.</p>} />
        <Route path="users" element={<UserManagement />} />
        <Route path="residents" element={<ResidentManagement />} />
        <Route path="households" element={<HouseholdManagement />} />
        <Route path="blotters" element={<BlotterRecords />} />
      </Routes>
    </div>
  );
}

export default Dashboard;