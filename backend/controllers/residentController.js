const db = require('../db');

exports.getResidents = (req, res) => {

    const sql = "SELECT * FROM resident";

    db.query(sql, (err, result) => {
        if(err){
            return res.status(500).json(err);
        }
        res.json(result);
    });
};

exports.addResident = (req, res) => {

    const {first_name, last_name, sex, birthdate} = req.body;

    const sql = `
        INSERT INTO resident 
        (first_name, last_name, sex, birthdate) 
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql,
        [first_name, last_name, sex, birthdate],
        (err, result)=>{
            if(err){
                return res.status(500).json(err);
            }
            res.json("Resident Added Successfully");
        }
    );
};