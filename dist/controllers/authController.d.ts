import { Request, Response, NextFunction } from 'express';
import { type LoginUserInput, type CreateUserInput } from '../models/User';
interface LoginRequest extends Request {
    body: LoginUserInput;
}
interface RegisterRequest extends Request {
    body: CreateUserInput;
}
interface AuthRequest extends Request {
    user?: any;
}
export declare const loginUser: (req: LoginRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const registerUser: (req: RegisterRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
