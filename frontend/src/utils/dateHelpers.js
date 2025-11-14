// Gets the start and end of the current week (Sun - Sat)
function getWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay()); // Go back to Sunday
  start.setHours(0, 0, 0, 0); // Start of the day

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Go forward to Saturday
  end.setHours(23, 59, 59, 999); // End of the day

  return { start, end };
}

// Gets the start and end of the current month
function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Day 0 of next month is last day of current
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

// Gets the start and end of the current year
function getYearRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1); // Jan 1st
  start.setHours(0, 0, 0, 0);

  const end = new Date(now.getFullYear(), 11, 31); // Dec 31st
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Main helper function
 * @param {string} period - 'weekly', 'monthly', or 'yearly'
 * @returns {{startDate: Date, endDate: Date}}
 */
export function getPeriodDateRange(period) {
  switch (period) {
    case 'weekly':
      return getWeekRange();
    case 'monthly':
      return getMonthRange();
    case 'yearly':
      return getYearRange();
    default:
      return getMonthRange(); // Default to monthly
  }
}