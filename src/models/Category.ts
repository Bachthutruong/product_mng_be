import { z } from 'zod';

export const CategorySchema = z.object({
    _id: z.any().optional(), // MongoDB ObjectId will be here, handled by the database
    name: z.string().min(1, { message: "分類名稱是必需的" }),
    description: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

// Type for use in application, _id is string after parsing from DB
export type Category = z.infer<typeof CategorySchema> & { _id: string };

// Schema for validating form input when creating/updating a category
export const CreateCategorySchema = CategorySchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
});
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>; 