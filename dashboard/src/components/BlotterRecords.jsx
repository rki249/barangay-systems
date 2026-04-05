import React, { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => { fetchData(); }, []);

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addBlotter = async () => {
    await axios.post("http://localhost:5000/api/blotters", form);
    fetchData();
  };

  return (
    <div>
      <h3>Blotter Records</h3>

      <table border="1">
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
          {records.map(r => (
            <tr key={r.blotter_id}>
              <td>{r.blotter_id}</td>
              <td>{r.complainant_name}</td>
              <td>{r.respondent_name}</td>
              <td>{r.incident_date}</td>
              <td>{r.incident_location}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Add Blotter</h4>
      <input name="complainant_id" placeholder="Resident ID" onChange={handleInput} />
      <input name="respondent_name" placeholder="Respondent Name" onChange={handleInput} />
      <input type="date" name="incident_date" onChange={handleInput} />
      <input name="incident_location" placeholder="Location" onChange={handleInput} />
      <input name="complaint_details" placeholder="Details" onChange={handleInput} />
      <input name="recorded_by" placeholder="User ID" onChange={handleInput} />

      <button onClick={addBlotter}>Add</button>
    </div>
  );
}

export default BlotterRecords;