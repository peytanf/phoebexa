const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all employees
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employees');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// GET employee by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// GET employees chart data
router.get('/chart/roles', async (req, res) => {
    try {
        const query = `
            SELECT 
                role,
                COUNT(*) as count
            FROM employees
            GROUP BY role
        `;
        
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching employee roles chart data:', error);
        res.status(500).json({ error: 'Failed to fetch employee roles chart data' });
    }
});

module.exports = router; 