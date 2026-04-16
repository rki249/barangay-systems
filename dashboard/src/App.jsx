import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

import UserManagement from "./components/UserManagement";
import ResidentManagement from "./components/ResidentManagement";
import HouseholdManagement from "./components/HouseholdManagement";
import BlotterRecords from "./components/BlotterRecords";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/" />
          }
        />

        {/* SEPARATE PAGES */}
        <Route path="/residents" element={<ResidentManagement />} />
        <Route path="/households" element={<HouseholdManagement />} />
        <Route path="/blotters" element={<BlotterRecords />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;