"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductSchema = exports.ProductBatchSchema = exports.StockInEntrySchema = exports.PriceHistoryEntrySchema = exports.ProductImageSchema = void 0;
const zod_1 = require("zod");
exports.ProductImageSchema = zod_1.z.object({
    url: zod_1.z.string().url({ message: "無效的圖片 URL" }),
    publicId: zod_1.z.string(),
    isPrimary: zod_1.z.boolean().optional().default(false),
});
exports.PriceHistoryEntrySchema = zod_1.z.object({
    price: zod_1.z.number(),
    changedAt: zod_1.z.date(),
    changedBy: zod_1.z.string(),
});
exports.StockInEntrySchema = zod_1.z.object({
    quantityAdded: zod_1.z.number().int().positive(),
    batchExpiryDate: zod_1.z.date().optional().nullable(),
    stockedAt: zod_1.z.date(),
    stockedByUserId: zod_1.z.string(),
    supplier: zod_1.z.string().optional(),
    costAtTime: zod_1.z.number().optional(),
});
exports.ProductBatchSchema = zod_1.z.object({
    batchId: zod_1.z.string(),
    expiryDate: zod_1.z.date(),
    initialQuantity: zod_1.z.number().int().positive(),
    remainingQuantity: zod_1.z.number().int().min(0),
    costPerUnit: zod_1.z.number().min(0).optional(),
    createdAt: zod_1.z.date(),
    supplier: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.ProductSchema = zod_1.z.object({
    _id: zod_1.z.any().optional(),
    name: zod_1.z.string().min(1, { message: "產品名稱是必需的" }),
    sku: zod_1.z.string().min(1, { message: "SKU 是必需的" }).optional(),
    categoryId: zod_1.z.string().optional(),
    categoryName: zod_1.z.string().optional(),
    unit: zod_1.z.string().optional(),
    price: zod_1.z.coerce.number().min(0, { message: "價格必須是非負數" }),
    cost: zod_1.z.coerce.number().min(0, { message: "成本必須是非負數" }).optional().default(0),
    stock: zod_1.z.coerce.number().int({ message: "庫存必須是整數" }).min(0, { message: "庫存必須是非負數" }),
    description: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.object({
        url: zod_1.z.string(),
        publicId: zod_1.z.string(),
        isPrimary: zod_1.z.boolean().default(false),
    })).optional(),
    expiryDate: zod_1.z.coerce.date({ message: "到期日期是必需的" }),
    lowStockThreshold: zod_1.z.coerce.number().int().min(0).optional().default(0),
    discontinued: zod_1.z.boolean().optional().default(false),
    priceHistory: zod_1.z.array(exports.PriceHistoryEntrySchema).optional().default([]),
    stockInHistory: zod_1.z.array(exports.StockInEntrySchema).optional().default([]),
    batches: zod_1.z.array(exports.ProductBatchSchema).optional().default([]),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.CreateProductSchema = exports.ProductSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
    priceHistory: true,
    stockInHistory: true,
    batches: true,
});
exports.UpdateProductSchema = exports.CreateProductSchema.partial();
