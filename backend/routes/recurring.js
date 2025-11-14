const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getRecurringExpenses,
  addRecurringExpense,
  deleteRecurringExpense,
  processRecurringExpenses
} = require('../controllers/recurringExpenseController');

// @route   GET /api/recurring
// @desc    Get all recurring expenses
router.get('/', auth, getRecurringExpenses);

// @route   POST /api/recurring
// @desc    Add a recurring expense
router.post('/', auth, addRecurringExpense);

// @route   DELETE /api/recurring/:id
// @desc    Delete a recurring expense
router.delete('/:id', auth, deleteRecurringExpense);

// @route   POST /api/recurring/process
// @desc    Check and create any due expenses
router.post('/process', auth, processRecurringExpenses);

module.exports = router;