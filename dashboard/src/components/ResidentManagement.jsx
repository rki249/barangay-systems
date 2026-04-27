import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/ResidentManagement.css";

function ResidentManagement() {
  const navigate = useNavigate();

  const [residents, setResidents] = useState([]);
  const [households, setHouseholds] = useState([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    sex: "",
    birthdate: "",
    household_id: ""
  });

  // FETCH RESIDENTS
  const fetchResidents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/residents");
      setResidents(res.data);
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      alert("Failed to fetch residents. Check backend.");
    }
  };

  const fetchHouseholds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/households");
      setHouseholds(res.data);
    } catch (err) {
      console.error("❌ HOUSEHOLD FETCH ERROR:", err);
      alert("Failed to fetch households. Check backend.");
    }
  };

  useEffect(() => {
    fetchResidents();
    fetchHouseholds();
  }, []);

  // HANDLE INPUT
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD RESIDENT
  const addResident = async () => {
    console.log("🔥 BUTTON CLICKED");

    // VALIDATION
    if (!form.first_name || !form.last_name || !form.sex || !form.birthdate || !form.household_id) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        sex: form.sex,
        birthdate: form.birthdate,
        household_id: Number(form.household_id)
      };

      const response = await axios.post(
        "http://localhost:5000/api/residents",
        payload
      );

      console.log("✅ SUCCESS:", response.data);
      alert("Resident added successfully!");

      fetchResidents();

      // RESET FORM
      setForm({
        first_name: "",
        last_name: "",
        sex: "",
        birthdate: "",
        household_id: ""
      });

    } catch (error) {
      console.error("❌ ADD ERROR:", error);

      if (error.response) {
        alert(error.response.data?.message || "Server error");
      } else if (error.request) {
        alert("No response from server. Is backend running?");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  // DELETE RESIDENT
  const deleteResident = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/residents/${id}`);
      fetchResidents();
    } catch (err) {
      console.error("❌ DELETE ERROR:", err);
      alert("Failed to delete resident");
    }
  };

  return (
    <div className="resident-container">
      <h2 className="title">Resident Management</h2>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="resident-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Birthdate</th>
              <th>Sex</th>
              <th>Household ID</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((r) => (
              <tr key={r.resident_id}>
                <td>{r.resident_id}</td>
                <td>{`${r.first_name || ''} ${r.last_name || ''}`.trim()}</td>
                <td>{r.birthdate}</td>
                <td>{r.sex}</td>
                <td>{r.household_id}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteResident(r.resident_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM */}
      <div className="form-container">
        <h3>Add Resident</h3>

        <input
          className="input"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleInput}
        />

        <input
          className="input"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleInput}
        />

        <input
          className="input"
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleInput}
        />

        <select
          className="input"
          name="sex"
          value={form.sex}
          onChange={handleInput}
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          className="input"
          name="household_id"
          value={form.household_id}
          onChange={handleInput}
        >
          <option value="">Select Household</option>
          {households.map((household) => (
            <option
              key={household.household_id}
              value={household.household_id}
            >
              {`${household.household_id} - ${household.address || ''} ${household.purok ? `(${household.purok})` : ''}`.trim()}
            </option>
          ))}
        </select>

        <button className="add-btn" onClick={addResident}>
          Add Resident
        </button>
      </div>

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default ResidentManagement;