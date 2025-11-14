const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library'); // <-- Import
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // <-- Initialize
// Load env vars
dotenv.config();

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  // 1. Get name, email, and password from the request body
  const { name, email, password } = req.body;

  try {
    // 2. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 3. If not, create a new user instance
    user = new User({
      name,
      email,
      password,
    });

    // 4. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Save the user to the database
    await user.save();

    // 6. Create and return a JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' }, // Token expires in 30 days
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token }); // Send token back to client
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  // 1. Get email and password from request body
  const { email, password } = req.body;

  try {
    // 2. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. User exists, now compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 4. Passwords match, create and return JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Auth user with Google
// @route   POST /api/auth/google-login
exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Verify the token from Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, sub } = ticket.getPayload(); // 'sub' is Google's unique ID

    // 2. Find or create the user
    let user = await User.findOne({ email });

    if (user) {
      // User exists, log them in
    } else {
      // User doesn't exist, create a new one
      // We add a random/temp password because our User model requires one
      const randomPassword = sub + process.env.JWT_SECRET; // A simple unique-ish password

      user = new User({
        name,
        email,
        password: randomPassword, // This password won't be used for login
      });

      // We must hash the "password" just to store it
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
    }

    // 3. Create YOUR app's JWT (just like in your normal login)
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
      (err, appToken) => {
        if (err) throw err;
        // 4. Send YOUR token back to the frontend
        res.json({ token: appToken });
      }
    );

  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Google token is invalid' });
  }
};