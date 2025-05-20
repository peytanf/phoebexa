const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get dashboard summary counts
router.get('/summary', async (req, res) => {
    try {
        const queries = [
            'SELECT COUNT(*) as count FROM employees',
            'SELECT COUNT(*) as count FROM inventory',
            'SELECT COUNT(*) as count FROM reservations',
            'SELECT COUNT(*) as count FROM sales'
        ];

        const [employeesCount, inventoryCount, reservationsCount, salesCount] = await Promise.all(
            queries.map(query => pool.query(query))
        );

        res.json({
            employees: employeesCount[0][0].count,
            inventory: inventoryCount[0][0].count,
            reservations: reservationsCount[0][0].count,
            sales: salesCount[0][0].count
        });
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard summary' });
    }
});

// Get recent data for all tables
router.get('/recent', async (req, res) => {
    try {
        const queries = [
            'SELECT * FROM employees ORDER BY id DESC LIMIT 10',
            'SELECT * FROM inventory ORDER BY id DESC LIMIT 10',
            'SELECT * FROM reservations ORDER BY id DESC LIMIT 10',
            'SELECT * FROM sales ORDER BY id DESC LIMIT 10'
        ];

        const [employees, inventory, reservations, sales] = await Promise.all(
            queries.map(query => pool.query(query))
        );

        res.json({
            employees: employees[0],
            inventory: inventory[0],
            reservations: reservations[0],
            sales: sales[0]
        });
    } catch (error) {
        console.error('Error fetching recent data:', error);
        res.status(500).json({ error: 'Failed to fetch recent data' });
    }
});

// Get sales data for chart
router.get('/sales-chart', async (req, res) => {
    try {
        const query = `
            SELECT 
                DATE_FORMAT(sale_date, '%Y-%m-%d') as date,
                SUM(amount) as total
            FROM sales
            GROUP BY DATE_FORMAT(sale_date, '%Y-%m-%d')
            ORDER BY date DESC
            LIMIT 7
        `;
        
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sales chart data:', error);
        res.status(500).json({ error: 'Failed to fetch sales chart data' });
    }
});

// Get inventory status for chart
router.get('/inventory-chart', async (req, res) => {
    try {
        const query = `
            SELECT 
                category,
                COUNT(*) as count,
                SUM(quantity) as total_quantity
            FROM inventory
            GROUP BY category
        `;
        
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching inventory chart data:', error);
        res.status(500).json({ error: 'Failed to fetch inventory chart data' });
    }
});

module.exports = router; 