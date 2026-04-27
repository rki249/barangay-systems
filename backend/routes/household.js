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

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM household WHERE household_id = ?', [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json({ message: 'Deleted successfully' });
  });
});

module.exports = router;
