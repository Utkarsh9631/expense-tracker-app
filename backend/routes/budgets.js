const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { 
  getBudgets, 
  addBudget, 
  updateBudget, 
  deleteBudget 
} = require('../controllers/budgetController');

// @route   GET /api/budgets
// @desc    Get all budgets for a user
router.get('/', auth, getBudgets);

// @route   POST /api/budgets
// @desc    Add a new budget
router.post('/', auth, addBudget);

// @route   PUT /api/budgets/:id
// @desc    Update a budget
router.put('/:id', auth, updateBudget);

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
router.delete('/:id', auth, deleteBudget);

module.exports = router;