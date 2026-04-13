import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/BlotterRecords.css";

function BlotterRecords() {
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    complainant_id: "",
    respondent_name: "",
    incident_date: "",
    incident_location: "",
    complaint_details: "",
    status: "Pending",
    recorded_by: ""
  });

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/blotters");
    setRecords(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addBlotter = async () => {
    await axios.post("http://localhost:5000/api/blotters", form);

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
  };

  return (
    <div className="blotter-container">
      <h2 className="title">Blotter Records</h2>

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

      <div className="form-container">
        <h3>Add Blotter</h3>

        <input
          className="input"
          name="complainant_id"
          placeholder="Resident ID"
          value={form.complainant_id}
          onChange={handleInput}
        />

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

        <input
          className="input"
          name="recorded_by"
          placeholder="User ID"
          value={form.recorded_by}
          onChange={handleInput}
        />

        <button className="add-btn" onClick={addBlotter}>
          Add Blotter
        </button>
      </div>
    </div>
  );
}

export default BlotterRecords;