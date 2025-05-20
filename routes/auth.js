const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        // Get user from database
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = rows[0];
        
        // Check password (in a real app, passwords should be hashed)
        // This is a simplified version for demonstration
        const isMatch = password === user.password; // In production, use bcrypt.compare(password, user.password)
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Store user in session
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Check if user is authenticated
router.get('/check', (req, res) => {
    if (req.session.user) {
        return res.json({
            authenticated: true,
            user: req.session.user
        });
    }
    
    res.json({
        authenticated: false
    });
});

// User logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        
        res.json({ message: 'Logout successful' });
    });
});

module.exports = router; 