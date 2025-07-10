import express from 'express';
import { 
    getInventoryMovements, 
    recordStockIn, 
    recordStockAdjustment,
    revertInventoryMovement
} from '@/controllers/inventoryController';
import { protect, authorize } from '@/middleware/auth';

const router = express.Router();

router.route('/movements').get(protect, getInventoryMovements);
router.route('/stock-in').post(protect, authorize('admin', 'employee'), recordStockIn);
router.route('/adjustment').post(protect, authorize('admin', 'employee'), recordStockAdjustment);
router.route('/movements/:id/revert').post(protect, authorize('admin', 'employee'), revertInventoryMovement);

export default router; 