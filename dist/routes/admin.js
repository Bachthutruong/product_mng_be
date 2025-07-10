"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect, (0, auth_1.authorize)('admin'));
router.route('/users')
    .get(adminController_1.getUsers)
    .post(adminController_1.addUser);
router.route('/users/:id')
    .put(adminController_1.updateUser)
    .delete(adminController_1.deleteUser);
router.route('/deleted-orders')
    .get(adminController_1.getDeletedOrders);
router.route('/restore-order/:id')
    .put(adminController_1.restoreOrder);
exports.default = router;
