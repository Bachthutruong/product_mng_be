import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '@/config/database';
import { ObjectId } from 'mongodb';
import { 
  LoginUserInputSchema, 
  CreateUserSchema, 
  UpdateUserProfileSchema,
  type LoginUserInput,
  type CreateUserInput,
//   type UpdateUserProfileInput
} from '@/models/User';

interface LoginRequest extends Request {
  body: LoginUserInput;
}

interface RegisterRequest extends Request {
  body: CreateUserInput;
}

interface AuthRequest extends Request {
  user?: any;
}

// Generate JWT Token
const generateToken = (userId: string): string => {
  // @ts-ignore
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: LoginRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request body
    const validation = LoginUserInputSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      });
      return;
    }

    const { email, password } = validation.data;

    // Check for user
    const db = getDB();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found' // Changed error message
      });
      return;
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Incorrect password' // Changed error message
      });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Private (Admin only)
export const registerUser = async (req: RegisterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request body
    const validation = CreateUserSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      });
      return;
    }

    const { name, password, role, fullName, email } = validation.data;

    // Check if user exists
    const db = getDB();
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User already exists'
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      name,
      password: hashedPassword,
      role,
      fullName,
      email,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    // Generate token
    const token = generateToken(result.insertedId.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.insertedId,
        name: newUser.name,
        fullName: newUser.fullName,
        role: newUser.role,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request body
    const validation = UpdateUserProfileSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      });
      return;
    }

    const { fullName, email, name } = validation.data;
    const userId = req.user._id;

    const updateData: any = {
      updatedAt: new Date()
    };

    if (fullName) updateData.fullName = fullName;
    if (name) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    const db = getDB();
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: result._id,
        name: result.name,
        fullName: result.fullName,
        role: result.role,
        email: result.email,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
}; 