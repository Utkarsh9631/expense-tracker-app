const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'danger'], // warning = close to limit, danger = exceeded
    default: 'info',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  relatedBudget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', NotificationSchema);