import express from 'express';
import { protect } from '@/middleware/auth';

const router = express.Router();

router.post('/reorder-suggestions', protect, (_req, res) => {
  res.json({ success: true, message: 'AI reorder suggestions - to be implemented' });
});

export default router; 