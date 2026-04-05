app.get("/api/blotters", (req, res) => {
  const sql = `
    SELECT b.*, 
           CONCAT(r.first_name, ' ', r.last_name) AS complainant_name,
           u.full_name AS recorded_by_name
    FROM blotter b
    LEFT JOIN resident r ON b.complainant_id = r.resident_id
    LEFT JOIN users u ON b.recorded_by = u.user_id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});