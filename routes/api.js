// API routes

import express from 'express';
import * as dataController from '../controllers/dataController.js';

const router = express.Router();

// Define API routes
// GET endpoints for different chart data
router.get('/sales-data', dataController.getSalesData);
router.get('/inventory-status', dataController.getInventoryStatus);
router.get('/employee-performance', dataController.getEmployeePerformance);
router.get('/reservation-trends', dataController.getReservationTrends);
router.get('/daily-stats', dataController.getDailyStats);
router.get('/monthly-comparison', dataController.getMonthlyComparison);
router.get('/yearly-analysis', dataController.getYearlyAnalysis);

export default router;
