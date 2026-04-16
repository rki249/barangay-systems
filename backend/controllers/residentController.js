const db = require('../db');

exports.getResidents = (req, res) => {
    const sql = "SELECT * FROM resident";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
};

exports.addResident = (req, res) => {

    // ✅ MATCH YOUR FRONTEND
    const { full_name, age, gender, household_id } = req.body;

    const sql = `
        INSERT INTO resident 
        (full_name, age, gender, household_id) 
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [full_name, age, gender, household_id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json("Resident Added Successfully");
        }
    );
};