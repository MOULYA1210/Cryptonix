// server/routes/toolRoutes.js
import express from 'express';
import {
  generateHashHandler,
  analyzePassword,
  generatePassword,
  getToolHistory,
  saveToolUsage,
} from '../controllers/toolController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public tool routes
router.post('/hash',              generateHashHandler);
router.post('/analyze-password',  analyzePassword);
router.post('/generate-password', generatePassword);

// Protected routes — must be logged in
router.get('/history',  protect, getToolHistory);
router.post('/save-usage', protect, saveToolUsage);

export default router;