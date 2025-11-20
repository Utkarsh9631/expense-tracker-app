// Import packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const { checkBudgets } = require('./controllers/notificationController');

// Load environment variables from .env file
dotenv.config();
connectDB();

// Initialize express app
const app = express();

// --- Middleware ---
// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());
app.use('/api/notifications', require('./routes/notifications'));// <-- Add Notification Route
// --- Cron Job ---
// Schedule the budget check to run every hour (0 * * * *)
// You can change this to '*/5 * * * *' for every 5 minutes during testing
cron.schedule('0 * * * *', () => {
  checkBudgets();
});
// --- Basic Route ---
// A test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('Backend API is running...');
});
// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/users', require('./routes/user'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/recurring', require('./routes/recurring'));
// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});