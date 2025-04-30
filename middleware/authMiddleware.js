const jwt = require('jsonwebtoken');
const User = require('../models/User'); // zaroori hai

module.exports = async (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.sessionToken !== token) {
      return res.redirect('/login');
    }

    req.user = decoded; // ya req.user = user to get full user
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.redirect('/login');
  }
};
