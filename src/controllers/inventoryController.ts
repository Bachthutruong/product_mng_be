import { Request, Response, NextFunction } from 'express';
import { getDB } from '@/config/database';
import { ObjectId } from 'mongodb';
import { 
  RecordStockInSchema,
  RecordStockAdjustmentSchema
} from '@/models/InventoryMovement';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all inventory movements
// @route   GET /api/inventory/movements
// @access  Private
export const getInventoryMovements = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    const {
      page = '1',
      limit = '20',
      productId = '',
      type = '',
      search = '',
      startDate = '',
      endDate = ''
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};

    if (productId) filter.productId = productId;
    if (type) filter.type = type;

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filter.$or = [
        { productName: searchRegex },
        { userName: searchRegex },
        { notes: searchRegex },
        { type: searchRegex },
      ];
    }
    
    if (startDate || endDate) {
      filter.movementDate = {};
      if (startDate) filter.movementDate.$gte = new Date(startDate as string);
      if (endDate) filter.movementDate.$lte = new Date(endDate as string);
    }

    const movementsData = await db.collection('inventoryMovements')
      .find(filter)
      .sort({ movementDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const movements = movementsData.map(m => ({
      ...m,
      isRevertible: m.type !== 'stock-out' && m.type !== 'sale' && !m.isReverted,
    }));

    const totalCount = await db.collection('inventoryMovements').countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      data: movements,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record stock in
// @route   POST /api/inventory/stock-in
// @access  Private (Admin/Employee)
export const recordStockIn = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validation = RecordStockInSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'Invalid input', details: validation.error.errors });
      return;
    }

    const { productId, quantity, batchExpiryDate, notes } = validation.data;
    const user = req.user;
    const db = getDB();

    const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    // Update product stock
    const stockBefore = product.stock;
    const stockAfter = stockBefore + quantity;
    await db.collection('products').updateOne(
      { _id: new ObjectId(productId) },
      { $set: { stock: stockAfter, updatedAt: new Date() } }
    );

    // Create inventory movement record
    const movement = {
      productId,
      productName: product.name,
      type: 'stock-in',
      quantity,
      movementDate: new Date(),
      userId: user._id.toString(),
      userName: user.fullName || user.name,
      batchExpiryDate,
      notes,
      stockBefore,
      stockAfter,
    };
    await db.collection('inventoryMovements').insertOne(movement);

    res.status(201).json({ success: true, data: movement });
  } catch (error) {
    next(error);
  }
};

// @desc    Record stock adjustment
// @route   POST /api/inventory/adjustment
// @access  Private (Admin/Employee)
export const recordStockAdjustment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validation = RecordStockAdjustmentSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'Invalid input', details: validation.error.errors });
      return;
    }

    const { productId, quantityChange, reason, notes } = validation.data;
    const user = req.user;
    const db = getDB();

    const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const stockBefore = product.stock;
    const stockAfter = stockBefore + quantityChange;
    if (stockAfter < 0) {
      res.status(400).json({ success: false, error: 'Adjustment would result in negative stock.' });
      return;
    }

    // Update product stock
    await db.collection('products').updateOne(
      { _id: new ObjectId(productId) },
      { $set: { stock: stockAfter, updatedAt: new Date() } }
    );

    // Create inventory movement record
    const movementType = quantityChange > 0 ? 'adjustment-add' : 'adjustment-remove';
    const movement = {
      productId,
      productName: product.name,
      type: movementType,
      quantity: quantityChange,
      movementDate: new Date(),
      userId: user._id.toString(),
      userName: user.fullName || user.name,
      notes: `Reason: ${reason}. ${notes || ''}`.trim(),
      stockBefore,
      stockAfter,
    };
    await db.collection('inventoryMovements').insertOne(movement);

    res.status(201).json({ success: true, data: movement });
  } catch (error) {
    next(error);
  }
};

// @desc    Revert an inventory movement
// @route   POST /api/inventory/movements/:id/revert
// @access  Private (Admin/Employee)
export const revertInventoryMovement = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;
    const db = getDB();

    // 1. Find the original movement
    const originalMovement = await db.collection('inventoryMovements').findOne({ _id: new ObjectId(id) });

    if (!originalMovement) {
      res.status(404).json({ success: false, error: 'Inventory movement not found' });
      return;
    }

    // 2. Check if it's revertible
    if (originalMovement.isReverted) {
      res.status(400).json({ success: false, error: 'Movement has already been reverted' });
      return;
    }
    if (originalMovement.type === 'stock-out' || originalMovement.type === 'sale') {
       res.status(400).json({ success: false, error: 'Sale-related movements cannot be reverted from here' });
      return;
    }

    // 3. Find the product
    const product = await db.collection('products').findOne({ _id: new ObjectId(originalMovement.productId) });
    if (!product) {
      res.status(404).json({ success: false, error: 'Associated product not found' });
      return;
    }

    // 4. Create the reversing movement
    const stockBefore = product.stock;
    const reversingQuantity = -originalMovement.quantity;
    const stockAfter = stockBefore + reversingQuantity;

    const revertMovement = {
      productId: originalMovement.productId,
      productName: originalMovement.productName,
      type: 'adjustment-remove', // Or a new 'revert' type
      quantity: reversingQuantity,
      movementDate: new Date(),
      userId: user._id.toString(),
      userName: user.fullName || user.name,
      notes: `Reverted movement ID: ${id}`,
      stockBefore,
      stockAfter,
      isReverted: false,
      revertedFromId: id,
    };
    await db.collection('inventoryMovements').insertOne(revertMovement);

    // 5. Update product stock
    await db.collection('products').updateOne(
      { _id: new ObjectId(originalMovement.productId) },
      { $set: { stock: stockAfter, updatedAt: new Date() } }
    );
    
    // 6. Mark original movement as reverted
    await db.collection('inventoryMovements').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isReverted: true } }
    );

    res.status(200).json({ success: true, message: 'Movement reverted successfully' });
  } catch (error) {
    next(error);
  }
}; 