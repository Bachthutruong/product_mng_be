import { z } from 'zod';

export const UserRoleSchema = z.enum(['admin', 'employee']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  _id: z.any().optional(), // MongoDB ObjectId will be here
  name: z.string().min(1, { message: "姓名是必需的" }),
  email: z.string().email({ message: "無效的電子郵件地址" }),
  password: z.string(), // Required for creation, optional for fetching
  role: UserRoleSchema.default('employee'),
  fullName: z.string().min(1, { message: "全名是必需的" }), // Adding fullName for consistency
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schema for creating a new user (e.g., by an admin)
export const CreateUserSchema = z.object({
  name: z.string().min(1, { message: "姓名是必需的" }),
  email: z.string().email({ message: "無效的電子郵件地址" }),
  password: z.string().min(6, { message: "密碼長度必須至少為 6 個字元" }),
  role: UserRoleSchema.default('employee'),
  fullName: z.string().min(1, { message: "全名是必需的" }),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Schema for login - using email
export const LoginUserInputSchema = z.object({
  email: z.string().email({ message: "請輸入有效的電子郵件" }),
  password: z.string().min(1, { message: "密碼是必需的" }),
});
export type LoginUserInput = z.infer<typeof LoginUserInputSchema>;

// Full User type including MongoDB _id as string
export type User = z.infer<typeof UserSchema> & { _id: string };

// User type for client-side context (omits password)
export type AuthUser = Omit<User, 'password'>;

// Schema for updating user profile
export const UpdateUserProfileSchema = z.object({
  name: z.string().min(1, { message: "姓名是必需的" }).optional(),
  email: z.string().email({ message: "無效的電子郵件地址" }).optional(),
  fullName: z.string().min(1, { message: "全名是必需的" }).optional(),
});
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>; 