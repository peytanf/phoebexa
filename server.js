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
app.use(express.static(path.join(__dirname, 'public')));
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

// Serve static files
app.use('/', express.static(path.join(__dirname, 'pages')));

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
