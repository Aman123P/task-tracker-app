
exports.getDashboard = (req, res) => {
  console.log('User in dashboard:', req.user);

  res.render('dashboard', { user: req.user });
};
