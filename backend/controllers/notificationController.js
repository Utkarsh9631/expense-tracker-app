const Notification = require('../models/Notification');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// --- Helper: Get Date Range for a Budget ---
const getBudgetRange = (period) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (period === 'weekly') {
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else if (period === 'monthly') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(now.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
  } else if (period === 'yearly') {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(11, 31);
    end.setHours(23, 59, 59, 999);
  }
  return { start, end };
};

// --- CRON JOB LOGIC: Check Budgets ---
exports.checkBudgets = async () => {
  console.log('Running scheduled budget check...');
  try {
    const budgets = await Budget.find(); // Get all budgets

    for (const budget of budgets) {
      const { start, end } = getBudgetRange(budget.period);

      // 1. Calculate spending for this budget's category & period
      // Note: If category is "Overall", we sum ALL expenses for that user
      const query = {
        user: budget.user,
        date: { $gte: start, $lte: end },
      };
      
      if (budget.category !== 'Overall') {
        query.category = budget.category;
      }

      const expenses = await Expense.find(query);
      const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

      // 2. Check Thresholds (e.g., 80% warning, 100% exceeded)
      const percentUsed = (totalSpent / budget.amount) * 100;
      let type = null;
      let message = null;

      if (percentUsed >= 100) {
        type = 'danger';
        message = `You have exceeded your ${budget.period} budget for ${budget.category}! Spent: $${totalSpent.toFixed(2)} / $${budget.amount}`;
      } else if (percentUsed >= 80) {
        type = 'warning';
        message = `Heads up! You've used ${percentUsed.toFixed(0)}% of your ${budget.period} budget for ${budget.category}.`;
      }

      // 3. Create Notification if needed
      if (type) {
        // Avoid Spam: Check if we already sent a notification for this budget in the last 24 hours
        const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
        const existingNotif = await Notification.findOne({
          user: budget.user,
          relatedBudget: budget._id,
          type: type,
          createdAt: { $gte: oneDayAgo },
        });

        if (!existingNotif) {
          await Notification.create({
            user: budget.user,
            message,
            type,
            relatedBudget: budget._id,
          });
          console.log(`Notification created for user ${budget.user}`);
        }
      }
    }
  } catch (err) {
    console.error('Error checking budgets:', err);
  }
};

// --- API: Get Notifications ---
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// --- API: Mark as Read ---
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ msg: 'Marked as read' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// --- API: Clear All ---
exports.clearNotifications = async (req, res) => {
    try {
      await Notification.deleteMany({ user: req.user.id });
      res.json({ msg: 'Notifications cleared' });
    } catch (err) {
      res.status(500).send('Server Error');
    }
  };