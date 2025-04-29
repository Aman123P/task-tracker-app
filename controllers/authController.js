
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getSignup = (req, res) => {
  res.render('register');
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postSignup = (req, res) => {
  const { name, email, password, country } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = new User({ name, email, password: hashedPassword, country });
      return user.save();
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.error(err);
      res.send('User already exists or error occurred');
    });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send('User not found');
        return;
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          res.send('Invalid credentials');
          return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });

        user.sessionToken = token;
        user.save().then(() => {
          req.session.token = token;
          res.redirect('/dashboard');
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.send('Login error');
    });
};

exports.logout = (req, res) => {
  if (req.session.token && req.user) {
    User.findByIdAndUpdate(req.user.id, { sessionToken: null }).then(() => {
      req.session.destroy(() => {
        res.redirect('/login');
      });
    });
  } else {
    res.redirect('/login');
  }
};


