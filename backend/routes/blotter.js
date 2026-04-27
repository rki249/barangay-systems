const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = `
    SELECT b.*, 
           CONCAT(r.first_name, ' ', r.last_name) AS complainant_name,
           u.full_name AS recorded_by_name
    FROM blotter b
    LEFT JOIN resident r ON b.complainant_id = r.resident_id
    LEFT JOIN users u ON b.recorded_by = u.user_id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const {
    complainant_id,
    respondent_name,
    incident_date,
    incident_location,
    complaint_details,
    status,
    recorded_by
  } = req.body;

  const sql = `
    INSERT INTO blotter (
      complainant_id,
      respondent_name,
      incident_date,
      incident_location,
      complaint_details,
      status,
      recorded_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const complainantId = complainant_id ? Number(complainant_id) : null;
  const recordedBy = recorded_by ? Number(recorded_by) : null;

  db.query(
    sql,
    [
      complainantId,
      respondent_name,
      incident_date,
      incident_location,
      complaint_details,
      status || 'Pending',
      recordedBy
    ],
    (err, result) => {
      if (err) {
        console.log('INSERT ERROR:', err);
        return res.status(500).json(err);
      }

      res.json({ message: 'Blotter added successfully' });
    }
  );
});

module.exports = router;
