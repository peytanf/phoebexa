// API routes

const express = require('express');
const router = express.Router();

// Import controller (we'll create this next)
const dataController = require('../controllers/dataController');

// Define API routes
// GET endpoints for different chart data
router.get('/sales-data', dataController.getSalesData);
router.get('/inventory-status', dataController.getInventoryStatus);
router.get('/employee-performance', dataController.getEmployeePerformance);
router.get('/reservation-trends', dataController.getReservationTrends);
router.get('/daily-stats', dataController.getDailyStats);
router.get('/monthly-comparison', dataController.getMonthlyComparison);
router.get('/yearly-analysis', dataController.getYearlyAnalysis);

module.exports = router;
