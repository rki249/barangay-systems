import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/BlotterRecords.css";
import { useNavigate } from "react-router-dom";

function BlotterRecords() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [residents, setResidents] = useState([]);

  const [form, setForm] = useState({
    complainant_id: "",
    respondent_name: "",
    incident_date: "",
    incident_location: "",
    complaint_details: "",
    status: "Pending",
    recorded_by: ""
  });

  // GET BLOTTERS
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blotters");
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching blotters:", error);
    }
  };

  // GET RESIDENTS FOR DROPDOWN
  const fetchResidents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/residents");
      setResidents(res.data);
    } catch (error) {
      console.error("Error fetching residents:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchResidents();
  }, []);

  // INPUT HANDLER
  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ADD BLOTTER (FIXED BUTTON LOGIC)
  const addBlotter = async () => {
    try {
      // VALIDATION
      if (!form.complainant_id) {
        alert("Please select a resident.");
        return;
      }

      if (!form.respondent_name || !form.incident_date) {
        alert("Please fill required fields.");
        return;
      }

      await axios.post("http://localhost:5000/api/blotters", form);

      alert("Blotter added successfully!");

      setForm({
        complainant_id: "",
        respondent_name: "",
        incident_date: "",
        incident_location: "",
        complaint_details: "",
        status: "Pending",
        recorded_by: ""
      });

      fetchData();
    } catch (error) {
      console.error("Error adding blotter:", error);
      alert("Failed to add blotter.");
    }
  };

  return (
    <div className="blotter-container">
      <h2 className="title">Blotter Records</h2>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="blotter-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Complainant</th>
              <th>Respondent</th>
              <th>Date</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r.blotter_id}>
                <td>{r.blotter_id}</td>
                <td>{r.complainant_name}</td>
                <td>{r.respondent_name}</td>
                <td>{r.incident_date}</td>
                <td>{r.incident_location}</td>
                <td>
                  <span
                    className={`status ${
                      r.status === "Pending"
                        ? "pending"
                        : r.status === "Resolved"
                        ? "resolved"
                        : "active"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM */}
      <div className="form-container">
        <h3>Add Blotter</h3>

        {/* RESIDENT DROPDOWN */}
        <select
          className="input"
          name="complainant_id"
          value={form.complainant_id}
          onChange={handleInput}
        >
          <option value="">Select Resident</option>
          {residents.map((r) => (
            <option key={r.resident_id} value={r.resident_id}>
              {r.resident_id} - {r.first_name} {r.last_name}
            </option>
          ))}
        </select>

        <input
          className="input"
          name="respondent_name"
          placeholder="Respondent Name"
          value={form.respondent_name}
          onChange={handleInput}
        />

        <input
          className="input"
          type="date"
          name="incident_date"
          value={form.incident_date}
          onChange={handleInput}
        />

        <input
          className="input"
          name="incident_location"
          placeholder="Location"
          value={form.incident_location}
          onChange={handleInput}
        />

        <input
          className="input"
          name="complaint_details"
          placeholder="Details"
          value={form.complaint_details}
          onChange={handleInput}
        />

        {/* FIXED BUTTON */}
        <button type="button" className="add-btn" onClick={addBlotter}>
          Add Blotter
        </button>
      </div>

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default BlotterRecords;