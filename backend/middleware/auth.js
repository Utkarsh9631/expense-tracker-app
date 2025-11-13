const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function (req, res, next) {
  // 1. Get token from the header
  const authHeader = req.header('Authorization');
  
  // 2. Check if "Bearer " token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 3. Get the token part
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using your JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //

    // 5. IMPORTANT: Add the user's ID from the token to the request object
    // Now all our protected routes will know *who* the user is
    req.user = decoded.user;
    
    // 6. Move on to the next function (the actual route logic)
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};