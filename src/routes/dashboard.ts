import express from 'express';
import { protect } from '@/middleware/auth';
import { 
  getDashboardStats,
  getRecentActivity,
  getInventoryAlerts
} from '@/controllers/dashboardController';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/recent-activity', protect, getRecentActivity);
router.get('/inventory-alerts', protect, getInventoryAlerts);

export default router; 