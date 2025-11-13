const Expense = require('../models/Expense');

// @desc    Get all expenses for a user
// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    // This is the magic!
    // We find expenses where the 'user' field matches the ID
    // from our auth middleware (req.user.id).
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new expense for a user
// @route   POST /api/expenses
exports.addExpense = async (req, res) => {
  const { description, amount, category, date } = req.body;

  try {
    const newExpense = new Expense({
      description,
      amount,
      category,
      date,
      user: req.user.id, // <-- Here we link the expense to the user
    });

    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    // Check that the user owns this expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Find and remove the expense
    await Expense.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    res.status(500).send('Server Error');
  }
};