import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/ResidentManagement.css";

function ResidentManagement() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "",
    household_id: ""
  });

  const fetchResidents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/residents");
      setResidents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addResident = async () => {
    try {
      await axios.post("http://localhost:5000/api/residents", form);
      setForm({ full_name: "", age: "", gender: "", household_id: "" });
      fetchResidents();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteResident = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/residents/${id}`);
      fetchResidents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="resident-container">
      <h2 className="title">Resident Management</h2>

      <div className="table-wrapper">
        <table className="resident-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Household ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((r) => (
              <tr key={r.resident_id}>
                <td>{r.resident_id}</td>
                <td>{r.full_name}</td>
                <td>{r.age}</td>
                <td>{r.gender}</td>
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

      <div className="form-container">
        <h3>Add Resident</h3>

        <input
          className="input"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleInput}
        />
        <input
          className="input"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleInput}
        />
        <input
          className="input"
          name="gender"
          placeholder="Gender"
          value={form.gender}
          onChange={handleInput}
        />
        <input
          className="input"
          name="household_id"
          placeholder="Household ID"
          value={form.household_id}
          onChange={handleInput}
        />

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