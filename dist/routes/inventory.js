"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventoryController_1 = require("../controllers/inventoryController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/movements').get(auth_1.protect, inventoryController_1.getInventoryMovements);
router.route('/stock-in').post(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), inventoryController_1.recordStockIn);
router.route('/adjustment').post(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), inventoryController_1.recordStockAdjustment);
router.route('/movements/:id/revert').post(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), inventoryController_1.revertInventoryMovement);
exports.default = router;
