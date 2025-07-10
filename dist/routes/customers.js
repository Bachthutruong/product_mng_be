"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, customerController_1.getCustomers)
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), customerController_1.createCustomer);
router.route('/:id')
    .get(auth_1.protect, customerController_1.getCustomer)
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), customerController_1.updateCustomer)
    .delete(auth_1.protect, (0, auth_1.authorize)('admin'), customerController_1.deleteCustomer);
exports.default = router;
