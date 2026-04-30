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
    try {
      const res = await axios.get("http://localhost:5000/api/households");
      setHouseholds(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addHousehold = async () => {
    try {
      await axios.post("http://localhost:5000/api/households", form);

      setForm({
        address: "",
        purok: "",
        date_registered: ""
      });

      fetchData();
    } catch (err) {
      console.log("ADD ERROR:", err);
    }
  };

  const deleteHousehold = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/households/${id}`);
      fetchData();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  return (
    <div className="household-page">
      <h2 className="household-title">Household Management</h2>

      <div className="household-layout">
        {/* TABLE */}
        <div className="household-table-wrapper">
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
                      className="btn-delete"
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

        {/* FORM */}
        <div className="household-form">
          <h3>Add Household</h3>

          <input
            className="form-input"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleInput}
          />

          <input
            className="form-input"
            name="purok"
            placeholder="Purok"
            value={form.purok}
            onChange={handleInput}
          />

          <input
            className="form-input"
            type="date"
            name="date_registered"
            value={form.date_registered}
            onChange={handleInput}
          />

          <button className="btn-add" onClick={addHousehold}>
            Add Household
          </button>
        </div>
      </div>

      <button className="btn-back" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default HouseholdManagement;