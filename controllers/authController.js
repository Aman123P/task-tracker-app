const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.getSignup = (req, res) => {
  res.render('register');
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postSignup = async (req, res) => {
  try {
    const { name, email, password, country } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, country });
    await user.save();

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.send('Signup error');
  }
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        console.log('User not found');
        return res.redirect('/login'); // instead of res.send
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          console.log('Invalid password');
          return res.redirect('/login');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });

        user.sessionToken = token;

        user.save().then(() => {
          req.session.user = user; // ✅ store full user
          req.session.token = token; // ✅ store token
          console.log('Login success. Redirecting to dashboard...');
          return res.redirect('/');
        });
      });
    })
    .catch((err) => {
      console.error('Login error:', err);
      return res.redirect('/login');
    });
};


exports.logout = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
};