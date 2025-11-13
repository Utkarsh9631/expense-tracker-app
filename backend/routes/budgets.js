const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware

const { getBudgets, addBudget } = require('../controllers/budgetController');

// @route   GET /api/budgets
// @desc    Get all budgets for a user
router.get('/', auth, getBudgets);

// @route   POST /api/budgets
// @desc    Add a new budget
router.post('/', auth, addBudget);

module.exports = router;