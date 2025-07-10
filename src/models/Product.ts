import { z } from 'zod';

export const ProductImageSchema = z.object({
  url: z.string().url({ message: "無效的圖片 URL" }),
  publicId: z.string(),
  isPrimary: z.boolean().optional().default(false),
});
export type ProductImage = z.infer<typeof ProductImageSchema>;

export const PriceHistoryEntrySchema = z.object({
  price: z.number(),
  changedAt: z.date(),
  changedBy: z.string(), // User ID
});
export type PriceHistoryEntry = z.infer<typeof PriceHistoryEntrySchema>;

// 庫存入庫歷史記錄的 Schema
export const StockInEntrySchema = z.object({
  quantityAdded: z.number().int().positive(),
  batchExpiryDate: z.date().optional().nullable(),
  stockedAt: z.date(),
  stockedByUserId: z.string(), // User ID of who stocked it
  supplier: z.string().optional(),
  costAtTime: z.number().optional(), // Cost per unit at the time of stock-in
});
export type StockInEntry = z.infer<typeof StockInEntrySchema>;

// 批次追蹤的 Schema - 每個批次都有自己的到期日期和剩餘庫存
export const ProductBatchSchema = z.object({
  batchId: z.string(), // Unique identifier for this batch
  expiryDate: z.date(), // Required for new batches
  initialQuantity: z.number().int().positive(), // Original quantity when batch was created
  remainingQuantity: z.number().int().min(0), // Current remaining quantity
  costPerUnit: z.number().min(0).optional(),
  createdAt: z.date(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
});
export type ProductBatch = z.infer<typeof ProductBatchSchema>;

export const ProductSchema = z.object({
  _id: z.any().optional(), // MongoDB ObjectId will be here
  name: z.string().min(1, { message: "產品名稱是必需的" }),
  sku: z.string().min(1, { message: "SKU 是必需的" }).optional(),
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
  unit: z.string().optional(), // e.g., kg, piece, box
  price: z.coerce.number().min(0, { message: "價格必須是非負數" }),
  cost: z.coerce.number().min(0, { message: "成本必須是非負數" }).optional().default(0),
  stock: z.coerce.number().int({ message: "庫存必須是整數" }).min(0, { message: "庫存必須是非負數" }),
  description: z.string().optional(),
  images: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
    isPrimary: z.boolean().default(false),
  })).optional(),
  expiryDate: z.coerce.date({ message: "到期日期是必需的" }),
  lowStockThreshold: z.coerce.number().int().min(0).optional().default(0),
  priceHistory: z.array(PriceHistoryEntrySchema).optional().default([]),
  stockInHistory: z.array(StockInEntrySchema).optional().default([]),
  batches: z.array(ProductBatchSchema).optional().default([]), // Track individual batches
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Product = z.infer<typeof ProductSchema> & { _id: string };

// Schema for creating/updating products via API
export const CreateProductSchema = ProductSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  priceHistory: true,
  stockInHistory: true,
  batches: true, // 批次獨立管理
});
export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>; 