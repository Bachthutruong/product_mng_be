"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerCategory = exports.updateCustomerCategory = exports.createCustomerCategory = exports.getCustomerCategories = void 0;
const database_1 = require("../config/database");
const mongodb_1 = require("mongodb");
const CustomerCategory_1 = require("../models/CustomerCategory");
const getCustomerCategories = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const collectionName = 'customer_categories';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
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
    }
    catch (error) {
        console.error('[CustomerCategories] Error fetching categories:', error);
        next(error);
    }
};
exports.getCustomerCategories = getCustomerCategories;
const createCustomerCategory = async (req, res, next) => {
    try {
        const validation = CustomerCategory_1.CreateCustomerCategorySchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ success: false, error: 'Invalid input data', details: validation.error.errors });
            return;
        }
        const { name, description, code } = validation.data;
        const db = (0, database_1.getDB)();
        const categoryCode = code || name.toUpperCase().replace(/\s+/g, '_');
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
    }
    catch (error) {
        next(error);
    }
};
exports.createCustomerCategory = createCustomerCategory;
const updateCustomerCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid category ID' });
            return;
        }
        const validation = CustomerCategory_1.UpdateCustomerCategorySchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ success: false, error: 'Invalid input data', details: validation.error.errors });
            return;
        }
        const updateData = validation.data;
        const db = (0, database_1.getDB)();
        const result = await db.collection('customer_categories').findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { ...updateData, updatedAt: new Date() } }, { returnDocument: 'after' });
        if (!result) {
            res.status(404).json({ success: false, error: 'Category not found' });
            return;
        }
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCustomerCategory = updateCustomerCategory;
const deleteCustomerCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid category ID' });
            return;
        }
        const db = (0, database_1.getDB)();
        const customerCount = await db.collection('customers').countDocuments({ categoryId: id });
        if (customerCount > 0) {
            res.status(400).json({ success: false, error: 'Cannot delete category that is currently in use by customers.' });
            return;
        }
        const result = await db.collection('customer_categories').deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            res.status(404).json({ success: false, error: 'Category not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCustomerCategory = deleteCustomerCategory;
