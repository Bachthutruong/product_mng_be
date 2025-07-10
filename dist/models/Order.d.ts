import { z } from 'zod';
export declare const OrderBatchUsageSchema: z.ZodObject<{
    batchId: z.ZodString;
    expiryDate: z.ZodDate;
    quantityUsed: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    batchId: string;
    expiryDate: Date;
    quantityUsed: number;
}, {
    batchId: string;
    expiryDate: Date;
    quantityUsed: number;
}>;
export type OrderBatchUsage = z.infer<typeof OrderBatchUsageSchema>;
export declare const OrderLineItemSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodAny>;
    productId: z.ZodString;
    productName: z.ZodString;
    productSku: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNumber;
    cost: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    batchesUsed: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        batchId: z.ZodString;
        expiryDate: z.ZodDate;
        quantityUsed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        batchId: string;
        expiryDate: Date;
        quantityUsed: number;
    }, {
        batchId: string;
        expiryDate: Date;
        quantityUsed: number;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    cost: number;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    batchesUsed: {
        batchId: string;
        expiryDate: Date;
        quantityUsed: number;
    }[];
    _id?: any;
    notes?: string | null | undefined;
    productSku?: string | undefined;
}, {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    _id?: any;
    notes?: string | null | undefined;
    cost?: number | undefined;
    productSku?: string | undefined;
    batchesUsed?: {
        batchId: string;
        expiryDate: Date;
        quantityUsed: number;
    }[] | undefined;
}>;
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;
export declare const DiscountTypeSchema: z.ZodEnum<["percentage", "fixed"]>;
export type DiscountType = z.infer<typeof DiscountTypeSchema>;
export declare const OrderStatusSchema: z.ZodEnum<["pending", "processing", "shipped", "delivered", "cancelled", "completed", "returned"]>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export declare const OrderSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodAny>;
    orderNumber: z.ZodOptional<z.ZodString>;
    customerId: z.ZodString;
    customerName: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        _id: z.ZodOptional<z.ZodAny>;
        productId: z.ZodString;
        productName: z.ZodString;
        productSku: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        unitPrice: z.ZodNumber;
        cost: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        batchesUsed: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            batchId: z.ZodString;
            expiryDate: z.ZodDate;
            quantityUsed: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            batchId: string;
            expiryDate: Date;
            quantityUsed: number;
        }, {
            batchId: string;
            expiryDate: Date;
            quantityUsed: number;
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
        cost: number;
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        batchesUsed: {
            batchId: string;
            expiryDate: Date;
            quantityUsed: number;
        }[];
        _id?: any;
        notes?: string | null | undefined;
        productSku?: string | undefined;
    }, {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        _id?: any;
        notes?: string | null | undefined;
        cost?: number | undefined;
        productSku?: string | undefined;
        batchesUsed?: {
            batchId: string;
            expiryDate: Date;
            quantityUsed: number;
        }[] | undefined;
    }>, "many">;
    subtotal: z.ZodNumber;
    discountType: z.ZodNullable<z.ZodOptional<z.ZodEnum<["percentage", "fixed"]>>>;
    discountValue: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    discountAmount: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    shippingFee: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    totalAmount: z.ZodNumber;
    status: z.ZodDefault<z.ZodEnum<["pending", "processing", "shipped", "delivered", "cancelled", "completed", "returned"]>>;
    orderDate: z.ZodDefault<z.ZodDate>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    createdByUserId: z.ZodString;
    createdByName: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    costOfGoodsSold: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    profit: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    isDeleted: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    deletedAt: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    deletedByUserId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    deletedByName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "completed" | "returned";
    isDeleted: boolean;
    customerId: string;
    customerName: string;
    items: {
        cost: number;
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        batchesUsed: {
            batchId: string;
            expiryDate: Date;
            quantityUsed: number;
        }[];
        _id?: any;
        notes?: string | null | undefined;
        productSku?: string | undefined;
    }[];
    subtotal: number;
    discountAmount: number | null;
    shippingFee: number | null;
    totalAmount: number;
    orderDate: Date;
    createdByUserId: string;
    createdByName: string;
    _id?: any;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    notes?: string | null | undefined;
    orderNumber?: string | undefined;
    discountType?: "fixed" | "percentage" | null | undefined;
    discountValue?: number | null | undefined;
    costOfGoodsSold?: number | null | undefined;
    profit?: number | null | undefined;
    deletedAt?: Date | null | undefined;
    deletedByUserId?: string | null | undefined;
    deletedByName?: string | null | undefined;
}, {
    customerId: string;
    customerName: string;
    items: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        _id?: any;
        notes?: string | null | undefined;
        cost?: number | undefined;
        productSku?: string | undefined;
        batchesUsed?: {
            batchId: string;
            expiryDate: Date;
            quantityUsed: number;
        }[] | undefined;
    }[];
    subtotal: number;
    totalAmount: number;
    createdByUserId: string;
    createdByName: string;
    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "completed" | "returned" | undefined;
    _id?: any;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    notes?: string | null | undefined;
    isDeleted?: boolean | undefined;
    orderNumber?: string | undefined;
    discountType?: "fixed" | "percentage" | null | undefined;
    discountValue?: number | null | undefined;
    discountAmount?: number | null | undefined;
    shippingFee?: number | null | undefined;
    orderDate?: Date | undefined;
    costOfGoodsSold?: number | null | undefined;
    profit?: number | null | undefined;
    deletedAt?: Date | null | undefined;
    deletedByUserId?: string | null | undefined;
    deletedByName?: string | null | undefined;
}>;
export type Order = z.infer<typeof OrderSchema> & {
    _id: string;
};
export declare const CreateOrderSchema: z.ZodObject<{
    customerId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
        unitPrice: z.ZodNumber;
        productName: z.ZodString;
        productSku: z.ZodOptional<z.ZodString>;
        cost: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        cost: number;
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        notes?: string | null | undefined;
        productSku?: string | undefined;
    }, {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        notes?: string | null | undefined;
        cost?: number | undefined;
        productSku?: string | undefined;
    }>, "many">;
    discountType: z.ZodNullable<z.ZodOptional<z.ZodEnum<["percentage", "fixed"]>>>;
    discountValue: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    shippingFee: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    items: {
        cost: number;
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        notes?: string | null | undefined;
        productSku?: string | undefined;
    }[];
    notes?: string | null | undefined;
    discountType?: "fixed" | "percentage" | null | undefined;
    discountValue?: number | null | undefined;
    shippingFee?: number | null | undefined;
}, {
    customerId: string;
    items: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        notes?: string | null | undefined;
        cost?: number | undefined;
        productSku?: string | undefined;
    }[];
    notes?: string | null | undefined;
    discountType?: "fixed" | "percentage" | null | undefined;
    discountValue?: number | null | undefined;
    shippingFee?: number | null | undefined;
}>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export declare const UpdateOrderSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["pending", "processing", "shipped", "delivered", "cancelled", "completed", "returned"]>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    discountType: z.ZodNullable<z.ZodOptional<z.ZodEnum<["percentage", "fixed"]>>>;
    discountValue: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    shippingFee: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "completed" | "returned" | undefined;
    notes?: string | null | undefined;
    discountType?: "fixed" | "percentage" | null | undefined;
    discountValue?: number | null | undefined;
    shippingFee?: number | null | undefined;
}, {
    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "completed" | "returned" | undefined;
    notes?: string | null | undefined;
    discountType?: "fixed" | "percentage" | null | undefined;
    discountValue?: number | null | undefined;
    shippingFee?: number | null | undefined;
}>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export declare const UpdateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "processing", "shipped", "delivered", "cancelled", "completed", "returned"]>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "completed" | "returned";
}, {
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "completed" | "returned";
}>;
export declare const AllOrderStatusOptions: ["pending", "processing", "shipped", "delivered", "cancelled", "completed", "returned"];
