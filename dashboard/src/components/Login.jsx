import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();   

  const loginUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      alert(res.data.message); 
      setUser(res.data.user);
      navigate("/dashboard");

    } catch (err) {
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Cannot reach server");
      }
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Barangay System Login</h2>

      <input
        className="login-input"
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="login-input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-button" onClick={loginUser}>
        Login
      </button>
    </div>
  );
}

export default Login;