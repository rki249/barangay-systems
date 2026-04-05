import React, { useState, useEffect } from "react";
import axios from "axios";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ full_name: "", username: "", password: "", role: "" });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addUser = async () => {
    try {
      await axios.post("http://localhost:5000/api/users", form);
      alert("User added successfully");
      setForm({ full_name: "", username: "", password: "", role: "" });
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h3>User Management</h3>

      <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr><th>ID</th><th>Full Name</th><th>Username</th><th>Role</th><th>Action</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user_id}>
              <td>{u.user_id}</td>
              <td>{u.full_name}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td><button onClick={() => deleteUser(u.user_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Add New User</h4>
      <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleInput} />
      <input name="username" placeholder="Username" value={form.username} onChange={handleInput} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleInput} />
      <input name="role" placeholder="Role" value={form.role} onChange={handleInput} />
      <button onClick={addUser}>Add User</button>
    </div>
  );
}

export default UserManagement;