import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getDashboardStats: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getRecentActivity: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getInventoryAlerts: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
