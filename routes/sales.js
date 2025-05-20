const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all sales
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM sales');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Failed to fetch sales' });
    }
});

// GET sales by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM sales WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching sale:', error);
        res.status(500).json({ error: 'Failed to fetch sale' });
    }
});

// GET sales by date range
router.get('/range/:startDate/:endDate', async (req, res) => {
    try {
        const { startDate, endDate } = req.params;
        const query = `
            SELECT * FROM sales
            WHERE sale_date BETWEEN ? AND ?
            ORDER BY sale_date DESC
        `;
        
        const [rows] = await pool.query(query, [startDate, endDate]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching sales by date range:', error);
        res.status(500).json({ error: 'Failed to fetch sales by date range' });
    }
});

// GET sales summary stats
router.get('/stats/summary', async (req, res) => {
    try {
        const query = `
            SELECT 
                DATE_FORMAT(sale_date, '%Y-%m-%d') as date,
                COUNT(*) as total_sales,
                SUM(amount) as total_amount,
                AVG(amount) as average_sale
            FROM sales
            GROUP BY DATE_FORMAT(sale_date, '%Y-%m-%d')
            ORDER BY date DESC
            LIMIT 30
        `;
        
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sales summary:', error);
        res.status(500).json({ error: 'Failed to fetch sales summary' });
    }
});

module.exports = router; 