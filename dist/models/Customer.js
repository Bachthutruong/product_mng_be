"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerSchema = exports.CreateCustomerSchema = exports.CustomerSchema = void 0;
const zod_1 = require("zod");
exports.CustomerSchema = zod_1.z.object({
    _id: zod_1.z.any().optional(),
    name: zod_1.z.string().min(1, "客戶名稱是必需的"),
    email: zod_1.z.string().email("無效的電子郵件地址").nullable().optional(),
    phone: zod_1.z.string().nullable().optional(),
    address: zod_1.z.string().nullable().optional(),
    categoryId: zod_1.z.string().min(1, "客戶分類是必需的"),
    categoryName: zod_1.z.string().optional(),
    customerCode: zod_1.z.string().nullable().optional(),
    notes: zod_1.z.string().nullable().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.CreateCustomerSchema = exports.CustomerSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
    categoryName: true
}).extend({
    email: zod_1.z.string().email("無效的電子郵件地址").optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().optional().or(zod_1.z.literal('')),
    address: zod_1.z.string().optional().or(zod_1.z.literal('')),
    customerCode: zod_1.z.string().optional().or(zod_1.z.literal('')),
    notes: zod_1.z.string().optional().or(zod_1.z.literal('')),
    categoryId: zod_1.z.string().min(1, "請選擇客戶分類"),
});
exports.UpdateCustomerSchema = exports.CreateCustomerSchema.partial();
