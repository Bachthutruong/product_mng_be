import express from 'express';
import { protect, authorize } from '@/middleware/auth';
import upload from '@/middleware/upload';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  uploadProductImages,
  deleteProductImage,
  setPrimaryProductImage
} from '@/controllers/productController';

const router = express.Router();

// Product routes
router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize('admin', 'employee'), createProduct);

router.route('/categories')
  .get(protect, getProductCategories)
  .post(protect, authorize('admin', 'employee'), createProductCategory);

router.route('/categories/:id')
  .put(protect, authorize('admin', 'employee'), updateProductCategory)
  .delete(protect, authorize('admin'), deleteProductCategory);

router.route('/:id')
  .get(protect, getProduct)
  .put(protect, authorize('admin', 'employee'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/images')
  .post(protect, authorize('admin', 'employee'), upload.array('images', 5), uploadProductImages);

router.delete('/:id/images/:imageId', protect, authorize('admin', 'employee'), deleteProductImage);
router.put('/:id/images/:imageId/primary', protect, authorize('admin', 'employee'), setPrimaryProductImage);

export default router; 