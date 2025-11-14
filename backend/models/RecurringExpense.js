const mongoose = require('mongoose');

const RecurringExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  // This field is CRUCIAL. It tracks the last time we created an expense.
  lastProcessedDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

// --- THIS IS THE CRITICAL LINE THAT WAS MISSING ---
module.exports = mongoose.model('RecurringExpense', RecurringExpenseSchema);