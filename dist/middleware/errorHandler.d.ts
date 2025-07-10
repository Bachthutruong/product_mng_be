import { Request, Response } from 'express';
interface CustomError extends Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
}
export declare const errorHandler: (err: CustomError, _req: Request, res: Response) => void;
export {};
