import { Router } from 'express';
import { 
  getOrders, 
  getOrder, 
  createOrder, 
  updateOrder, 
  deleteOrder,
  updateOrderStatus
} from '@/controllers/orderController';
import { protect, authorize } from '@/middleware/auth';

const router = Router();

router.route('/')
  .get(protect, getOrders)
  .post(protect, authorize('admin', 'employee'), createOrder);

router.route('/:id')
  .get(protect, getOrder)
  .put(protect, authorize('admin', 'employee'), updateOrder)
  .delete(protect, authorize('admin'), deleteOrder);

router.route('/:id/status')
    .put(protect, authorize('admin', 'employee'), updateOrderStatus);

export default router; 