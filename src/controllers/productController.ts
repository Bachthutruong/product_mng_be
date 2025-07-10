import { Request, Response, NextFunction } from 'express';
import { getDB } from '@/config/database';
import { ObjectId } from 'mongodb';
import cloudinary from '@/config/cloudinary';
import {
  CreateProductSchema,
  UpdateProductSchema,
//   type CreateProductInput,
//   type UpdateProductInput,
//   type Product
} from '@/models/Product';
import { Product } from '@/models/Product';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all products
// @route   GET /api/products
// @access  Private
export const getProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    
    // Get query parameters for filtering and pagination
    const {
      page = '1',
      limit = '10',
      search = '',
      categoryId = '',
      stockStatus = 'all' // 'all', 'low', 'out-of-stock'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter: any = {};

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (categoryId && categoryId !== 'all') {
      filter.categoryId = categoryId;
    }

    // Stock status filter
    if (stockStatus === 'low') {
      filter.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    } else if (stockStatus === 'out-of-stock') {
      filter.stock = 0;
    }

    // Get products with pagination
    const products = await db.collection('products')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection('products').countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid product ID' });
      return;
    }

    const db = getDB();
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });

    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    // Fetch related data
    const category = await db.collection('categories').findOne({ _id: new ObjectId(product.categoryId) });
    const inventoryMovements = await db.collection('inventory_movements').find({ productId: id }).sort({ createdAt: -1 }).toArray();

    const data = {
      ...product,
      categoryName: category?.name || 'N/A',
      inventoryMovements,
      batches: product.batches || [], // Ensure batches is always an array
    };

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin/Employee)
export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request body
    const validation = CreateProductSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      });
      return;
    }

    const productData = validation.data;
    const user = req.user;
    const db = getDB();

    // Get category name to store with the product
    let categoryName = '';
    if (productData.categoryId) {
        const category = await db.collection('categories').findOne({ _id: new ObjectId(productData.categoryId) });
        if (category) {
            categoryName = category.name;
        }
    }

    // Check if SKU already exists (if provided)
    if (productData.sku) {
      const existingProduct = await db.collection('products').findOne({ sku: productData.sku });
      if (existingProduct) {
        res.status(400).json({
          success: false,
          error: 'SKU already exists'
        });
        return;
      }
    }

    // Create product
    const newProduct = {
      ...productData,
      categoryName, // Add categoryName
      createdAt: new Date(),
      updatedAt: new Date(),
      priceHistory: [{
        price: productData.price,
        changedAt: new Date(),
        changedBy: user._id.toString()
      }],
      stockInHistory: [],
      batches: []
    };

    const result = await db.collection('products').insertOne(newProduct);

    // Get the created product
    const createdProduct = await db.collection('products').findOne({ _id: result.insertedId });

    res.status(201).json({
      success: true,
      data: createdProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Employee)
export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid product ID' });
      return;
    }

    let updateData = req.body;

    // If user is not admin, prevent certain fields from being updated
    if (req.user?.role !== 'admin') {
      const { price, cost, stock, categoryId, ...allowedUpdates } = updateData;
      
      if (price !== undefined || cost !== undefined || stock !== undefined || categoryId !== undefined) {
        res.status(403).json({ success: false, error: 'You are not authorized to update price, cost, stock, or category.' });
        return;
      }
      updateData = allowedUpdates;
    }

    const validation = UpdateProductSchema.safeParse(updateData);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'Invalid data', details: validation.error.errors });
      return;
    }

    const validatedData = validation.data;
    
    if (Object.keys(validatedData).length === 0) {
      res.status(400).json({ success: false, error: 'No valid fields to update' });
      return;
    }

    const result = await db.collection('products').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...validatedData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }
    
    res.status(200).json({ success: true, data: result });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
      return;
    }

    const db = getDB();
    
    // Check if product exists
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found'
      });
      return;
    }

    // Check if product is used in any orders (optional business rule)
    const ordersWithProduct = await db.collection('orders').findOne({
      'items.productId': id,
      isDeleted: { $ne: true }
    });

    if (ordersWithProduct) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete product that is referenced in orders'
      });
      return;
    }

    // Delete product
    await db.collection('products').deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Private (Admin/Employee)
export const uploadProductImages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid product ID' });
      return;
    }

    const db = getDB();
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({ success: false, error: 'Please upload at least one image.' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    const uploadedImages = [];

    for (const file of files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: process.env.CLOUDINARY_FOLDER || 'stockpilot_products',
      });
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
        isPrimary: false,
      });
    }

    const hasPrimaryImage = product.images?.some((img: any) => img.isPrimary);
    if (!hasPrimaryImage && uploadedImages.length > 0) {
      uploadedImages[0].isPrimary = true;
    }

    await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $push: { images: { $each: uploadedImages } as any }, $set: { updatedAt: new Date() } }
    );
    
    const updatedProduct = await db.collection('products').findOne({ _id: new ObjectId(id) });

    res.status(200).json({ success: true, data: updatedProduct });

  } catch (error) {
    next(error);
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Private
export const getProductCategories = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search = '' } = req.query;
    const filter: any = {};
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }

    const db = getDB();
    const categories = await db.collection('categories')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product category
// @route   POST /api/products/categories
// @access  Private
export const createProductCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    const newCategory = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('categories').insertOne(newCategory);
    const createdCategory = await db.collection('categories').findOne({ _id: result.insertedId });
    res.status(201).json({ success: true, data: createdCategory });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product category
// @route   PUT /api/products/categories/:id
// @access  Private
export const updateProductCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid category ID' });
      return;
    }
    const db = getDB();
    const updatedData = { ...req.body, updatedAt: new Date() };
    const result = await db.collection('categories').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedData },
      { returnDocument: 'after' }
    );
    if (!result) {
      res.status(404).json({ success: false, error: 'Category not found' });
      return;
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product category
// @route   DELETE /api/products/categories/:id
// @access  Private
export const deleteProductCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid category ID' });
      return;
    }
    const db = getDB();
    const result = await db.collection('categories').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ success: false, error: 'Category not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
}; 

export const deleteProductImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const imageId = decodeURIComponent(req.params.imageId); // Decode imageId
    const db = getDB();

    const product = await db.collection<Product>('products').findOne({ _id: new ObjectId(id) as any });
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    await cloudinary.uploader.destroy(imageId);

    await db.collection<Product>('products').updateOne(
      { _id: new ObjectId(id) as any },
      { $pull: { images: { publicId: imageId } as any } }
    );
    
    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};

export const setPrimaryProductImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const imageId = decodeURIComponent(req.params.imageId); // Decode imageId
    const db = getDB();

    await db.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { $set: { "images.$[].isPrimary": false } }
    );

    await db.collection('products').updateOne(
        { _id: new ObjectId(id), "images.publicId": imageId },
        { $set: { "images.$.isPrimary": true } }
    );
    
    res.status(200).json({ success: true, message: 'Primary image set' });
  } catch (error) {
    next(error);
  }
}; 