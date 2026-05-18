import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/HouseholdManagement.css";
import { useNavigate } from "react-router-dom";

function HouseholdManagement() {
  const navigate = useNavigate();

  const [households, setHouseholds] = useState([]);
  const [filteredHouseholds, setFilteredHouseholds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    address: "",
    purok: "",
    date_registered: ""
  });

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    return dateValue.toString().slice(0, 10);
  };

  const applySearch = (list, term) => {
    const normalized = term?.toLowerCase().trim();
    if (!normalized) return list;

    return list.filter((household) =>
      household.household_id?.toString().includes(normalized) ||
      household.address?.toLowerCase().includes(normalized) ||
      household.purok?.toLowerCase().includes(normalized) ||
      household.date_registered?.toLowerCase().includes(normalized)
    );
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/households");
      setHouseholds(res.data);
      setFilteredHouseholds(applySearch(res.data, searchTerm));
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredHouseholds(applySearch(households, term));
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditInput = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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

  // EDIT HOUSEHOLD
  const handleEdit = (household) => {
    setEditingId(household.household_id);
    setEditForm({
      address: household.address || "",
      purok: household.purok || "",
      date_registered: formatDateForInput(household.date_registered)
    });
  };

  // SAVE EDIT
  const handleSaveEdit = async (household) => {
    try {
      const payload = {};

      if (editForm.address !== (household.address || "")) {
        payload.address = editForm.address;
      }

      if (editForm.purok !== (household.purok || "")) {
        payload.purok = editForm.purok;
      }

      if (editForm.date_registered !== formatDateForInput(household.date_registered)) {
        payload.date_registered = editForm.date_registered;
      }

      if (Object.values(payload).some((value) => value === "")) {
        alert("Please fill the field you changed");
        return;
      }

      if (Object.keys(payload).length === 0) {
        alert("No changes to save");
        return;
      }

      await axios.put(`http://localhost:5000/api/households/${household.household_id}`, payload);
      alert("Household updated successfully!");
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      alert("Failed to update household");
    }
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
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
        {/* SEARCH BAR */}
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="🔍 Search by household ID, address, purok, or date..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

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
              {filteredHouseholds.map((h) => (
                <tr key={h.household_id}>
                  <td>{h.household_id}</td>
                  <td>
                    {editingId === h.household_id ? (
                      <input
                        type="text"
                        name="address"
                        value={editForm.address}
                        onChange={handleEditInput}
                      />
                    ) : (
                      h.address
                    )}
                  </td>
                  <td>
                    {editingId === h.household_id ? (
                      <input
                        type="text"
                        name="purok"
                        value={editForm.purok}
                        onChange={handleEditInput}
                      />
                    ) : (
                      h.purok
                    )}
                  </td>
                  <td>
                    {editingId === h.household_id ? (
                      <input
                        type="date"
                        name="date_registered"
                        value={editForm.date_registered}
                        onChange={handleEditInput}
                      />
                    ) : (
                      h.date_registered
                    )}
                  </td>
                  <td>
                    {editingId === h.household_id ? (
                      <>
                        <button
                          type="button"
                          className="btn-save"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSaveEdit(h);
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCancelEdit();
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEdit(h);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={(e) => {
                            e.preventDefault();
                            if (!window.confirm('Delete this household and its related residents?')) return;
                            deleteHousehold(h.household_id);
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
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

          <button type="button" className="btn-add" onClick={(e) => {
            e.preventDefault();
            addHousehold();
          }}>
            Add Household
          </button>
        </div>
      </div>

<button type="button" className="btn-back" onClick={(e) => {
        e.preventDefault();
        navigate("/dashboard");
      }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default HouseholdManagement;
