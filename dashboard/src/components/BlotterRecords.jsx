import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/BlotterRecords.css";
import { useNavigate } from "react-router-dom";

function BlotterRecords() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [residents, setResidents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    complainant_id: "",
    respondent_name: "",
    incident_date: "",
    incident_location: "",
    complaint_details: "",
    status: "Pending",
    recorded_by: ""
  });

  const applySearch = (list, term) => {
    const normalized = term?.toLowerCase().trim();
    if (!normalized) return list;

    return list.filter(
      (record) =>
        record.complainant_name?.toLowerCase().includes(normalized) ||
        record.respondent_name?.toLowerCase().includes(normalized) ||
        record.blotter_id?.toString().includes(normalized) ||
        record.incident_location?.toLowerCase().includes(normalized) ||
        record.complaint_details?.toLowerCase().includes(normalized) ||
        record.status?.toLowerCase().includes(normalized)
    );
  };

  // GET BLOTTERS
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blotters");
      setRecords(res.data);
      setFilteredRecords(applySearch(res.data, searchTerm));
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

  // SEARCH FILTER
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredRecords(applySearch(records, term));
  };

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

  // EDIT STATUS
  const handleEditStatus = (blotterId, currentStatus) => {
    setEditingId(blotterId);
    setEditStatus(currentStatus);
  };

  // SAVE STATUS EDIT
  const handleSaveStatus = async (blotterId) => {
    try {
      const blotter = records.find(r => r.blotter_id === blotterId);
      await axios.put(`http://localhost:5000/api/blotters/${blotterId}`, {
        ...blotter,
        status: editStatus
      });
      
      alert("Status updated successfully!");
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStatus("");
  };

  return (
    <div className="blotter-container">
      <h2 className="title">Blotter Records</h2>

      {/* SEARCH BAR */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Search by name, ID or location..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((r) => (
              <tr key={r.blotter_id}>
                <td>{r.blotter_id}</td>
                <td>{r.complainant_name}</td>
                <td>{r.respondent_name}</td>
                <td>{r.incident_date}</td>
                <td>{r.incident_location}</td>
                <td>
                  {editingId === r.blotter_id ? (
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
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
                  )}
                </td>
                <td>
                  {editingId === r.blotter_id ? (
                    <>
                      <button 
                        type="button"
                        className="save-btn" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveStatus(r.blotter_id);
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
                    <button 
                      type="button"
                      className="edit-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditStatus(r.blotter_id, r.status);
                      }}
                    >
                      Edit
                    </button>
                  )}
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

<button type="button" className="back-btn" onClick={(e) => {
        e.preventDefault();
        navigate("/dashboard");
      }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default BlotterRecords;