import { z } from 'zod';
export declare const CustomerCategorySchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodAny>;
    name: z.ZodString;
    code: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    isActive: boolean;
    _id?: any;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    description?: string | null | undefined;
}, {
    code: string;
    name: string;
    _id?: any;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
}>;
export type CustomerCategory = z.infer<typeof CustomerCategorySchema> & {
    _id: string;
};
export declare const CreateCustomerCategorySchema: z.ZodObject<{
    name: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
} & {
    description: z.ZodUnion<[z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodLiteral<"">]>;
    code: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive: boolean;
    code?: string | undefined;
    description?: string | null | undefined;
}, {
    name: string;
    code?: string | undefined;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
}>;
export type CreateCustomerCategoryInput = z.infer<typeof CreateCustomerCategorySchema>;
export declare const UpdateCustomerCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    description: z.ZodOptional<z.ZodUnion<[z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodLiteral<"">]>>;
    code: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
}, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
}>;
export type UpdateCustomerCategoryInput = z.infer<typeof UpdateCustomerCategorySchema>;
