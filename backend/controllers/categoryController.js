const Category = require('../models/Category');

// @desc    Get all categories for a user
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new category
// @route   POST /api/categories
exports.addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: 'Please provide a category name' });
  }

  try {
    // Check if category already exists for this user
    let category = await Category.findOne({ user: req.user.id, name });
    if (category) {
      return res.status(400).json({ msg: 'Category already exists' });
    }

    const newCategory = new Category({
      name,
      user: req.user.id,
    });

    category = await newCategory.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Check that the user owns this category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
};