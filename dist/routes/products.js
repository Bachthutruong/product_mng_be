"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const upload_1 = __importDefault(require("../middleware/upload"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, productController_1.getProducts)
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), productController_1.createProduct);
router.route('/categories')
    .get(auth_1.protect, productController_1.getProductCategories)
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), productController_1.createProductCategory);
router.route('/categories/:id')
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), productController_1.updateProductCategory)
    .delete(auth_1.protect, (0, auth_1.authorize)('admin'), productController_1.deleteProductCategory);
router.route('/:id')
    .get(auth_1.protect, productController_1.getProduct)
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), productController_1.updateProduct)
    .delete(auth_1.protect, (0, auth_1.authorize)('admin'), productController_1.deleteProduct);
router.route('/:id/images')
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), upload_1.default.array('images', 5), productController_1.uploadProductImages);
router.delete('/:id/images/:imageId', auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), productController_1.deleteProductImage);
router.put('/:id/images/:imageId/primary', auth_1.protect, (0, auth_1.authorize)('admin', 'employee'), productController_1.setPrimaryProductImage);
exports.default = router;
