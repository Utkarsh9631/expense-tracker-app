const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Add a compound index to ensure a user cannot have two categories with the same name
// (Optional, but good practice)
CategorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);