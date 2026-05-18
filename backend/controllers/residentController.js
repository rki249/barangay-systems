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

exports.updateResident = (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM resident WHERE resident_id = ?', [id], (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        const currentResident = rows[0];
        const updatedResident = {
            first_name: req.body.first_name ?? currentResident.first_name,
            last_name: req.body.last_name ?? currentResident.last_name,
            sex: req.body.sex ?? currentResident.sex,
            birthdate: req.body.birthdate ?? currentResident.birthdate,
            household_id: req.body.household_id ?? currentResident.household_id
        };

        const sql = `
            UPDATE resident 
            SET first_name = ?, last_name = ?, sex = ?, birthdate = ?, household_id = ?
            WHERE resident_id = ?
        `;

        db.query(sql, [
            updatedResident.first_name,
            updatedResident.last_name,
            updatedResident.sex,
            updatedResident.birthdate,
            updatedResident.household_id,
            id
        ], (err) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({ message: 'Resident updated successfully' });
        });
    });
};

exports.deleteResident = (req, res) => {
    const id = req.params.id;

    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json(err);
        }

        const deleteBlotters = 'DELETE FROM blotter WHERE complainant_id = ?';
        db.query(deleteBlotters, [id], (err) => {
            if (err) {
                return db.rollback(() => res.status(500).json(err));
            }

            const deleteDocuments = 'DELETE FROM documents WHERE resident_id = ?';
            db.query(deleteDocuments, [id], (err) => {
                if (err) {
                    return db.rollback(() => res.status(500).json(err));
                }

                const deleteResidentSql = 'DELETE FROM resident WHERE resident_id = ?';
                db.query(deleteResidentSql, [id], (err, result) => {
                    if (err) {
                        return db.rollback(() => res.status(500).json(err));
                    }

                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => res.status(500).json(err));
                        }
                        res.json({ message: 'Resident deleted successfully' });
                    });
                });
            });
        });
    });
};
