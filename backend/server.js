const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/login", loginRoutes);
app.use("/api/users", userRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});