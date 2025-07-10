import { Request, Response, NextFunction } from 'express';
import { getDB } from '@/config/database';
import { ObjectId } from 'mongodb';
import {
  CreateCustomerSchema,
  UpdateCustomerSchema,
//   type CreateCustomerInput,
//   type UpdateCustomerInput
} from '@/models/Customer';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();

    const {
      page = '1',
      limit = '10',
      search = '',
      categoryId = ''
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const customers = await db.collection('customers')
      .find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const totalCount = await db.collection('customers').countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single customer
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = async (req: Request, res: Response) => {
    try {
        const db = getDB();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid customer ID' });
        }

        const customer = await db.collection('customers').findOne({ _id: new ObjectId(id) });

        if (!customer) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }
        
        return res.status(200).json({ success: true, data: customer });
    } catch (error) {
        console.error('Error fetching customer:', error);
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private (Admin/Employee)
export const createCustomer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validation = CreateCustomerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      });
      return;
    }

    const customerData = validation.data;
    const db = getDB();

    // Get category name
    const category = await db.collection('customer_categories').findOne({ _id: new ObjectId(customerData.categoryId) });
    if (!category) {
      res.status(400).json({
        success: false,
        error: 'Customer category not found'
      });
      return;
    }

    const newCustomer = {
      ...customerData,
      categoryName: category.name,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('customers').insertOne(newCustomer);
    const createdCustomer = await db.collection('customers').findOne({ _id: result.insertedId });

    res.status(201).json({
      success: true,
      data: createdCustomer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private (Admin/Employee)
export const updateCustomer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid customer ID' });
      return;
    }

    const validation = UpdateCustomerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'Invalid input data', details: validation.error.errors });
      return;
    }

    const customerData = validation.data;
    const db = getDB();

    const updateFields: any = { ...customerData, updatedAt: new Date() };

    // If categoryId is updated, update categoryName as well
    if (customerData.categoryId) {
      const category = await db.collection('customer_categories').findOne({ _id: new ObjectId(customerData.categoryId) });
      if (category) {
        updateFields.categoryName = category.name;
      }
    }

    const result = await db.collection('customers').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      res.status(404).json({ success: false, error: 'Customer not found' });
      return;
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin only)
export const deleteCustomer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid customer ID' });
      return;
    }

    const db = getDB();

    // Optional: Check if customer has associated orders before deleting
    const orderCount = await db.collection('orders').countDocuments({ customerId: id, isDeleted: { $ne: true } });
    if (orderCount > 0) {
      res.status(400).json({ success: false, error: 'Cannot delete customer with active orders. Please reassign or delete orders first.' });
      return;
    }

    const result = await db.collection('customers').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ success: false, error: 'Customer not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer categories
// @route   GET /api/customers/categories
// @access  Private
export const getCustomerCategories = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    const categories = await db.collection('customerCategories')
      .find({ isActive: true })
      .sort({ name: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
}; 