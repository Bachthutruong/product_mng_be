import { Request, Response, NextFunction } from 'express';
import { getDB } from '@/config/database';
import { ObjectId } from 'mongodb';
import { 
  CreateOrderSchema, 
  UpdateOrderSchema,
  UpdateOrderStatusSchema,
//   type CreateOrderInput,
//   type UpdateOrderInput
} from '@/models/Order';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = getDB();
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status, 
      startDate, 
      endDate,
      customerId
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query: any = { isDeleted: { $ne: true } }; // Exclude soft deleted orders
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status as string;
    }
    if(customerId) {
      query.customerId = customerId as string;
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    
    const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).toArray();
    const total = await db.collection('orders').countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum * limitNum < total,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
      return;
    }

    const db = getDB();
    const order = await db.collection('orders').findOne({ 
      _id: new ObjectId(id),
      isDeleted: { $ne: true }
    });

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    // Calculate profit
    let totalCost = 0;
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        totalCost += (item.cost || 0) * item.quantity;
      });
    }
    const profit = order.subtotal - totalCost;
    
    // Add profit to the order object
    const orderWithProfit = { ...order, profit };

    res.status(200).json({
      success: true,
      data: orderWithProfit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private (Admin/Employee)
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request body
    const validation = CreateOrderSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      });
      return;
    }

    const orderData = validation.data;
    const user = req.user;
    const db = getDB();

    // Get customer data
    const customer = await db.collection('customers').findOne({ _id: new ObjectId(orderData.customerId) });
    if (!customer) {
      res.status(400).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }

    // Calculate order totals
    let subtotal = 0;
    const enhancedItems = [];

    for (const item of orderData.items) {
      const product = await db.collection('products').findOne({ _id: new ObjectId(item.productId) });
      if (!product) {
        res.status(400).json({
          success: false,
          error: `Product not found: ${item.productId}`
        });
        return;
      }

      const lineTotal = item.quantity * item.unitPrice;
      subtotal += lineTotal;

      enhancedItems.push({
        ...item,
        productName: product.name,
        productSku: product.sku || '',
        cost: product.cost || 0
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (orderData.discountType && orderData.discountValue) {
      if (orderData.discountType === 'percentage') {
        discountAmount = (subtotal * orderData.discountValue) / 100;
      } else if (orderData.discountType === 'fixed') {
        discountAmount = orderData.discountValue;
      }
    }

    const shippingFee = orderData.shippingFee || 0;
    const totalAmount = subtotal - discountAmount + shippingFee;

    // Generate order number
    const orderCount = await db.collection('orders').countDocuments({});
    const orderNumber = `ORD${String(orderCount + 1).padStart(6, '0')}`;

    // Create order
    const newOrder = {
      orderNumber,
      customerId: orderData.customerId,
      customerName: customer.name,
      items: enhancedItems,
      subtotal,
      discountType: orderData.discountType || null,
      discountValue: orderData.discountValue || null,
      discountAmount,
      shippingFee,
      totalAmount,
      status: 'pending',
      orderDate: new Date(),
      notes: orderData.notes || null,
      createdByUserId: user._id.toString(),
      createdByName: user.fullName || user.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false
    };

    const result = await db.collection('orders').insertOne(newOrder);

    // Get the created order
    const createdOrder = await db.collection('orders').findOne({ _id: result.insertedId });

    res.status(201).json({
      success: true,
      data: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private (Admin/Employee)
export const updateOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
      return;
    }

    // Validate request body
    const validation = UpdateOrderSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      });
      return;
    }

    const updateData = validation.data;
    const db = getDB();

    // Check if order exists
    const existingOrder = await db.collection('orders').findOne({ 
      _id: new ObjectId(id),
      isDeleted: { $ne: true }
    });
    if (!existingOrder) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    // Update order
    const result = await db.collection('orders').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Employee)
export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid order ID' });
      return;
    }

    const validation = UpdateOrderStatusSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'Invalid input', details: validation.error.errors });
      return;
    }
    
    const { status } = validation.data;
    const db = getDB();

    const result = await db.collection('orders').findOneAndUpdate(
      { _id: new ObjectId(id), isDeleted: { $ne: true } },
      { $set: { status: status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      res.status(404).json({ success: false, error: 'Order not found or has been deleted' });
      return;
    }
    
    res.status(200).json({ success: true, data: result });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete order (soft delete)
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
export const deleteOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
      return;
    }

    const db = getDB();
    const user = req.user;
    
    // Check if order exists
    const order = await db.collection('orders').findOne({ 
      _id: new ObjectId(id),
      isDeleted: { $ne: true }
    });
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    // Soft delete order
    await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedByUserId: user._id.toString(),
          deletedByName: user.fullName || user.name,
          updatedAt: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 