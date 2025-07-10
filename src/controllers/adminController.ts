import { Request, Response, NextFunction } from 'express';
import { getDB } from '@/config/database';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    const { search = '' } = req.query;

    let query: any = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await db.collection('users').find(query).project({ password: 0 }).toArray();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Add user
// @route   POST /api/admin/users
// @access  Private/Admin
export const addUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const db = getDB();
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            res.status(400).json({ success: false, error: 'Please provide all required fields' });
            return;
        }

        const userExists = await db.collection('users').findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, error: 'User with this email already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            name,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('users').insertOne(newUser);
        
        if (result.insertedId) {
            const createdUser = await db.collection('users').findOne({ _id: result.insertedId }, { projection: { password: 0 }});
            res.status(201).json({ success: true, data: createdUser });
        } else {
            throw new Error('User creation failed.');
        }

    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, role } = req.body;
    
    const db = getDB();
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { fullName, role, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 } }
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const db = getDB();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid user ID' });
            return;
        }
        
        // Prevent admin from deleting themselves
        if (req.user._id.toString() === id) {
            res.status(400).json({ success: false, error: 'You cannot delete your own account.' });
            return;
        }

        const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all deleted orders
// @route   GET /api/admin/deleted-orders
// @access  Private/Admin
export const getDeletedOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    const {
      page = '1',
      limit = '10',
      search = '',
      status = '',
      startDate = '',
      endDate = ''
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { isDeleted: true };

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.deletedAt = {};
      if (startDate) {
        filter.deletedAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.deletedAt.$lte = new Date(endDate as string);
      }
    }

    const orders = await db.collection('orders')
      .find(filter)
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const totalCount = await db.collection('orders').countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore a deleted order
// @route   PUT /api/admin/restore-order/:id
// @access  Private (Admin)
export const restoreOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const db = getDB();
    await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isDeleted: false, updatedAt: new Date() }, $unset: { deletedAt: "", deletedByUserId: "", deletedByName: "" } }
    );
    res.status(200).json({ success: true, message: 'Order restored' });
  } catch (error) {
    next(error);
  }
}; 