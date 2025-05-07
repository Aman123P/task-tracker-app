const Task = require('../models/Task');
const Notification = require('../models/Notification');

exports.getDashboard = async (req, res) => {
  const userId = req.session.user._id;
  const searchQuery = req.query.search || '';

  // Common search condition (works for all three queries)
  const searchFilter = searchQuery
    ? { title: { $regex: searchQuery, $options: 'i' } }
    : {};

  // 1. Assigned Tasks (with search)
  const assignedTasks = await Task.find({
    assignedTo: userId,
    ...searchFilter, // Spread the search condition
  }).populate('projectId');

  // 2. Created Tasks (with search)
  const createdTasks = await Task.find({
    createdBy: userId,
    ...searchFilter, // Same search condition applied
  }).populate('projectId');

  // 3. Overdue Tasks (with search)
  const overdueTasks = await Task.find({
    assignedTo: userId,
    dueDate: { $lt: new Date() },
    status: { $ne: 'Completed' },
    ...searchFilter, // Applied here too
  }).populate('projectId');

  // Notifications (unrelated to search)
  const notifications = await Notification.find({
    userId,
    isRead: false,
  });
  console.log('Assigned Tasks Query:', { assignedTo: userId, ...searchFilter });
  console.log('Created Tasks Query:', { createdBy: userId, ...searchFilter });
  console.log('Overdue Tasks Query:', {
    assignedTo: userId,
    dueDate: { $lt: new Date() },
    status: { $ne: 'Completed' },
    ...searchFilter,
  });

  res.render('dashboard', {
    user: req.user,
    assignedTasks,
    createdTasks,
    overdueTasks,
    notifications,
    searchQuery,
  });
};
