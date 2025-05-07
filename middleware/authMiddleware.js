const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.session.token;

  if (!token || !req.session.user) {
    console.log('No token or user in session. Redirecting to login.');
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.sessionToken !== token) {
      console.log('User not found or token mismatch. Redirecting to login.');
      return res.redirect('/login');
    }

    req.user = user; // set full user on req
    next();
  } catch (err) {
    console.error('AuthMiddleware error:', err.message);
    return res.redirect('/login');
  }
};
