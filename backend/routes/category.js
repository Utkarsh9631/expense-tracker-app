const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getCategories, addCategory, deleteCategory } = require('../controllers/categoryController');

// @route   GET /api/categories
// @desc    Get all categories for a user
router.get('/', auth, getCategories);

// @route   POST /api/categories
// @desc    Add a new category
router.post('/', auth, addCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
router.delete('/:id', auth, deleteCategory);

module.exports = router;