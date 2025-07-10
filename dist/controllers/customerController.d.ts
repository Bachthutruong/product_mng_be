import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getCustomers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCustomer: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createCustomer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateCustomer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteCustomer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCustomerCategories: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
