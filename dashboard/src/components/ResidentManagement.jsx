import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/ResidentManagement.css";

function ResidentManagement() {
  const navigate = useNavigate();

  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    sex: "",
    birthdate: "",
    household_id: ""
  });

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    return dateValue.toString().slice(0, 10);
  };

  // FETCH RESIDENTS
  const fetchResidents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/residents");
      setResidents(res.data);
      setFilteredResidents(applySearch(res.data, searchTerm));
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      alert("Failed to fetch residents. Check backend.");
    }
  };

  const applySearch = (list, term) => {
    const normalized = term?.toLowerCase().trim();
    if (!normalized) return list;

    return list.filter((resident) =>
      resident.resident_id?.toString().includes(normalized) ||
      resident.household_id?.toString().includes(normalized) ||
      resident.first_name?.toLowerCase().includes(normalized) ||
      resident.last_name?.toLowerCase().includes(normalized)
    );
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

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredResidents(applySearch(residents, term));
  };

  // HANDLE INPUT
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // HANDLE EDIT INPUT
  const handleEditInput = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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

  // EDIT RESIDENT
  const handleEdit = (resident) => {
    setEditingId(resident.resident_id);
    setEditForm({
      first_name: resident.first_name || "",
      last_name: resident.last_name || "",
      sex: resident.sex || "",
      birthdate: formatDateForInput(resident.birthdate),
      household_id: resident.household_id || ""
    });
  };

  // SAVE EDIT
  const handleSaveEdit = async (resident) => {
    try {
      const payload = {};

      if (editForm.first_name !== (resident.first_name || "")) {
        payload.first_name = editForm.first_name;
      }

      if (editForm.last_name !== (resident.last_name || "")) {
        payload.last_name = editForm.last_name;
      }

      if (editForm.sex !== (resident.sex || "")) {
        payload.sex = editForm.sex;
      }

      if (editForm.birthdate !== formatDateForInput(resident.birthdate)) {
        payload.birthdate = editForm.birthdate;
      }

      if (Number(editForm.household_id) !== Number(resident.household_id)) {
        payload.household_id = Number(editForm.household_id);
      }

      if (Object.values(payload).some((value) => value === "" || Number.isNaN(value))) {
        alert("Please fill the field you changed");
        return;
      }

      if (Object.keys(payload).length === 0) {
        alert("No changes to save");
        return;
      }

      await axios.put(`http://localhost:5000/api/residents/${resident.resident_id}`, payload);
      alert("Resident updated successfully!");
      setEditingId(null);
      fetchResidents();
    } catch (err) {
      console.error("❌ UPDATE ERROR:", err);
      alert("Failed to update resident");
    }
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
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

      {/* SEARCH BAR */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Search by name, ID, or household..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

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
            {filteredResidents.map((r) => (
              <tr key={r.resident_id}>
                <td>{r.resident_id}</td>
                <td>
                  {editingId === r.resident_id ? (
                    <>
                      <input
                        type="text"
                        name="first_name"
                        value={editForm.first_name}
                        onChange={handleEditInput}
                        style={{ marginRight: "5px", width: "45%" }}
                      />
                      <input
                        type="text"
                        name="last_name"
                        value={editForm.last_name}
                        onChange={handleEditInput}
                        style={{ width: "45%" }}
                      />
                    </>
                  ) : (
                    `${r.first_name || ''} ${r.last_name || ''}`.trim()
                  )}
                </td>
                <td>
                  {editingId === r.resident_id ? (
                    <input
                      type="date"
                      name="birthdate"
                      value={editForm.birthdate}
                      onChange={handleEditInput}
                    />
                  ) : (
                    r.birthdate
                  )}
                </td>
                <td>
                  {editingId === r.resident_id ? (
                    <select
                      name="sex"
                      value={editForm.sex}
                      onChange={handleEditInput}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    r.sex
                  )}
                </td>
                <td>
                  {editingId === r.resident_id ? (
                    <select
                      name="household_id"
                      value={editForm.household_id}
                      onChange={handleEditInput}
                    >
                      <option value="">Select</option>
                      {households.map((h) => (
                        <option key={h.household_id} value={h.household_id}>
                          {h.household_id}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.household_id
                  )}
                </td>
                <td>
                  {editingId === r.resident_id ? (
                    <>
                      <button
                        type="button"
                        className="save-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveEdit(r);
                        }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
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
                        className="edit-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(r);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!window.confirm('Delete this resident?')) return;
                          deleteResident(r.resident_id);
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

        <button type="button" className="add-btn" onClick={(e) => {
          e.preventDefault();
          addResident();
        }}>
          Add Resident
        </button>
      </div>

      <button type="button" className="back-btn" onClick={(e) => {
        e.preventDefault();
        navigate("/dashboard");
      }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default ResidentManagement;
