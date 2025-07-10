"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerCategorySchema = exports.CreateCustomerCategorySchema = exports.CustomerCategorySchema = void 0;
const zod_1 = require("zod");
exports.CustomerCategorySchema = zod_1.z.object({
    _id: zod_1.z.any().optional(),
    name: zod_1.z.string().min(1, "分類名稱是必需的"),
    code: zod_1.z.string().min(1, "分類代碼是必需的").regex(/^[A-Z_]+$/, "分類代碼只能包含大寫字母和底線"),
    description: zod_1.z.string().optional().nullable(),
    isActive: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.CreateCustomerCategorySchema = exports.CustomerCategorySchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
    code: true
}).extend({
    description: zod_1.z.string().optional().nullable().or(zod_1.z.literal('')),
    code: zod_1.z.string().optional(),
});
exports.UpdateCustomerCategorySchema = exports.CreateCustomerCategorySchema.partial();
