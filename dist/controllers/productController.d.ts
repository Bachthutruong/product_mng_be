import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getProducts: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getProduct: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createProduct: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProduct: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteProduct: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const uploadProductImages: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getProductCategories: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createProductCategory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProductCategory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteProductCategory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteProductImage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const setPrimaryProductImage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
