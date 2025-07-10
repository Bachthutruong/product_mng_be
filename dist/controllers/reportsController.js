"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesSummary = void 0;
const database_1 = require("../config/database");
const getSalesSummary = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const { startDate, endDate } = req.query;
        const matchStage = {
            status: { $in: ['delivered', 'completed'] },
            isDeleted: { $ne: true },
        };
        if (startDate && endDate) {
            matchStage.orderDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
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
    }
    catch (error) {
        next(error);
    }
};
exports.getSalesSummary = getSalesSummary;
