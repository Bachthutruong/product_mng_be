"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPrimaryProductImage = exports.deleteProductImage = exports.deleteProductCategory = exports.updateProductCategory = exports.createProductCategory = exports.getProductCategories = exports.uploadProductImages = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const database_1 = require("../config/database");
const mongodb_1 = require("mongodb");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const Product_1 = require("../models/Product");
const getProducts = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const { page = '1', limit = '10', search = '', categoryId = '', stockStatus = 'all' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (categoryId && categoryId !== 'all') {
            filter.categoryId = categoryId;
        }
        if (stockStatus === 'low') {
            filter.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
        }
        else if (stockStatus === 'out-of-stock') {
            filter.stock = 0;
        }
        const products = await db.collection('products')
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .toArray();
        const totalCount = await db.collection('products').countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limitNum);
        res.status(200).json({
            success: true,
            data: products,
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
exports.getProducts = getProducts;
const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid product ID' });
            return;
        }
        const db = (0, database_1.getDB)();
        const product = await db.collection('products').findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!product) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        const category = await db.collection('categories').findOne({ _id: new mongodb_1.ObjectId(product.categoryId) });
        const inventoryMovements = await db.collection('inventory_movements').find({ productId: id }).sort({ createdAt: -1 }).toArray();
        const data = {
            ...product,
            categoryName: category?.name || 'N/A',
            inventoryMovements,
            batches: product.batches || [],
        };
        res.status(200).json({
            success: true,
            data: data
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProduct = getProduct;
const createProduct = async (req, res, next) => {
    try {
        const validation = Product_1.CreateProductSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                error: 'Invalid input data',
                details: validation.error.errors
            });
            return;
        }
        const productData = validation.data;
        const user = req.user;
        const db = (0, database_1.getDB)();
        let categoryName = '';
        if (productData.categoryId) {
            const category = await db.collection('categories').findOne({ _id: new mongodb_1.ObjectId(productData.categoryId) });
            if (category) {
                categoryName = category.name;
            }
        }
        if (productData.sku) {
            const existingProduct = await db.collection('products').findOne({ sku: productData.sku });
            if (existingProduct) {
                res.status(400).json({
                    success: false,
                    error: 'SKU already exists'
                });
                return;
            }
        }
        const newProduct = {
            ...productData,
            categoryName,
            createdAt: new Date(),
            updatedAt: new Date(),
            priceHistory: [{
                    price: productData.price,
                    changedAt: new Date(),
                    changedBy: user._id.toString()
                }],
            stockInHistory: [],
            batches: []
        };
        const result = await db.collection('products').insertOne(newProduct);
        const createdProduct = await db.collection('products').findOne({ _id: result.insertedId });
        res.status(201).json({
            success: true,
            data: createdProduct
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid product ID' });
            return;
        }
        let updateData = req.body;
        if (req.user?.role !== 'admin') {
            const { price, cost, stock, categoryId, ...allowedUpdates } = updateData;
            if (price !== undefined || cost !== undefined || stock !== undefined || categoryId !== undefined) {
                res.status(403).json({ success: false, error: 'You are not authorized to update price, cost, stock, or category.' });
                return;
            }
            updateData = allowedUpdates;
        }
        const validation = Product_1.UpdateProductSchema.safeParse(updateData);
        if (!validation.success) {
            res.status(400).json({ success: false, error: 'Invalid data', details: validation.error.errors });
            return;
        }
        const validatedData = validation.data;
        if (Object.keys(validatedData).length === 0) {
            res.status(400).json({ success: false, error: 'No valid fields to update' });
            return;
        }
        const result = await db.collection('products').findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { ...validatedData, updatedAt: new Date() } }, { returnDocument: 'after' });
        if (!result) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid product ID'
            });
            return;
        }
        const db = (0, database_1.getDB)();
        const product = await db.collection('products').findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!product) {
            res.status(404).json({
                success: false,
                error: 'Product not found'
            });
            return;
        }
        const ordersWithProduct = await db.collection('orders').findOne({
            'items.productId': id,
            isDeleted: { $ne: true }
        });
        if (ordersWithProduct) {
            res.status(400).json({
                success: false,
                error: 'Cannot delete product that is referenced in orders'
            });
            return;
        }
        await db.collection('products').deleteOne({ _id: new mongodb_1.ObjectId(id) });
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
const uploadProductImages = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid product ID' });
            return;
        }
        const db = (0, database_1.getDB)();
        const product = await db.collection('products').findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!product) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        if (!req.files || req.files.length === 0) {
            res.status(400).json({ success: false, error: 'Please upload at least one image.' });
            return;
        }
        const files = req.files;
        const uploadedImages = [];
        for (const file of files) {
            const b64 = Buffer.from(file.buffer).toString("base64");
            const dataURI = "data:" + file.mimetype + ";base64," + b64;
            const result = await cloudinary_1.default.uploader.upload(dataURI, {
                folder: process.env.CLOUDINARY_FOLDER || 'stockpilot_products',
            });
            uploadedImages.push({
                url: result.secure_url,
                publicId: result.public_id,
                isPrimary: false,
            });
        }
        const hasPrimaryImage = product.images?.some((img) => img.isPrimary);
        if (!hasPrimaryImage && uploadedImages.length > 0) {
            uploadedImages[0].isPrimary = true;
        }
        await db.collection('products').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $push: { images: { $each: uploadedImages } }, $set: { updatedAt: new Date() } });
        const updatedProduct = await db.collection('products').findOne({ _id: new mongodb_1.ObjectId(id) });
        res.status(200).json({ success: true, data: updatedProduct });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadProductImages = uploadProductImages;
