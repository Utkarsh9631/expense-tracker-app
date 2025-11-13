const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get user profile (name, email, currency)
// @route   GET /api/users/me
exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id is attached by the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user profile (name, email, currency)
// @route   PUT /api/users/me
// @desc    Update user profile (name, email, currency)
// @route   PUT /api/users/me
exports.updateUserProfile = async (req, res) => {
  const { name, email, currency } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
      user.email = email;
    }

    // Update fields
    user.name = name || user.name;
    user.currency = currency || user.currency;

    const updatedUser = await user.save();

    // --- THIS IS THE FIX ---
    // We cannot call .select() on the saved document.
    // Instead, we create a new object to send back.
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      currency: updatedUser.currency,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
    // --- END OF FIX ---

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Change user password
// @route   PUT /api/users/password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ msg: 'Please provide old and new passwords' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials (old password)' });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};