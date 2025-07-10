import { z } from 'zod';

export const InventoryMovementTypeSchema = z.enum(['stock-in', 'stock-out', 'adjustment-add', 'adjustment-remove', 'sale']);
export type InventoryMovementType = z.infer<typeof InventoryMovementTypeSchema>;

export const InventoryMovementSchema = z.object({
  _id: z.any().optional(),
  productId: z.string(), // Reference to Product._id
  productName: z.string(), // Denormalized for easier display in history
  type: InventoryMovementTypeSchema,
  quantity: z.number().int(), // Can be positive (stock-in, adjustment-add) or negative (stock-out, adjustment-remove, sale)
  movementDate: z.date(),
  userId: z.string(), // Reference to User._id
  userName: z.string(), // Denormalized for easier display
  batchExpiryDate: z.date().optional().nullable(), // Expiry date of the specific batch being moved
  relatedOrderId: z.string().optional().nullable(), // For sales or order-related adjustments
  notes: z.string().optional().nullable(),
  stockBefore: z.number().int(),
  stockAfter: z.number().int(),
  isReverted: z.boolean().optional().default(false), // To mark if this movement has been undone
  revertedFromId: z.string().optional().nullable(), // To link a revert movement to its original
});

export type InventoryMovement = z.infer<typeof InventoryMovementSchema> & { _id: string };

export const RecordStockInSchema = z.object({
  productId: z.string().min(1, "產品選擇是必需的"),
  quantity: z.coerce.number().int().min(1, "數量必須至少為 1"),
  batchExpiryDate: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
});
export type RecordStockInInput = z.infer<typeof RecordStockInSchema>;

export const RecordStockAdjustmentSchema = z.object({
  productId: z.string().min(1, "產品選擇是必需的"),
  quantityChange: z.coerce.number().int().refine(val => val !== 0, "數量變更不能為零"),
  reason: z.string().min(1, "原因說明是必需的"),
  notes: z.string().optional().nullable(),
});
export type RecordStockAdjustmentInput = z.infer<typeof RecordStockAdjustmentSchema>; 