const RecurringExpense = require('../models/RecurringExpense');
const Expense = require('../models/Expense'); // We need this to create new expenses

// @desc    Get all recurring expenses for a user
// @route   GET /api/recurring
exports.getRecurringExpenses = async (req, res) => {
  try {
    const recurring = await RecurringExpense.find({ user: req.user.id }).sort({ startDate: 1 });
    res.json(recurring);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new recurring expense
// @route   POST /api/recurring
exports.addRecurringExpense = async (req, res) => {
  const { description, amount, category, frequency, startDate } = req.body;

  try {
    const newRecurring = new RecurringExpense({
      user: req.user.id,
      description,
      amount,
      category,
      frequency,
      startDate: new Date(startDate),
      lastProcessedDate: null, // It hasn't been processed yet
    });

    const recurring = await newRecurring.save();
    res.status(201).json(recurring);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a recurring expense
// @route   DELETE /api/recurring/:id
exports.deleteRecurringExpense = async (req, res) => {
  try {
    const recurring = await RecurringExpense.findById(req.params.id);

    if (!recurring) {
      return res.status(404).json({ msg: 'Recurring expense not found' });
    }
    if (recurring.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await RecurringExpense.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Recurring expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Process recurring expenses and create new Expense entries
// @route   POST /api/recurring/process
exports.processRecurringExpenses = async (req, res) => {
  const now = new Date();
  let expensesCreatedCount = 0;

  try {
    const subscriptions = await RecurringExpense.find({ user: req.user.id });

    for (const sub of subscriptions) {
      // Determine the date to start checking from
      const checkFrom = sub.lastProcessedDate || sub.startDate;
      let nextDueDate = new Date(checkFrom);

      // Set 'nextDueDate' to the *next* billing cycle
      if (sub.lastProcessedDate) { // If it's been processed, advance to next cycle
        if (sub.frequency === 'monthly') {
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        } else if (sub.frequency === 'yearly') {
          nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        }
      } else {
        // If it's brand new, the first due date is the startDate
        nextDueDate = new Date(sub.startDate);
      }
      
      // Loop: As long as the next due date is in the past or today,
      // create the expense and check again.
      while (nextDueDate <= now) {
        // 1. Create the new expense
        const newExpense = new Expense({
          user: sub.user,
          description: sub.description,
          amount: sub.amount,
          category: sub.category,
          date: new Date(nextDueDate), // The date the expense was due
        });
        await newExpense.save();
        expensesCreatedCount++;

        // 2. Update the subscription's lastProcessedDate
        sub.lastProcessedDate = new Date(nextDueDate);
        
        // 3. Calculate the *next* due date for the loop
        if (sub.frequency === 'monthly') {
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        } else if (sub.frequency === 'yearly') {
          nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        }
      }
      
      // Save any changes to lastProcessedDate
      await sub.save();
    }

    res.json({ msg: 'Processing complete', expensesCreated: expensesCreatedCount });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};