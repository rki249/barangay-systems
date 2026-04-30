const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const residentRoutes = require('./routes/residents');
const householdRoutes = require('./routes/household');
const blotterRoutes = require('./routes/blotter');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/login', loginRoutes);
app.use('/api/users', userRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/blotters', blotterRoutes);

// Root route - API welcome message
app.get('/', (req, res) => {
    res.json({
        message: 'Barangay System API',
        status: 'online',
        version: '1.0.0',
        endpoints: {
            login: '/api/login',
            users: '/api/users',
            residents: '/api/residents',
            households: '/api/households',
            blotters: '/api/blotters'
        }
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});