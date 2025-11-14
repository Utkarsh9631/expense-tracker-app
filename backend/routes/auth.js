const express = require('express');
const router = express.Router();
// Import the controller functions
const { registerUser, loginUser, googleLogin } = require('../controllers/authController');

// --- Define Routes ---

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user (login)
router.post('/login', loginUser);

// @route   POST /api/auth/google-login
// @desc    Authenticate user via Google
router.post('/google-login', googleLogin);

module.exports = router;