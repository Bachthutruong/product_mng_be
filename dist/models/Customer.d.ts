import { z } from 'zod';
export declare const CustomerSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodAny>;
    name: z.ZodString;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    categoryId: z.ZodString;
    categoryName: z.ZodOptional<z.ZodString>;
    customerCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    categoryId: string;
    _id?: any;
    email?: string | null | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    notes?: string | null | undefined;
    categoryName?: string | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    customerCode?: string | null | undefined;
}, {
    name: string;
    categoryId: string;
    _id?: any;
    email?: string | null | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    notes?: string | null | undefined;
    categoryName?: string | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    customerCode?: string | null | undefined;
}>;
export type Customer = z.infer<typeof CustomerSchema> & {
    _id: string;
};
export declare const CreateCustomerSchema: z.ZodObject<{
    name: z.ZodString;
} & {
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    address: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    customerCode: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    notes: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    categoryId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    categoryId: string;
    email?: string | undefined;
    notes?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    customerCode?: string | undefined;
}, {
    name: string;
    categoryId: string;
    email?: string | undefined;
    notes?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    customerCode?: string | undefined;
}>;
export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export declare const UpdateCustomerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    phone: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    address: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    customerCode: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    notes: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    categoryId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    notes?: string | undefined;
    categoryId?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    customerCode?: string | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    notes?: string | undefined;
    categoryId?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    customerCode?: string | undefined;
}>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>;
