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

  // GET DATA
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

  // INPUT HANDLER
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD HOUSEHOLD
  const addHousehold = async () => {
    console.log("CLICKED ADD");
    console.log("FORM DATA:", form);

    try {
      await axios.post("http://localhost:5000/api/households", form);

      setForm({
        address: "",
        purok: "",
        date_registered: ""
      });

      fetchData();
    } catch (err) {
      console.log("ADD ERROR:", err.response?.data || err.message);
    }
  };

  // DELETE HOUSEHOLD
  const deleteHousehold = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/households/${id}`);
      fetchData();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  return (
    <div className="household-container">
      <h2 className="title">Household Management</h2>

      {/* TABLE */}
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
                <button onClick={() => deleteHousehold(h.household_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FORM */}
      <div className="form-container">
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleInput}
        />

        <input
          name="purok"
          placeholder="Purok"
          value={form.purok}
          onChange={handleInput}
        />

        <input
          type="date"
          name="date_registered"
          value={form.date_registered}
          onChange={handleInput}
        />

        <button onClick={addHousehold}>Add Household</button>
      </div>

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default HouseholdManagement;