const getProductCategories = async (req, res, next) => {
    try {
        const { search = '' } = req.query;
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        const db = (0, database_1.getDB)();
        const categories = await db.collection('categories')
            .find(filter)
            .sort({ createdAt: -1 })
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
exports.getProductCategories = getProductCategories;
const createProductCategory = async (req, res, next) => {
    try {
        const db = (0, database_1.getDB)();
        const newCategory = {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await db.collection('categories').insertOne(newCategory);
        const createdCategory = await db.collection('categories').findOne({ _id: result.insertedId });
        res.status(201).json({ success: true, data: createdCategory });
    }
    catch (error) {
        next(error);
    }
};
exports.createProductCategory = createProductCategory;
const updateProductCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid category ID' });
            return;
        }
        const db = (0, database_1.getDB)();
        const updatedData = { ...req.body, updatedAt: new Date() };
        const result = await db.collection('categories').findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updatedData }, { returnDocument: 'after' });
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
exports.updateProductCategory = updateProductCategory;
const deleteProductCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: 'Invalid category ID' });
            return;
        }
        const db = (0, database_1.getDB)();
        const result = await db.collection('categories').deleteOne({ _id: new mongodb_1.ObjectId(id) });
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
exports.deleteProductCategory = deleteProductCategory;
const deleteProductImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const imageId = decodeURIComponent(req.params.imageId);
        const db = (0, database_1.getDB)();
        const product = await db.collection('products').findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!product) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        await cloudinary_1.default.uploader.destroy(imageId);
        await db.collection('products').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $pull: { images: { publicId: imageId } } });
        res.status(200).json({ success: true, message: 'Image deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProductImage = deleteProductImage;
const setPrimaryProductImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const imageId = decodeURIComponent(req.params.imageId);
        const db = (0, database_1.getDB)();
        await db.collection('products').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { "images.$[].isPrimary": false } });
        await db.collection('products').updateOne({ _id: new mongodb_1.ObjectId(id), "images.publicId": imageId }, { $set: { "images.$.isPrimary": true } });
        res.status(200).json({ success: true, message: 'Primary image set' });
    }
    catch (error) {
        next(error);
    }
};
exports.setPrimaryProductImage = setPrimaryProductImage;
