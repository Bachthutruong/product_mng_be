import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getOrders: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateOrderStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
