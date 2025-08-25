"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreOrder = exports.getDeletedOrders = exports.deleteUser = exports.updateUser = exports.addUser = exports.getUsers = void 0;
const database_1 = require("../config/database");
const mongodb_1 = require("mongodb");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsers = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const { search = '' } = req.query;
        let query = {};
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
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const addUser = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
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
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
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
            const createdUser = await db.collection('users').findOne({ _id: result.insertedId }, { projection: { password: 0 } });
            res.status(201).json({ success: true, data: createdUser });
        }
        else {
            throw new Error('User creation failed.');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.addUser = addUser;
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid user ID' });
            return;
        }
        if (!name || !email || !role) {
            res.status(400).json({ success: false, error: 'Please provide all required fields' });
            return;
        }
        if (!['admin', 'employee'].includes(role)) {
            res.status(400).json({ success: false, error: 'Invalid role' });
            return;
        }
        const db = (0, database_1.getDB)();
        const existingUser = await db.collection('users').findOne({
            email,
            _id: { $ne: new mongodb_1.ObjectId(id) }
        });
        if (existingUser) {
            res.status(400).json({ success: false, error: 'Email already exists' });
            return;
        }
        const result = await db.collection('users').findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { name, email, role, updatedAt: new Date() } }, { returnDocument: 'after', projection: { password: 0 } });
        if (!result) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid user ID' });
            return;
        }
        if (req.user._id.toString() === id) {
            res.status(400).json({ success: false, error: 'You cannot delete your own account.' });
            return;
        }
        const result = await db.collection('users').deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
const getDeletedOrders = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const { page = '1', limit = '10', search = '', status = '', startDate = '', endDate = '' } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const filter = { isDeleted: true };
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
                filter.deletedAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.deletedAt.$lte = new Date(endDate);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getDeletedOrders = getDeletedOrders;
const restoreOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = (0, database_1.getDB)();
        await db.collection('orders').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { isDeleted: false, updatedAt: new Date() }, $unset: { deletedAt: "", deletedByUserId: "", deletedByName: "" } });
        res.status(200).json({ success: true, message: 'Order restored' });
    }
    catch (error) {
        next(error);
    }
};
exports.restoreOrder = restoreOrder;
