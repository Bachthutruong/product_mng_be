import express from 'express';
import { protect, authorize } from '@/middleware/auth';
import {
  getCustomerCategories,
  createCustomerCategory,
  updateCustomerCategory,
  deleteCustomerCategory
} from '@/controllers/customerCategoryController';

const router = express.Router();

router.route('/')
  .get(protect, getCustomerCategories)
  .post(protect, authorize('admin', 'employee'), createCustomerCategory);

router.route('/:id')
  .put(protect, authorize('admin', 'employee'), updateCustomerCategory)
  .delete(protect, authorize('admin'), deleteCustomerCategory);

export default router; 