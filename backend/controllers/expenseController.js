const Expense = require('../models/Expense');

// @desc    Get all expenses for a user (with optional date filtering)
// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build the query object
    let query = { user: req.user.id };

    // If dates are provided, add date filter to the query
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate); // Greater than or equal to start date
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);   // Less than or equal to end date
      }
    }

    // Find expenses matching the query
    const expenses = await Expense.find(query).sort({ date: -1 });
    
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ... imports

exports.addExpense = async (req, res) => {
  // 1. Destructure 'type' from the body
  const { description, amount, category, date, type } = req.body;

  try {
    const newExpense = new Expense({
      description,
      amount,
      category,
      date,
      type: type || 'expense', // Default to expense if not provided
      user: req.user.id,
    });

    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateExpense = async (req, res) => {
  // 1. Destructure 'type' here too
  const { description, amount, category, date, type } = req.body;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    if (expense.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    // 2. Update fields
    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    // Update type if provided
    if (type) expense.type = type; 

    const updatedExpense = await expense.save();
    res.json(updatedExpense);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ... rest of the file (getExpenses, deleteExpense) remains the same

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