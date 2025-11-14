const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // <-- Import our middleware

// Import the controller functions
const { getExpenses, addExpense, deleteExpense,updateExpense } = require('../controllers/expenseController');

// --- Define Routes ---

// @route   GET /api/expenses
// @desc    Get all expenses for a user
// By adding 'auth' here, we make this route protected.
router.get('/', auth, getExpenses);

// @route   POST /api/expenses
// @desc    Add a new expense
// This route is also protected.
router.post('/', auth, addExpense);

// --- ADD THIS ROUTE ---
// @route   PUT /api/expenses/:id
// @desc    Update an expense
router.put('/:id', auth, updateExpense);

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
router.delete('/:id', auth, deleteExpense);

module.exports = router;