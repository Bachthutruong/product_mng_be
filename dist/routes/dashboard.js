"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const dashboardController_1 = require("../controllers/dashboardController");
const router = express_1.default.Router();
router.get('/stats', auth_1.protect, dashboardController_1.getDashboardStats);
router.get('/recent-activity', auth_1.protect, dashboardController_1.getRecentActivity);
router.get('/inventory-alerts', auth_1.protect, dashboardController_1.getInventoryAlerts);
exports.default = router;
