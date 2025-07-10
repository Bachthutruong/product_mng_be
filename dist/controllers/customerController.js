"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerCategories = exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomer = exports.getCustomers = void 0;
const database_1 = require("../config/database");
const mongodb_1 = require("mongodb");
const Customer_1 = require("../models/Customer");
const getCustomers = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const { page = '1', limit = '10', search = '', categoryId = '' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const filter = {};
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
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomers = getCustomers;
const getCustomer = async (req, res) => {
    try {
        const db = (0, database_1.getDB)();
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid customer ID' });
        }
        const customer = await db.collection('customers').findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!customer) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }
        return res.status(200).json({ success: true, data: customer });
    }
    catch (error) {
        console.error('Error fetching customer:', error);
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};
exports.getCustomer = getCustomer;
const createCustomer = async (req, res, next) => {
    try {
        const validation = Customer_1.CreateCustomerSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                error: 'Invalid input data',
                details: validation.error.errors
            });
            return;
        }
        const customerData = validation.data;
        const db = (0, database_1.getDB)();
        const category = await db.collection('customer_categories').findOne({ _id: new mongodb_1.ObjectId(customerData.categoryId) });
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
    }
    catch (error) {
        next(error);
    }
};
exports.createCustomer = createCustomer;
const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid customer ID' });
            return;
        }
        const validation = Customer_1.UpdateCustomerSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ success: false, error: 'Invalid input data', details: validation.error.errors });
            return;
        }
        const customerData = validation.data;
        const db = (0, database_1.getDB)();
        const updateFields = { ...customerData, updatedAt: new Date() };
        if (customerData.categoryId) {
            const category = await db.collection('customer_categories').findOne({ _id: new mongodb_1.ObjectId(customerData.categoryId) });
            if (category) {
                updateFields.categoryName = category.name;
            }
        }
        const result = await db.collection('customers').findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateFields }, { returnDocument: 'after' });
        if (!result) {
            res.status(404).json({ success: false, error: 'Customer not found' });
            return;
        }
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid customer ID' });
            return;
        }
        const db = (0, database_1.getDB)();
        const orderCount = await db.collection('orders').countDocuments({ customerId: id, isDeleted: { $ne: true } });
        if (orderCount > 0) {
            res.status(400).json({ success: false, error: 'Cannot delete customer with active orders. Please reassign or delete orders first.' });
            return;
        }
        const result = await db.collection('customers').deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            res.status(404).json({ success: false, error: 'Customer not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCustomer = deleteCustomer;
const getCustomerCategories = async (_req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const categories = await db.collection('customerCategories')
            .find({ isActive: true })
            .sort({ name: 1 })
            .toArray();
        res.status(200).json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerCategories = getCustomerCategories;
