import { Request, Response, NextFunction } from 'express';
import { getDB } from '@/config/database';
import { ObjectId } from 'mongodb';
import { 
  CreateCustomerCategorySchema,
  UpdateCustomerCategorySchema,
} from '@/models/CustomerCategory';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all customer categories
// @route   GET /api/customer-categories
// @access  Private
export const getCustomerCategories = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    const collectionName = 'customer_categories';
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit }
    ];

    const categories = await db.collection(collectionName).aggregate(pipeline).toArray();
    const total = await db.collection(collectionName).countDocuments();
    
    res.status(200).json({ 
      success: true, 
      data: categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('[CustomerCategories] Error fetching categories:', error);
    next(error);
  }
};

// @desc    Create customer category
// @route   POST /api/customer-categories
// @access  Private (Admin/Employee)
export const createCustomerCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validation = CreateCustomerCategorySchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'Invalid input data', details: validation.error.errors });
      return;
    }

    const { name, description, code } = validation.data;
    const db = getDB();
    
    // Auto-generate code if not provided
    const categoryCode = code || name.toUpperCase().replace(/\s+/g, '_');

    // Check if name or code already exists
    const existingCategory = await db.collection('customer_categories').findOne({ $or: [{ name }, { code: categoryCode }] });
    if (existingCategory) {
      res.status(400).json({ success: false, error: 'Category name or code already exists' });
      return;
    }
    
    const newCategory = {
      name,
      description,
      code: categoryCode,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('customer_categories').insertOne(newCategory);
    const createdCategory = await db.collection('customer_categories').findOne({ _id: result.insertedId });

    res.status(201).json({ success: true, data: createdCategory });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer category
// @route   PUT /api/customer-categories/:id
// @access  Private (Admin/Employee)
export const updateCustomerCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid category ID' });
      return;
    }

    const validation = UpdateCustomerCategorySchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'Invalid input data', details: validation.error.errors });
      return;
    }

    const updateData = validation.data;
    const db = getDB();

    const result = await db.collection('customer_categories').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      res.status(404).json({ success: false, error: 'Category not found' });
      return;
    }
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer category
// @route   DELETE /api/customer-categories/:id
// @access  Private (Admin only)
export const deleteCustomerCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid category ID' });
      return;
    }

    const db = getDB();

    // Check if category is in use
    const customerCount = await db.collection('customers').countDocuments({ categoryId: id });
    if (customerCount > 0) {
      res.status(400).json({ success: false, error: 'Cannot delete category that is currently in use by customers.' });
      return;
    }

    const result = await db.collection('customer_categories').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ success: false, error: 'Category not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
}; 