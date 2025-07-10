"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/reorder-suggestions', auth_1.protect, (_req, res) => {
    res.json({ success: true, message: 'AI reorder suggestions - to be implemented' });
});
exports.default = router;
