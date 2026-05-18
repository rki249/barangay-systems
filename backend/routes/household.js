const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM household ORDER BY household_id DESC', (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const { address, purok, date_registered } = req.body;

  const sql = `
    INSERT INTO household (address, purok, date_registered)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [address, purok, date_registered], (err, result) => {
    if (err) {
      console.log('INSERT ERROR:', err);
      return res.status(500).json(err);
    }

    res.json({ message: 'Household added successfully' });
  });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM household WHERE household_id = ?', [id], (err, rows) => {
    if (err) {
      console.log('UPDATE ERROR:', err);
      return res.status(500).json(err);
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Household not found' });
    }

    const currentHousehold = rows[0];
    const updatedHousehold = {
      address: req.body.address ?? currentHousehold.address,
      purok: req.body.purok ?? currentHousehold.purok,
      date_registered: req.body.date_registered ?? currentHousehold.date_registered
    };

    const sql = `
      UPDATE household 
      SET address = ?, purok = ?, date_registered = ?
      WHERE household_id = ?
    `;

    db.query(sql, [
      updatedHousehold.address,
      updatedHousehold.purok,
      updatedHousehold.date_registered,
      id
    ], (err) => {
      if (err) {
        console.log('UPDATE ERROR:', err);
        return res.status(500).json(err);
      }

      res.json({ message: 'Household updated successfully' });
    });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.beginTransaction((err) => {
    if (err) {
      console.log('TRANSACTION ERROR:', err);
      return res.status(500).json(err);
    }

    db.query('SELECT resident_id FROM resident WHERE household_id = ?', [id], (err, rows) => {
      if (err) {
        return db.rollback(() => res.status(500).json(err));
      }

      const residentIds = rows.map((row) => row.resident_id);

      const deleteDependents = (callback) => {
        if (residentIds.length === 0) {
          return callback();
        }

        const placeholders = residentIds.map(() => '?').join(',');
        const deleteBlottersSql = `DELETE FROM blotter WHERE complainant_id IN (${placeholders})`;
        db.query(deleteBlottersSql, residentIds, (err) => {
          if (err) {
            return db.rollback(() => res.status(500).json(err));
          }

          const deleteDocumentsSql = `DELETE FROM documents WHERE resident_id IN (${placeholders})`;
          db.query(deleteDocumentsSql, residentIds, (err) => {
            if (err) {
              return db.rollback(() => res.status(500).json(err));
            }
            callback();
          });
        });
      };

      deleteDependents(() => {
        const deleteResidentsSql = 'DELETE FROM resident WHERE household_id = ?';
        db.query(deleteResidentsSql, [id], (err) => {
          if (err) {
            return db.rollback(() => res.status(500).json(err));
          }

          db.query('DELETE FROM household WHERE household_id = ?', [id], (err) => {
            if (err) {
              return db.rollback(() => res.status(500).json(err));
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => res.status(500).json(err));
              }
              res.json({ message: 'Deleted successfully' });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
