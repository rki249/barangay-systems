const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/login
router.post("/", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server Error", error: err });
    }

    if (result.length > 0) {
      // Login successful
      res.json({ message: "Login Successful", user: result[0] });
    } else {
      // Login failed 
      res.status(401).json({ message: "Invalid Username or Password" });
    }
  });
});

module.exports = router;