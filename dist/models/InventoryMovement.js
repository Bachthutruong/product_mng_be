"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordStockAdjustmentSchema = exports.RecordStockInSchema = exports.InventoryMovementSchema = exports.InventoryMovementTypeSchema = void 0;
const zod_1 = require("zod");
exports.InventoryMovementTypeSchema = zod_1.z.enum(['stock-in', 'stock-out', 'adjustment-add', 'adjustment-remove', 'sale']);
exports.InventoryMovementSchema = zod_1.z.object({
    _id: zod_1.z.any().optional(),
    productId: zod_1.z.string(),
    productName: zod_1.z.string(),
    type: exports.InventoryMovementTypeSchema,
    quantity: zod_1.z.number().int(),
    movementDate: zod_1.z.date(),
    userId: zod_1.z.string(),
    userName: zod_1.z.string(),
    batchExpiryDate: zod_1.z.date().optional().nullable(),
    relatedOrderId: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    stockBefore: zod_1.z.number().int(),
    stockAfter: zod_1.z.number().int(),
    isReverted: zod_1.z.boolean().optional().default(false),
    revertedFromId: zod_1.z.string().optional().nullable(),
});
exports.RecordStockInSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "產品選擇是必需的"),
    quantity: zod_1.z.coerce.number().int().min(1, "數量必須至少為 1"),
    batchExpiryDate: zod_1.z.coerce.date().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
});
exports.RecordStockAdjustmentSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "產品選擇是必需的"),
    quantityChange: zod_1.z.coerce.number().int().refine(val => val !== 0, "數量變更不能為零"),
    reason: zod_1.z.string().min(1, "原因說明是必需的"),
    notes: zod_1.z.string().optional().nullable(),
});
