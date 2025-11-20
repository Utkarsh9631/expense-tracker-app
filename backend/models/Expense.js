const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // --- NEW FIELD ---
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense',
    required: true,
  },
  // ----------------
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
  date: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Expense', ExpenseSchema);