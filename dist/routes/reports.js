"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const reportsController_1 = require("../controllers/reportsController");
const router = express_1.default.Router();
router.get('/sales-summary', auth_1.protect, reportsController_1.getSalesSummary);
exports.default = router;
