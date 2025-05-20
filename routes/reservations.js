const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all reservations
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM reservations');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

// GET reservation by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({ error: 'Failed to fetch reservation' });
    }
});

// GET reservations by date
router.get('/date/:date', async (req, res) => {
    try {
        const query = `
            SELECT * FROM reservations
            WHERE DATE(reservation_date) = ?
            ORDER BY reservation_time
        `;
        
        const [rows] = await pool.query(query, [req.params.date]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching reservations by date:', error);
        res.status(500).json({ error: 'Failed to fetch reservations by date' });
    }
});

// GET upcoming reservations
router.get('/status/upcoming', async (req, res) => {
    try {
        const query = `
            SELECT * FROM reservations
            WHERE reservation_date >= CURDATE()
            ORDER BY reservation_date, reservation_time
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