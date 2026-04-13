import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    password: "",
    role: ""
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addUser = async () => {
    try {
      await axios.post("http://localhost:5000/api/users", form);
      alert("User added successfully");

      setForm({
        full_name: "",
        username: "",
        password: "",
        role: ""
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-container">
      <h2 className="title">User Management</h2>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.full_name}</td>
                <td>{u.username}</td>
                <td>
                  <span className={`role ${u.role?.toLowerCase()}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(u.user_id)}
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
        <h3>Add New User</h3>

        <input
          className="input"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleInput}
        />

        <input
          className="input"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleInput}
        />

        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleInput}
        />

        <input
          className="input"
          name="role"
          placeholder="Role (Admin/User)"
          value={form.role}
          onChange={handleInput}
        />

        <button className="add-btn" onClick={addUser}>
          Add User
        </button>
      </div>
    </div>
  );
}

export default UserManagement;