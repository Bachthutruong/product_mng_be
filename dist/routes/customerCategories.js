"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const customerCategoryController_1 = require("../controllers/customerCategoryController");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, customerCategoryController_1.getCustomerCategories)
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), customerCategoryController_1.createCustomerCategory);
router.route('/:id')
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), customerCategoryController_1.updateCustomerCategory)
    .delete(auth_1.protect, (0, auth_1.authorize)('admin'), customerCategoryController_1.deleteCustomerCategory);
exports.default = router;
