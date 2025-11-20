const Budget = require('../models/Budget');

// @desc    Get all budgets for a user
// @route   GET /api/budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new budget
// @route   POST /api/budgets
exports.addBudget = async (req, res) => {
  const { category, amount, period } = req.body;

  try {
    const newBudget = new Budget({
      category,
      amount,
      period,
      user: req.user.id,
    });

    const budget = await newBudget.save();
    res.status(201).json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- NEW FUNCTIONS ---

// @desc    Update a budget
// @route   PUT /api/budgets/:id
exports.updateBudget = async (req, res) => {
  const { category, amount, period } = req.body;

  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) return res.status(404).json({ msg: 'Budget not found' });

    // Check user
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { $set: { category, amount, period } },
      { new: true }
    );

    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) return res.status(404).json({ msg: 'Budget not found' });

    // Check user
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Budget removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};  