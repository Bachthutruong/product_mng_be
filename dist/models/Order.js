"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllOrderStatusOptions = exports.UpdateOrderStatusSchema = exports.UpdateOrderSchema = exports.CreateOrderSchema = exports.OrderSchema = exports.OrderStatusSchema = exports.DiscountTypeSchema = exports.OrderLineItemSchema = exports.OrderBatchUsageSchema = void 0;
const zod_1 = require("zod");
exports.OrderBatchUsageSchema = zod_1.z.object({
    batchId: zod_1.z.string(),
    expiryDate: zod_1.z.date(),
    quantityUsed: zod_1.z.number().int().positive(),
});
exports.OrderLineItemSchema = zod_1.z.object({
    _id: zod_1.z.any().optional(),
    productId: zod_1.z.string(),
    productName: zod_1.z.string(),
    productSku: zod_1.z.string().optional(),
    quantity: zod_1.z.coerce.number().int().min(1, "數量必須至少為 1"),
    unitPrice: zod_1.z.coerce.number(),
    cost: zod_1.z.coerce.number().min(0).optional().default(0),
    notes: zod_1.z.string().optional().nullable(),
    batchesUsed: zod_1.z.array(exports.OrderBatchUsageSchema).optional().default([]),
});
exports.DiscountTypeSchema = zod_1.z.enum(['percentage', 'fixed']);
exports.OrderStatusSchema = zod_1.z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed', 'returned']);
exports.OrderSchema = zod_1.z.object({
    _id: zod_1.z.any().optional(),
    orderNumber: zod_1.z.string().min(1, "訂單號碼是必需的").optional(),
    customerId: zod_1.z.string(),
    customerName: zod_1.z.string(),
    items: zod_1.z.array(exports.OrderLineItemSchema).min(1, "訂單必須至少包含一個項目"),
    subtotal: zod_1.z.coerce.number().min(0),
    discountType: exports.DiscountTypeSchema.optional().nullable(),
    discountValue: zod_1.z.coerce.number().min(0).optional().nullable(),
    discountAmount: zod_1.z.coerce.number().min(0).optional().nullable().default(0),
    shippingFee: zod_1.z.coerce.number().min(0).optional().nullable().default(0),
    totalAmount: zod_1.z.coerce.number().min(0),
    status: exports.OrderStatusSchema.default('pending'),
    orderDate: zod_1.z.date().default(() => new Date()),
    notes: zod_1.z.string().optional().nullable(),
    createdByUserId: zod_1.z.string(),
    createdByName: zod_1.z.string(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
    costOfGoodsSold: zod_1.z.coerce.number().min(0).optional().nullable(),
    profit: zod_1.z.coerce.number().optional().nullable(),
    isDeleted: zod_1.z.boolean().optional().default(false),
    deletedAt: zod_1.z.date().optional().nullable(),
    deletedByUserId: zod_1.z.string().optional().nullable(),
    deletedByName: zod_1.z.string().optional().nullable(),
});
exports.CreateOrderSchema = zod_1.z.object({
    customerId: zod_1.z.string().min(1, "客戶是必需的"),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().min(1, "產品是必需的"),
        quantity: zod_1.z.coerce.number().int().min(1, "數量必須至少為 1"),
        unitPrice: zod_1.z.coerce.number(),
        productName: zod_1.z.string(),
        productSku: zod_1.z.string().optional(),
        cost: zod_1.z.coerce.number().optional().default(0),
        notes: zod_1.z.string().optional().nullable(),
    })).min(1, "訂單必須至少包含一個項目。"),
    discountType: exports.DiscountTypeSchema.optional().nullable(),
    discountValue: zod_1.z.coerce.number().min(0).optional().nullable(),
    shippingFee: zod_1.z.coerce.number().min(0).optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
});
exports.UpdateOrderSchema = zod_1.z.object({
    status: exports.OrderStatusSchema.optional(),
    notes: zod_1.z.string().optional().nullable(),
    discountType: exports.DiscountTypeSchema.optional().nullable(),
    discountValue: zod_1.z.coerce.number().min(0).optional().nullable(),
    shippingFee: zod_1.z.coerce.number().min(0).optional().nullable(),
});
exports.UpdateOrderStatusSchema = zod_1.z.object({
    status: exports.OrderStatusSchema,
});
exports.AllOrderStatusOptions = exports.OrderStatusSchema.options;
