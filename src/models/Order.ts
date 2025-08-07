import { z } from 'zod';

export const OrderBatchUsageSchema = z.object({
  batchId: z.string(),
  expiryDate: z.date(),
  quantityUsed: z.number().int().positive(),
});
export type OrderBatchUsage = z.infer<typeof OrderBatchUsageSchema>;

export const OrderLineItemSchema = z.object({
  _id: z.any().optional(), 
  productId: z.string(), 
  productName: z.string(), 
  productSku: z.string().optional(), 
  quantity: z.coerce.number().int().min(1, "數量必須至少為 1"),
  unitPrice: z.coerce.number(), // Allow negative prices for discounts/coupons
  cost: z.coerce.number().min(0).optional().default(0), 
  notes: z.string().optional().nullable(),
  batchesUsed: z.array(OrderBatchUsageSchema).optional().default([]),
});
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;

export const DiscountTypeSchema = z.enum(['percentage', 'fixed']);
export type DiscountType = z.infer<typeof DiscountTypeSchema>;

export const OrderStatusSchema = z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed', 'returned']);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderSchema = z.object({
  _id: z.any().optional(), 
  orderNumber: z.string().min(1, "訂單號碼是必需的").optional(),
  customerId: z.string(), 
  customerName: z.string(), 
  items: z.array(OrderLineItemSchema).min(1, "訂單必須至少包含一個項目"),
  subtotal: z.coerce.number().min(0), 
  discountType: DiscountTypeSchema.optional().nullable(),
  discountValue: z.coerce.number().min(0).optional().nullable(),
  discountAmount: z.coerce.number().min(0).optional().nullable().default(0), 
  shippingFee: z.coerce.number().min(0).optional().nullable().default(0),
  storeShippingCost: z.coerce.number().min(0).optional().nullable().default(0),
  totalAmount: z.coerce.number().min(0), 
  status: OrderStatusSchema.default('pending'),
  orderDate: z.date().default(() => new Date()),
  notes: z.string().optional().nullable(),
  createdByUserId: z.string(), 
  createdByName: z.string(), 
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  costOfGoodsSold: z.coerce.number().min(0).optional().nullable(), 
  profit: z.coerce.number().optional().nullable(),
  // Soft delete fields
  isDeleted: z.boolean().optional().default(false),
  deletedAt: z.date().optional().nullable(),
  deletedByUserId: z.string().optional().nullable(),
  deletedByName: z.string().optional().nullable(),
});

export type Order = z.infer<typeof OrderSchema> & { _id: string };

export const CreateOrderSchema = z.object({
  customerId: z.string().min(1, "客戶是必需的"),
  items: z.array(z.object({
    productId: z.string().min(1, "產品是必需的"),
    quantity: z.coerce.number().int().min(1, "數量必須至少為 1"),
    unitPrice: z.coerce.number(), 
    productName: z.string(), 
    productSku: z.string().optional(),
    cost: z.coerce.number().optional().default(0), 
    notes: z.string().optional().nullable(),
  })).min(1, "訂單必須至少包含一個項目。"),
  discountType: DiscountTypeSchema.optional().nullable(),
  discountValue: z.coerce.number().min(0).optional().nullable(), 
  shippingFee: z.coerce.number().min(0).optional().nullable(),
  storeShippingCost: z.coerce.number().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
});
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderSchema = z.object({
  status: OrderStatusSchema.optional(),
  notes: z.string().optional().nullable(),
  discountType: DiscountTypeSchema.optional().nullable(),
  discountValue: z.coerce.number().min(0).optional().nullable(),
  shippingFee: z.coerce.number().min(0).optional().nullable(),
  storeShippingCost: z.coerce.number().min(0).optional().nullable(),
});
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema,
});

export const AllOrderStatusOptions = OrderStatusSchema.options; // Export options for UI 