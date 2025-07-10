import { z } from 'zod';
export declare const UserRoleSchema: z.ZodEnum<["admin", "employee"]>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export declare const UserSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodAny>;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["admin", "employee"]>>;
    fullName: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: "admin" | "employee";
    fullName: string;
    _id?: any;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    name: string;
    email: string;
    password: string;
    fullName: string;
    _id?: any;
    role?: "admin" | "employee" | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
export declare const CreateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["admin", "employee"]>>;
    fullName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: "admin" | "employee";
    fullName: string;
}, {
    name: string;
    email: string;
    password: string;
    fullName: string;
    role?: "admin" | "employee" | undefined;
}>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export declare const LoginUserInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginUserInput = z.infer<typeof LoginUserInputSchema>;
export type User = z.infer<typeof UserSchema> & {
    _id: string;
};
export type AuthUser = Omit<User, 'password'>;
export declare const UpdateUserProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    fullName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    fullName?: string | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    fullName?: string | undefined;
}>;
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
