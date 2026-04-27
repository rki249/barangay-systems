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

    const { first_name, last_name, sex, birthdate, household_id } = req.body;

    const sql = `
        INSERT INTO resident 
        (first_name, last_name, sex, birthdate, household_id) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [first_name, last_name, sex, birthdate, household_id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json("Resident Added Successfully");
        }
    );
};

exports.deleteResident = (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM resident WHERE resident_id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: 'Resident deleted successfully' });
    });
};