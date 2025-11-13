const Budget = require('../models/Budget');

// @desc    Get all budgets for a user
// @route   GET /api/budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new budget for a user
// @route   POST /api/budgets
exports.addBudget = async (req, res) => {
  const { category, amount, period } = req.body;

  try {
    const newBudget = new Budget({
      category,
      amount,
      period,
      user: req.user.id, // Link to the logged-in user
    });

    const budget = await newBudget.save();
    res.status(201).json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};