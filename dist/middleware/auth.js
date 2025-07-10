"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const mongodb_1 = require("mongodb");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const db = (0, database_1.getDB)();
            const user = await db.collection('users').findOne({
                _id: new mongodb_1.ObjectId(decoded.userId)
            }, {
                projection: { password: 0 }
            });
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }
            req.user = user;
            next();
        }
        catch (err) {
            res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
            return;
        }
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
