// Express server configuration

// Required dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from multiple directories
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pages')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Routes
const dashboardRoutes = require('./routes/dashboard');
const employeesRoutes = require('./routes/employees');
const inventoryRoutes = require('./routes/inventory');
const reservationsRoutes = require('./routes/reservations');
const salesRoutes = require('./routes/sales');
const authRoutes = require('./routes/auth');

// API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes);

// Serve index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'sign-in.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Port configuration
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
