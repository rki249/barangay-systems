import React, { useEffect, useState } from "react";
import axios from "axios";

function HouseholdManagement() {
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

  useEffect(() => { fetchData(); }, []);

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addHousehold = async () => {
    await axios.post("http://localhost:5000/api/households", form);
    fetchData();
  };

  const deleteHousehold = async (id) => {
    await axios.delete(`http://localhost:5000/api/households/${id}`);
    fetchData();
  };

  return (
    <div>
      <h3>Households</h3>

      <table border="1">
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
          {households.map(h => (
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

      <h4>Add Household</h4>
      <input name="address" placeholder="Address" onChange={handleInput} />
      <input name="purok" placeholder="Purok" onChange={handleInput} />
      <input type="date" name="date_registered" onChange={handleInput} />
      <button onClick={addHousehold}>Add</button>
    </div>
  );
}

export default HouseholdManagement;