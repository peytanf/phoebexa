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
        const [rows] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// GET employees chart data by department
router.get('/chart/departments', async (req, res) => {
    try {
        const query = `
            SELECT 
                d.name as department,
                COUNT(e.employee_id) as count
            FROM employees e
            JOIN departments d ON e.department_id = d.department_id
            GROUP BY d.department_id, d.name
        `;
        
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching employee departments chart data:', error);
        res.status(500).json({ error: 'Failed to fetch employee departments chart data' });
    }
});

module.exports = router; 