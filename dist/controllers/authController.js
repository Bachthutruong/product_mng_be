"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = exports.registerUser = exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const mongodb_1 = require("mongodb");
const User_1 = require("../models/User");
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};
const loginUser = async (req, res, next) => {
    try {
        const validation = User_1.LoginUserInputSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                error: 'Invalid input data',
                details: validation.error.errors
            });
            return;
        }
        const { email, password } = validation.data;
        const db = (0, database_1.getDB)();
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'User not found'
            });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                error: 'Incorrect password'
            });
            return;
        }
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
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
const registerUser = async (req, res, next) => {
    try {
        const validation = User_1.CreateUserSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                error: 'Invalid input data',
                details: validation.error.errors
            });
            return;
        }
        const { name, password, role, fullName, email } = validation.data;
        const db = (0, database_1.getDB)();
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User already exists'
            });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
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
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
const getMe = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res, next) => {
    try {
        const validation = User_1.UpdateUserProfileSchema.safeParse(req.body);
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
        const updateData = {
            updatedAt: new Date()
        };
        if (fullName)
            updateData.fullName = fullName;
        if (name)
            updateData.name = name;
        if (email !== undefined)
            updateData.email = email;
        const db = (0, database_1.getDB)();
        const result = await db.collection('users').findOneAndUpdate({ _id: new mongodb_1.ObjectId(userId) }, { $set: updateData }, { returnDocument: 'after', projection: { password: 0 } });
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
