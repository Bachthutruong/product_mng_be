"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.route('/')
    .get(auth_1.protect, orderController_1.getOrders)
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), orderController_1.createOrder);
router.route('/:id')
    .get(auth_1.protect, orderController_1.getOrder)
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), orderController_1.updateOrder)
    .delete(auth_1.protect, (0, auth_1.authorize)('admin'), orderController_1.deleteOrder);
router.route('/:id/status')
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), orderController_1.updateOrderStatus);
exports.default = router;
