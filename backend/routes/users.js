const express = require('express');
const router = express.Router();
const db = require('../db');


// GET ALL USERS
router.get("/", (req, res) => {

    const sql = "SELECT * FROM users";

    db.query(sql, (err, result) => {

        if(err){
            return res.status(500).json(err);
        }

        res.json(result);
    });

});


// ADD USER
router.post("/", (req, res) => {

    const { full_name, username, password, role } = req.body;

    const sql = `
        INSERT INTO users
        (full_name, username, password, role)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql,
        [full_name, username, password, role],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json("User added successfully");
        }
    );
});

// DELETE USER
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM users WHERE user_id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json({ message: 'User deleted successfully' });
    });
});

module.exports = router;