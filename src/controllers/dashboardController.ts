import { Request, Response, NextFunction } from 'express';
import { getDB } from '@/config/database';
// import { ObjectId } from 'mongodb';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get dashboard overview stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();

    // Only count active products (not discontinued)
    const totalProducts = await db.collection('products').countDocuments({
      discontinued: { $ne: true }
    });
    const totalCustomers = await db.collection('customers').countDocuments();
    const activeOrders = await db.collection('orders').countDocuments({
      status: { $in: ['pending', 'processing', 'shipped'] },
      isDeleted: { $ne: true },
    });

    // Current month revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const revenueData = await db.collection('orders').aggregate([
      {
        $match: {
          orderDate: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['delivered', 'completed'] },
          isDeleted: { $ne: true },
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]).toArray();

    const currentMonthRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalCustomers,
        activeOrders,
        currentMonthRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/recent-activity
// @access  Private
export const getRecentActivity = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    const limit = 5;

    const recentOrders = await db.collection('orders').find({ isDeleted: { $ne: true } }).sort({ orderDate: -1 }).limit(limit).toArray();
    
    const recentInventoryMovements = await db.collection('inventory_movements')
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    res.status(200).json({
      success: true,
      data: {
        recentOrders,
        recentInventoryMovements
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory alerts
// @route   GET /api/dashboard/inventory-alerts
// @access  Private
export const getInventoryAlerts = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    
    // Get low stock products (excluding discontinued products)
    const lowStockProducts = await db.collection('products').find({
      $and: [
        { $expr: { $lte: ['$stock', '$lowStockThreshold'] } },
        { discontinued: { $ne: true } } // Exclude discontinued products
      ]
    }).limit(10).toArray();

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    // Get nearly expired products (excluding discontinued products)
    const nearlyExpiredProducts = await db.collection('products').find({
      $and: [
        { expiryDate: { $lte: oneYearFromNow } },
        { discontinued: { $ne: true } } // Exclude discontinued products
      ]
    }).limit(10).toArray();

    res.status(200).json({
      success: true,
      data: {
        lowStock: lowStockProducts,
        nearlyExpired: nearlyExpiredProducts
      }
    });
  } catch (error) {
    next(error);
  }
}; 