"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfileSchema = exports.LoginUserInputSchema = exports.CreateUserSchema = exports.UserSchema = exports.UserRoleSchema = void 0;
const zod_1 = require("zod");
exports.UserRoleSchema = zod_1.z.enum(['admin', 'employee']);
exports.UserSchema = zod_1.z.object({
    _id: zod_1.z.any().optional(),
    name: zod_1.z.string().min(1, { message: "姓名是必需的" }),
    email: zod_1.z.string().email({ message: "無效的電子郵件地址" }),
    password: zod_1.z.string(),
    role: exports.UserRoleSchema.default('employee'),
    fullName: zod_1.z.string().min(1, { message: "全名是必需的" }),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "姓名是必需的" }),
    email: zod_1.z.string().email({ message: "無效的電子郵件地址" }),
    password: zod_1.z.string().min(6, { message: "密碼長度必須至少為 6 個字元" }),
    role: exports.UserRoleSchema.default('employee'),
    fullName: zod_1.z.string().min(1, { message: "全名是必需的" }),
});
exports.LoginUserInputSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "請輸入有效的電子郵件" }),
    password: zod_1.z.string().min(1, { message: "密碼是必需的" }),
});
exports.UpdateUserProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "姓名是必需的" }).optional(),
    email: zod_1.z.string().email({ message: "無效的電子郵件地址" }).optional(),
    fullName: zod_1.z.string().min(1, { message: "全名是必需的" }).optional(),
});
