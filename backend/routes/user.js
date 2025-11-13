const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
} = require('../controllers/userController');

// @route   GET /api/users/me
// @desc    Get current user's profile
router.get('/me', auth, getUserProfile);

// @route   PUT /api/users/me
// @desc    Update current user's profile
router.put('/me', auth, updateUserProfile);

// @route   PUT /api/users/password
// @desc    Change current user's password
router.put('/password', auth, changePassword);

module.exports = router;