"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategorySchema = exports.CreateCategorySchema = exports.CategorySchema = void 0;
const zod_1 = require("zod");
exports.CategorySchema = zod_1.z.object({
    _id: zod_1.z.any().optional(),
    name: zod_1.z.string().min(1, { message: "分類名稱是必需的" }),
    description: zod_1.z.string().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.CreateCategorySchema = exports.CategorySchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
});
exports.UpdateCategorySchema = exports.CreateCategorySchema.partial();
