import { Request, Response, NextFunction } from 'express';
import { getDB } from '@/config/database';

// @desc    Get sales summary
// @route   GET /api/reports/sales-summary
// @access  Private
export const getSalesSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    const { startDate, endDate } = req.query;

    const matchStage: any = {
      status: { $in: ['delivered', 'completed'] },
      isDeleted: { $ne: true },
    };

    if (startDate && endDate) {
      matchStage.orderDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const summary = await db.collection('orders').aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' },
        }
      }
    ]).toArray();
    
    res.status(200).json({ success: true, data: summary[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 } });
  } catch (error) {
    next(error);
  }
}; 