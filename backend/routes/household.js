// GET households
app.get("/api/households", (req, res) => {
  db.query("SELECT * FROM household", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// ADD household
app.post("/api/households", (req, res) => {
  const { address, purok, date_registered } = req.body;

  db.query(
    "INSERT INTO household (address, purok, date_registered) VALUES (?, ?, ?)",
    [address, purok, date_registered],
    (err) => {
      if (err) return res.send(err);
      res.send("Household added");
    }
  );
});

// DELETE household
app.delete("/api/households/:id", (req, res) => {
  db.query(
    "DELETE FROM household WHERE household_id=?",
    [req.params.id],
    (err) => {
      if (err) return res.send(err);
      res.send("Deleted");
    }
  );
});