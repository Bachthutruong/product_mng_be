import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getInventoryMovements: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const recordStockIn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const recordStockAdjustment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const revertInventoryMovement: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
