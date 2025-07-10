"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.updateOrder = exports.createOrder = exports.getOrder = exports.getOrders = void 0;
const database_1 = require("../config/database");
const mongodb_1 = require("mongodb");
const Order_1 = require("../models/Order");
const getOrders = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const { page = 1, limit = 10, search = '', status, startDate, endDate, customerId } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        let query = {};
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'customer.name': { $regex: search, $options: 'i' } }
            ];
        }
        if (status) {
            query.status = status;
        }
        if (customerId) {
            query.customerId = customerId;
        }
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).toArray();
        const total = await db.collection('orders').countDocuments(query);
        res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
                hasNextPage: pageNum * limitNum < total,
                hasPrevPage: pageNum > 1,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrders = getOrders;
const getOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid order ID'
            });
            return;
        }
        const db = (0, database_1.getDB)();
        const order = await db.collection('orders').findOne({
            _id: new mongodb_1.ObjectId(id),
            isDeleted: { $ne: true }
        });
        if (!order) {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
            return;
        }
        let totalCost = 0;
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item) => {
                totalCost += (item.cost || 0) * item.quantity;
            });
        }
        const profit = order.subtotal - totalCost;
        const orderWithProfit = { ...order, profit };
        res.status(200).json({
            success: true,
            data: orderWithProfit
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrder = getOrder;
const createOrder = async (req, res, next) => {
    try {
        const validation = Order_1.CreateOrderSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                error: 'Invalid input data',
                details: validation.error.errors
            });
            return;
        }
        const orderData = validation.data;
        const user = req.user;
        const db = (0, database_1.getDB)();
        const customer = await db.collection('customers').findOne({ _id: new mongodb_1.ObjectId(orderData.customerId) });
        if (!customer) {
            res.status(400).json({
                success: false,
                error: 'Customer not found'
            });
            return;
        }
        let subtotal = 0;
        const enhancedItems = [];
        for (const item of orderData.items) {
            const product = await db.collection('products').findOne({ _id: new mongodb_1.ObjectId(item.productId) });
            if (!product) {
                res.status(400).json({
                    success: false,
                    error: `Product not found: ${item.productId}`
                });
                return;
            }
            const lineTotal = item.quantity * item.unitPrice;
            subtotal += lineTotal;
            enhancedItems.push({
                ...item,
                productName: product.name,
                productSku: product.sku || '',
                cost: product.cost || 0
            });
        }
        let discountAmount = 0;
        if (orderData.discountType && orderData.discountValue) {
            if (orderData.discountType === 'percentage') {
                discountAmount = (subtotal * orderData.discountValue) / 100;
            }
            else if (orderData.discountType === 'fixed') {
                discountAmount = orderData.discountValue;
            }
        }
        const shippingFee = orderData.shippingFee || 0;
        const totalAmount = subtotal - discountAmount + shippingFee;
        const orderCount = await db.collection('orders').countDocuments({});
        const orderNumber = `ORD${String(orderCount + 1).padStart(6, '0')}`;
        const newOrder = {
            orderNumber,
            customerId: orderData.customerId,
            customerName: customer.name,
            items: enhancedItems,
            subtotal,
            discountType: orderData.discountType || null,
            discountValue: orderData.discountValue || null,
            discountAmount,
            shippingFee,
            totalAmount,
            status: 'pending',
            orderDate: new Date(),
            notes: orderData.notes || null,
            createdByUserId: user._id.toString(),
            createdByName: user.fullName || user.name,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false
        };
        const result = await db.collection('orders').insertOne(newOrder);
        const createdOrder = await db.collection('orders').findOne({ _id: result.insertedId });
        res.status(201).json({
            success: true,
            data: createdOrder
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createOrder = createOrder;
const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid order ID'
            });
            return;
        }
        const validation = Order_1.UpdateOrderSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                error: 'Invalid input data',
                details: validation.error.errors
            });
            return;
        }
        const updateData = validation.data;
        const db = (0, database_1.getDB)();
        const existingOrder = await db.collection('orders').findOne({
            _id: new mongodb_1.ObjectId(id),
            isDeleted: { $ne: true }
        });
        if (!existingOrder) {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
            return;
        }
        const result = await db.collection('orders').findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                ...updateData,
                updatedAt: new Date()
            }
        }, { returnDocument: 'after' });
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrder = updateOrder;
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid order ID' });
            return;
        }
        const validation = Order_1.UpdateOrderStatusSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ success: false, error: 'Invalid input', details: validation.error.errors });
            return;
        }
        const { status } = validation.data;
        const db = (0, database_1.getDB)();
        const result = await db.collection('orders').findOneAndUpdate({ _id: new mongodb_1.ObjectId(id), isDeleted: { $ne: true } }, { $set: { status: status, updatedAt: new Date() } }, { returnDocument: 'after' });
        if (!result) {
            res.status(404).json({ success: false, error: 'Order not found or has been deleted' });
            return;
        }
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid order ID'
            });
            return;
        }
        const db = (0, database_1.getDB)();
        const user = req.user;
        const order = await db.collection('orders').findOne({
            _id: new mongodb_1.ObjectId(id),
            isDeleted: { $ne: true }
        });
        if (!order) {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
            return;
        }
        await db.collection('orders').updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedByUserId: user._id.toString(),
                deletedByName: user.fullName || user.name,
                updatedAt: new Date()
            }
        });
        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteOrder = deleteOrder;
