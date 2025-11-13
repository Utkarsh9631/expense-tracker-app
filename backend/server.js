// Import packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

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

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});