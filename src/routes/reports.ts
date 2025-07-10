import express from 'express';
import { protect } from '@/middleware/auth';
import { getSalesSummary } from '@/controllers/reportsController';

const router = express.Router();

router.get('/sales-summary', protect, getSalesSummary);

export default router; 