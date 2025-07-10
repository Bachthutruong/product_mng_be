"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revertInventoryMovement = exports.recordStockAdjustment = exports.recordStockIn = exports.getInventoryMovements = void 0;
const database_1 = require("../config/database");
const mongodb_1 = require("mongodb");
const InventoryMovement_1 = require("../models/InventoryMovement");
const getInventoryMovements = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const { page = '1', limit = '20', productId = '', type = '', search = '', startDate = '', endDate = '' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const filter = {};
        if (productId)
            filter.productId = productId;
        if (type)
            filter.type = type;
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            filter.$or = [
                { productName: searchRegex },
                { userName: searchRegex },
                { notes: searchRegex },
                { type: searchRegex },
            ];
        }
        if (startDate || endDate) {
            filter.movementDate = {};
            if (startDate)
                filter.movementDate.$gte = new Date(startDate);
            if (endDate)
                filter.movementDate.$lte = new Date(endDate);
        }
        const movementsData = await db.collection('inventoryMovements')
            .find(filter)
            .sort({ movementDate: -1 })
            .skip(skip)
            .limit(limitNum)
            .toArray();
        const movements = movementsData.map(m => ({
            ...m,
            isRevertible: m.type !== 'stock-out' && m.type !== 'sale' && !m.isReverted,
        }));
        const totalCount = await db.collection('inventoryMovements').countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limitNum);
        res.status(200).json({
            success: true,
            data: movements,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems: totalCount,
                itemsPerPage: limitNum
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getInventoryMovements = getInventoryMovements;
const recordStockIn = async (req, res, next) => {
    try {
        const validation = InventoryMovement_1.RecordStockInSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ success: false, error: 'Invalid input', details: validation.error.errors });
            return;
        }
        const { productId, quantity, batchExpiryDate, notes } = validation.data;
        const user = req.user;
        const db = (0, database_1.getDB)();
        const product = await db.collection('products').findOne({ _id: new mongodb_1.ObjectId(productId) });
        if (!product) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        const stockBefore = product.stock;
        const stockAfter = stockBefore + quantity;
        await db.collection('products').updateOne({ _id: new mongodb_1.ObjectId(productId) }, { $set: { stock: stockAfter, updatedAt: new Date() } });
        const movement = {
            productId,
            productName: product.name,
            type: 'stock-in',
            quantity,
            movementDate: new Date(),
            userId: user._id.toString(),
            userName: user.fullName || user.name,
            batchExpiryDate,
            notes,
            stockBefore,
            stockAfter,
        };
        await db.collection('inventoryMovements').insertOne(movement);
        res.status(201).json({ success: true, data: movement });
    }
    catch (error) {
        next(error);
    }
};
exports.recordStockIn = recordStockIn;
const recordStockAdjustment = async (req, res, next) => {
    try {
        const validation = InventoryMovement_1.RecordStockAdjustmentSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ success: false, error: 'Invalid input', details: validation.error.errors });
            return;
        }
        const { productId, quantityChange, reason, notes } = validation.data;
        const user = req.user;
        const db = (0, database_1.getDB)();
        const product = await db.collection('products').findOne({ _id: new mongodb_1.ObjectId(productId) });
        if (!product) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        const stockBefore = product.stock;
        const stockAfter = stockBefore + quantityChange;
        if (stockAfter < 0) {
            res.status(400).json({ success: false, error: 'Adjustment would result in negative stock.' });
            return;
        }
        await db.collection('products').updateOne({ _id: new mongodb_1.ObjectId(productId) }, { $set: { stock: stockAfter, updatedAt: new Date() } });
        const movementType = quantityChange > 0 ? 'adjustment-add' : 'adjustment-remove';
        const movement = {
            productId,
            productName: product.name,
            type: movementType,
            quantity: quantityChange,
            movementDate: new Date(),
            userId: user._id.toString(),
            userName: user.fullName || user.name,
            notes: `Reason: ${reason}. ${notes || ''}`.trim(),
            stockBefore,
            stockAfter,
        };
        await db.collection('inventoryMovements').insertOne(movement);
        res.status(201).json({ success: true, data: movement });
    }
    catch (error) {
        next(error);
    }
};
exports.recordStockAdjustment = recordStockAdjustment;
const revertInventoryMovement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const db = (0, database_1.getDB)();
        const originalMovement = await db.collection('inventoryMovements').findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!originalMovement) {
            res.status(404).json({ success: false, error: 'Inventory movement not found' });
            return;
        }
        if (originalMovement.isReverted) {
            res.status(400).json({ success: false, error: 'Movement has already been reverted' });
            return;
        }
        if (originalMovement.type === 'stock-out' || originalMovement.type === 'sale') {
            res.status(400).json({ success: false, error: 'Sale-related movements cannot be reverted from here' });
            return;
        }
        const product = await db.collection('products').findOne({ _id: new mongodb_1.ObjectId(originalMovement.productId) });
        if (!product) {
            res.status(404).json({ success: false, error: 'Associated product not found' });
            return;
        }
        const stockBefore = product.stock;
        const reversingQuantity = -originalMovement.quantity;
        const stockAfter = stockBefore + reversingQuantity;
        const revertMovement = {
            productId: originalMovement.productId,
            productName: originalMovement.productName,
            type: 'adjustment-remove',
            quantity: reversingQuantity,
            movementDate: new Date(),
            userId: user._id.toString(),
            userName: user.fullName || user.name,
            notes: `Reverted movement ID: ${id}`,
            stockBefore,
            stockAfter,
            isReverted: false,
            revertedFromId: id,
        };
        await db.collection('inventoryMovements').insertOne(revertMovement);
        await db.collection('products').updateOne({ _id: new mongodb_1.ObjectId(originalMovement.productId) }, { $set: { stock: stockAfter, updatedAt: new Date() } });
        await db.collection('inventoryMovements').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { isReverted: true } });
        res.status(200).json({ success: true, message: 'Movement reverted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.revertInventoryMovement = revertInventoryMovement;
