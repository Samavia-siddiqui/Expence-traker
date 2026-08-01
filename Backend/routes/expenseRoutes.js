import express from 'express';
import {
  addExpense,
  getGroupExpenses,
  deleteExpense,
  getGroupBalances,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected by auth middleware
router.use(protect);

router.post('/', addExpense);
router.get('/group/:groupId', getGroupExpenses);
router.get('/group/:groupId/balances', getGroupBalances);
router.delete('/:id', deleteExpense);

export default router;
