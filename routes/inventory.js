const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all inventory items
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM inventory');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

// GET inventory item by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM inventory WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        res.status(500).json({ error: 'Failed to fetch inventory item' });
    }
});

// GET inventory by category
router.get('/category/:category', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM inventory WHERE category = ?', [req.params.category]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching inventory by category:', error);
        res.status(500).json({ error: 'Failed to fetch inventory by category' });
    }
});

// GET inventory stats
router.get('/stats/summary', async (req, res) => {
    try {
        const query = `
            SELECT 
                category,
                COUNT(*) as item_count,
                SUM(quantity) as total_quantity,
                AVG(price) as average_price
            FROM inventory
            GROUP BY category
        `;
        
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching inventory stats:', error);
        res.status(500).json({ error: 'Failed to fetch inventory stats' });
    }
});

module.exports = router; 