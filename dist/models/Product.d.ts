import { z } from 'zod';
export declare const ProductImageSchema: z.ZodObject<{
    url: z.ZodString;
    publicId: z.ZodString;
    isPrimary: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    url: string;
    publicId: string;
    isPrimary: boolean;
}, {
    url: string;
    publicId: string;
    isPrimary?: boolean | undefined;
}>;
export type ProductImage = z.infer<typeof ProductImageSchema>;
export declare const PriceHistoryEntrySchema: z.ZodObject<{
    price: z.ZodNumber;
    changedAt: z.ZodDate;
    changedBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    price: number;
    changedAt: Date;
    changedBy: string;
}, {
    price: number;
    changedAt: Date;
    changedBy: string;
}>;
export type PriceHistoryEntry = z.infer<typeof PriceHistoryEntrySchema>;
export declare const StockInEntrySchema: z.ZodObject<{
    quantityAdded: z.ZodNumber;
    batchExpiryDate: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    stockedAt: z.ZodDate;
    stockedByUserId: z.ZodString;
    supplier: z.ZodOptional<z.ZodString>;
    costAtTime: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    quantityAdded: number;
    stockedAt: Date;
    stockedByUserId: string;
    batchExpiryDate?: Date | null | undefined;
    supplier?: string | undefined;
    costAtTime?: number | undefined;
}, {
    quantityAdded: number;
    stockedAt: Date;
    stockedByUserId: string;
    batchExpiryDate?: Date | null | undefined;
    supplier?: string | undefined;
    costAtTime?: number | undefined;
}>;
export type StockInEntry = z.infer<typeof StockInEntrySchema>;
export declare const ProductBatchSchema: z.ZodObject<{
    batchId: z.ZodString;
    expiryDate: z.ZodDate;
    initialQuantity: z.ZodNumber;
    remainingQuantity: z.ZodNumber;
    costPerUnit: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodDate;
    supplier: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    createdAt: Date;
    batchId: string;
    expiryDate: Date;
    initialQuantity: number;
    remainingQuantity: number;
    supplier?: string | undefined;
    costPerUnit?: number | undefined;
    notes?: string | undefined;
}, {
    createdAt: Date;
    batchId: string;
    expiryDate: Date;
    initialQuantity: number;
    remainingQuantity: number;
    supplier?: string | undefined;
    costPerUnit?: number | undefined;
    notes?: string | undefined;
}>;
export type ProductBatch = z.infer<typeof ProductBatchSchema>;
export declare const ProductSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodAny>;
    name: z.ZodString;
    sku: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    categoryName: z.ZodOptional<z.ZodString>;
    unit: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    cost: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    stock: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
        isPrimary: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId: string;
        isPrimary: boolean;
    }, {
        url: string;
        publicId: string;
        isPrimary?: boolean | undefined;
    }>, "many">>;
    expiryDate: z.ZodDate;
    lowStockThreshold: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    priceHistory: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        price: z.ZodNumber;
        changedAt: z.ZodDate;
        changedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        price: number;
        changedAt: Date;
        changedBy: string;
    }, {
        price: number;
        changedAt: Date;
        changedBy: string;
    }>, "many">>>;
    stockInHistory: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        quantityAdded: z.ZodNumber;
        batchExpiryDate: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
        stockedAt: z.ZodDate;
        stockedByUserId: z.ZodString;
        supplier: z.ZodOptional<z.ZodString>;
        costAtTime: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        quantityAdded: number;
        stockedAt: Date;
        stockedByUserId: string;
        batchExpiryDate?: Date | null | undefined;
        supplier?: string | undefined;
        costAtTime?: number | undefined;
    }, {
        quantityAdded: number;
        stockedAt: Date;
        stockedByUserId: string;
        batchExpiryDate?: Date | null | undefined;
        supplier?: string | undefined;
        costAtTime?: number | undefined;
    }>, "many">>>;
    batches: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        batchId: z.ZodString;
        expiryDate: z.ZodDate;
        initialQuantity: z.ZodNumber;
        remainingQuantity: z.ZodNumber;
        costPerUnit: z.ZodOptional<z.ZodNumber>;
        createdAt: z.ZodDate;
        supplier: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        createdAt: Date;
        batchId: string;
        expiryDate: Date;
        initialQuantity: number;
        remainingQuantity: number;
        supplier?: string | undefined;
        costPerUnit?: number | undefined;
        notes?: string | undefined;
    }, {
        createdAt: Date;
        batchId: string;
        expiryDate: Date;
        initialQuantity: number;
        remainingQuantity: number;
        supplier?: string | undefined;
        costPerUnit?: number | undefined;
        notes?: string | undefined;
    }>, "many">>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    price: number;
    expiryDate: Date;
    cost: number;
    stock: number;
    lowStockThreshold: number;
    priceHistory: {
        price: number;
        changedAt: Date;
        changedBy: string;
    }[];
    stockInHistory: {
        quantityAdded: number;
        stockedAt: Date;
        stockedByUserId: string;
        batchExpiryDate?: Date | null | undefined;
        supplier?: string | undefined;
        costAtTime?: number | undefined;
    }[];
    batches: {
        createdAt: Date;
        batchId: string;
        expiryDate: Date;
        initialQuantity: number;
        remainingQuantity: number;
        supplier?: string | undefined;
        costPerUnit?: number | undefined;
        notes?: string | undefined;
    }[];
    _id?: any;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    sku?: string | undefined;
    categoryId?: string | undefined;
    categoryName?: string | undefined;
    unit?: string | undefined;
    description?: string | undefined;
    images?: {
        url: string;
        publicId: string;
        isPrimary: boolean;
    }[] | undefined;
}, {
    name: string;
    price: number;
    expiryDate: Date;
    stock: number;
    _id?: any;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    sku?: string | undefined;
    categoryId?: string | undefined;
    categoryName?: string | undefined;
    unit?: string | undefined;
    cost?: number | undefined;
    description?: string | undefined;
    images?: {
        url: string;
        publicId: string;
        isPrimary?: boolean | undefined;
    }[] | undefined;
    lowStockThreshold?: number | undefined;
    priceHistory?: {
        price: number;
        changedAt: Date;
        changedBy: string;
    }[] | undefined;
    stockInHistory?: {
        quantityAdded: number;
        stockedAt: Date;
        stockedByUserId: string;
        batchExpiryDate?: Date | null | undefined;
        supplier?: string | undefined;
        costAtTime?: number | undefined;
    }[] | undefined;
    batches?: {
        createdAt: Date;
        batchId: string;
        expiryDate: Date;
        initialQuantity: number;
        remainingQuantity: number;
        supplier?: string | undefined;
        costPerUnit?: number | undefined;
        notes?: string | undefined;
    }[] | undefined;
}>;
export type Product = z.infer<typeof ProductSchema> & {
    _id: string;
};
export declare const CreateProductSchema: z.ZodObject<Omit<{
    _id: z.ZodOptional<z.ZodAny>;
    name: z.ZodString;
    sku: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    categoryName: z.ZodOptional<z.ZodString>;
    unit: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    cost: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    stock: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
        isPrimary: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId: string;
        isPrimary: boolean;
    }, {
        url: string;
        publicId: string;
        isPrimary?: boolean | undefined;
    }>, "many">>;
    expiryDate: z.ZodDate;
    lowStockThreshold: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    priceHistory: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        price: z.ZodNumber;
        changedAt: z.ZodDate;
        changedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        price: number;
        changedAt: Date;
        changedBy: string;
    }, {
        price: number;
        changedAt: Date;
        changedBy: string;
    }>, "many">>>;
    stockInHistory: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        quantityAdded: z.ZodNumber;
        batchExpiryDate: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
        stockedAt: z.ZodDate;
        stockedByUserId: z.ZodString;
        supplier: z.ZodOptional<z.ZodString>;
        costAtTime: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        quantityAdded: number;
        stockedAt: Date;
        stockedByUserId: string;
        batchExpiryDate?: Date | null | undefined;
        supplier?: string | undefined;
        costAtTime?: number | undefined;
    }, {
        quantityAdded: number;
        stockedAt: Date;
        stockedByUserId: string;
        batchExpiryDate?: Date | null | undefined;
        supplier?: string | undefined;
        costAtTime?: number | undefined;
    }>, "many">>>;
    batches: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        batchId: z.ZodString;
        expiryDate: z.ZodDate;
        initialQuantity: z.ZodNumber;
        remainingQuantity: z.ZodNumber;
        costPerUnit: z.ZodOptional<z.ZodNumber>;
        createdAt: z.ZodDate;
        supplier: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        createdAt: Date;
        batchId: string;
        expiryDate: Date;
        initialQuantity: number;
        remainingQuantity: number;
        supplier?: string | undefined;
        costPerUnit?: number | undefined;
        notes?: string | undefined;
    }, {
        createdAt: Date;
        batchId: string;
        expiryDate: Date;
        initialQuantity: number;
        remainingQuantity: number;
        supplier?: string | undefined;
        costPerUnit?: number | undefined;
        notes?: string | undefined;
    }>, "many">>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "_id" | "createdAt" | "updatedAt" | "priceHistory" | "stockInHistory" | "batches">, "strip", z.ZodTypeAny, {
    name: string;
    price: number;
    expiryDate: Date;
    cost: number;
    stock: number;
    lowStockThreshold: number;
    sku?: string | undefined;
    categoryId?: string | undefined;
    categoryName?: string | undefined;
    unit?: string | undefined;
    description?: string | undefined;
    images?: {
        url: string;
        publicId: string;
        isPrimary: boolean;
    }[] | undefined;
}, {
    name: string;
    price: number;
    expiryDate: Date;
    stock: number;
    sku?: string | undefined;
    categoryId?: string | undefined;
    categoryName?: string | undefined;
    unit?: string | undefined;
    cost?: number | undefined;
    description?: string | undefined;
    images?: {
        url: string;
        publicId: string;
        isPrimary?: boolean | undefined;
    }[] | undefined;
    lowStockThreshold?: number | undefined;
}>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export declare const UpdateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    expiryDate: z.ZodOptional<z.ZodDate>;
    sku: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    categoryId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    categoryName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    unit: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    cost: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
    stock: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
        isPrimary: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId: string;
        isPrimary: boolean;
    }, {
        url: string;
        publicId: string;
        isPrimary?: boolean | undefined;
    }>, "many">>>;
    lowStockThreshold: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    price?: number | undefined;
    expiryDate?: Date | undefined;
    sku?: string | undefined;
    categoryId?: string | undefined;
    categoryName?: string | undefined;
    unit?: string | undefined;
    cost?: number | undefined;
    stock?: number | undefined;
    description?: string | undefined;
    images?: {
        url: string;
        publicId: string;
        isPrimary: boolean;
    }[] | undefined;
    lowStockThreshold?: number | undefined;
}, {
    name?: string | undefined;
    price?: number | undefined;
    expiryDate?: Date | undefined;
    sku?: string | undefined;
    categoryId?: string | undefined;
    categoryName?: string | undefined;
    unit?: string | undefined;
    cost?: number | undefined;
    stock?: number | undefined;
    description?: string | undefined;
    images?: {
        url: string;
        publicId: string;
        isPrimary?: boolean | undefined;
    }[] | undefined;
    lowStockThreshold?: number | undefined;
}>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
