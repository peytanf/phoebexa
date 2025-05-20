const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all reservations with customer and product details
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                r.*,
                c.name as customer_name,
                i.product_name,
                e.name as employee_name
            FROM reservations r
            LEFT JOIN customers c ON r.customer_id = c.customer_id
            LEFT JOIN inventory i ON r.product_id = i.product_id
            LEFT JOIN employees e ON r.employee_id = e.employee_id
            ORDER BY r.reservation_date DESC
        `;
        
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

// GET reservation status summary
router.get('/status/summary', async (req, res) => {
    try {
        const query = `
            SELECT 
                status,
                COUNT(*) as count,
                COUNT(DISTINCT customer_id) as unique_customers,
                COUNT(DISTINCT product_id) as unique_products,
                SUM(quantity) as total_items
            FROM reservations
            GROUP BY status
        `;
        
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching reservation status:', error);
        res.status(500).json({ error: 'Failed to fetch reservation status' });
    }
});

// GET reservation by ID with details
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT 
                r.*,
                c.name as customer_name,
                c.email as customer_email,
                c.phone as customer_phone,
                i.product_name,
                i.price as unit_price,
                e.name as employee_name
            FROM reservations r
            LEFT JOIN customers c ON r.customer_id = c.customer_id
            LEFT JOIN inventory i ON r.product_id = i.product_id
            LEFT JOIN employees e ON r.employee_id = e.employee_id
            WHERE r.reservation_id = ?
        `;
        
        const [rows] = await pool.query(query, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({ error: 'Failed to fetch reservation' });
    }
});

// GET reservations by date range
router.get('/range/:startDate/:endDate', async (req, res) => {
    try {
        const query = `
            SELECT 
                r.*,
                c.name as customer_name,
                i.product_name,
                e.name as employee_name
            FROM reservations r
            LEFT JOIN customers c ON r.customer_id = c.customer_id
            LEFT JOIN inventory i ON r.product_id = i.product_id
            LEFT JOIN employees e ON r.employee_id = e.employee_id
            WHERE r.reservation_date BETWEEN ? AND ?
            ORDER BY r.reservation_date
        `;
        
        const [rows] = await pool.query(query, [req.params.startDate, req.params.endDate]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching reservations by date range:', error);
        res.status(500).json({ error: 'Failed to fetch reservations by date range' });
    }
});

// GET upcoming reservations
router.get('/status/upcoming', async (req, res) => {
    try {
        const query = `
            SELECT 
                r.*,
                c.name as customer_name,
                i.product_name,
                e.name as employee_name
            FROM reservations r
            LEFT JOIN customers c ON r.customer_id = c.customer_id
            LEFT JOIN inventory i ON r.product_id = i.product_id
            LEFT JOIN employees e ON r.employee_id = e.employee_id
            WHERE r.reservation_date >= CURDATE()
            ORDER BY r.reservation_date, r.created_at
            LIMIT 30
        `;
        
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching upcoming reservations:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming reservations' });
    }
});

module.exports = router; 