import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getCustomerCategories: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createCustomerCategory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateCustomerCategory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteCustomerCategory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
