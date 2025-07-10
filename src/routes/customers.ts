import express from 'express';
import { 
    getCustomers, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer,
    getCustomer
} from '../controllers/customerController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, getCustomers)
    .post(protect, authorize('admin', 'employee'), createCustomer);

router.route('/:id')
    .get(protect, getCustomer)
    .put(protect, authorize('admin', 'employee'), updateCustomer)
    .delete(protect, authorize('admin'), deleteCustomer);

export default router; 