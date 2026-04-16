import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/HouseholdManagement.css";
import { useNavigate } from "react-router-dom"; 


function HouseholdManagement() {
    const navigate = useNavigate(); 
  const [households, setHouseholds] = useState([]);
  const [form, setForm] = useState({
    address: "",
    purok: "",
    date_registered: ""
  });

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/households");
    setHouseholds(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addHousehold = async () => {
    await axios.post("http://localhost:5000/api/households", form);
    setForm({ address: "", purok: "", date_registered: "" });
    fetchData();
  };

  const deleteHousehold = async (id) => {
    await axios.delete(`http://localhost:5000/api/households/${id}`);
    fetchData();
  };

  return (
    <div className="household-container">
      <h2 className="title">Household Management</h2>

      <div className="table-wrapper">
        <table className="household-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Address</th>
              <th>Purok</th>
              <th>Date Registered</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {households.map((h) => (
              <tr key={h.household_id}>
                <td>{h.household_id}</td>
                <td>{h.address}</td>
                <td>{h.purok}</td>
                <td>{h.date_registered}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteHousehold(h.household_id)}
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
        <h3>Add Household</h3>

        <input
          className="input"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleInput}
        />

        <input
          className="input"
          name="purok"
          placeholder="Purok"
          value={form.purok}
          onChange={handleInput}
        />

        <input
          className="input"
          type="date"
          name="date_registered"
          value={form.date_registered}
          onChange={handleInput}
        />

        <button className="add-btn" onClick={addHousehold}>
          Add Household
        </button>
       
      </div>
       <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default HouseholdManagement;