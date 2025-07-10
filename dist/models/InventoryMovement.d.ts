import { z } from 'zod';
export declare const InventoryMovementTypeSchema: z.ZodEnum<["stock-in", "stock-out", "adjustment-add", "adjustment-remove", "sale"]>;
export type InventoryMovementType = z.infer<typeof InventoryMovementTypeSchema>;
export declare const InventoryMovementSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodAny>;
    productId: z.ZodString;
    productName: z.ZodString;
    type: z.ZodEnum<["stock-in", "stock-out", "adjustment-add", "adjustment-remove", "sale"]>;
    quantity: z.ZodNumber;
    movementDate: z.ZodDate;
    userId: z.ZodString;
    userName: z.ZodString;
    batchExpiryDate: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    relatedOrderId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    stockBefore: z.ZodNumber;
    stockAfter: z.ZodNumber;
    isReverted: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    revertedFromId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type: "stock-in" | "stock-out" | "adjustment-add" | "adjustment-remove" | "sale";
    userId: string;
    productId: string;
    productName: string;
    quantity: number;
    movementDate: Date;
    userName: string;
    stockBefore: number;
    stockAfter: number;
    isReverted: boolean;
    _id?: any;
    batchExpiryDate?: Date | null | undefined;
    notes?: string | null | undefined;
    relatedOrderId?: string | null | undefined;
    revertedFromId?: string | null | undefined;
}, {
    type: "stock-in" | "stock-out" | "adjustment-add" | "adjustment-remove" | "sale";
    userId: string;
    productId: string;
    productName: string;
    quantity: number;
    movementDate: Date;
    userName: string;
    stockBefore: number;
    stockAfter: number;
    _id?: any;
    batchExpiryDate?: Date | null | undefined;
    notes?: string | null | undefined;
    relatedOrderId?: string | null | undefined;
    isReverted?: boolean | undefined;
    revertedFromId?: string | null | undefined;
}>;
export type InventoryMovement = z.infer<typeof InventoryMovementSchema> & {
    _id: string;
};
export declare const RecordStockInSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
    batchExpiryDate: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    productId: string;
    quantity: number;
    batchExpiryDate?: Date | null | undefined;
    notes?: string | null | undefined;
}, {
    productId: string;
    quantity: number;
    batchExpiryDate?: Date | null | undefined;
    notes?: string | null | undefined;
}>;
export type RecordStockInInput = z.infer<typeof RecordStockInSchema>;
export declare const RecordStockAdjustmentSchema: z.ZodObject<{
    productId: z.ZodString;
    quantityChange: z.ZodEffects<z.ZodNumber, number, number>;
    reason: z.ZodString;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    productId: string;
    quantityChange: number;
    reason: string;
    notes?: string | null | undefined;
}, {
    productId: string;
    quantityChange: number;
    reason: string;
    notes?: string | null | undefined;
}>;
export type RecordStockAdjustmentInput = z.infer<typeof RecordStockAdjustmentSchema>;
