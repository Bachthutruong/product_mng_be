import { z } from 'zod';
export declare const CategorySchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodAny>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    _id?: any;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    description?: string | undefined;
}, {
    name: string;
    _id?: any;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    description?: string | undefined;
}>;
export type Category = z.infer<typeof CategorySchema> & {
    _id: string;
};
export declare const CreateCategorySchema: z.ZodObject<Omit<{
    _id: z.ZodOptional<z.ZodAny>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "_id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export declare const UpdateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
}>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
