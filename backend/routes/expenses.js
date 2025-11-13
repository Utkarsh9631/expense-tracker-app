const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // <-- Import our middleware

// Import the controller functions
const { getExpenses, addExpense } = require('../controllers/expenseController');

// --- Define Routes ---

// @route   GET /api/expenses
// @desc    Get all expenses for a user
// By adding 'auth' here, we make this route protected.
router.get('/', auth, getExpenses);

// @route   POST /api/expenses
// @desc    Add a new expense
// This route is also protected.
router.post('/', auth, addExpense);

module.exports = router;