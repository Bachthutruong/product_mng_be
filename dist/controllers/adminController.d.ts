import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getUsers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const addUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getDeletedOrders: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const restoreOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
