const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getTasks = async (req, res) => {
  const { projectId } = req.params;
  const tasks = await Task.find({ projectId }).populate('assignedTo');
  const users = await User.find({}, 'name'); // get all users' names and IDs

  res.render('tasks', { tasks, projectId, users });
};

exports.postTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, assignedTo } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    projectId,
    assignedTo,
    createdBy: req.session.user._id,
  });

  if (assignedTo !== req.session.user._id.toString()) {
    await Notification.create({
      userId: assignedTo,
      message: `You have been assigned a new task: "${title}"`,
    });
  }

  res.redirect(`/projects/${projectId}/tasks`);
};

exports.getEditTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const users = await User.find();
    res.render('editTask', { task, users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading task');
  }
};


exports.postEditTask = async (req, res) => {
  const { title, description, status, dueDate, priority, assignedTo } =
    req.body;

  try {
    const task = await Task.findById(req.params.taskId);

    task.title = title;
    task.description = description;
    task.status = status;
    task.dueDate = dueDate || null;
    task.priority = priority;
    task.assignedTo = assignedTo || null;

    if (status === 'Completed') {
      task.completedAt = new Date();
    }

    await task.save();
    res.redirect(`/projects/${task.projectId}/tasks`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating task');
  }
};


exports.deleteTask = (req, res) => {
  Task.findByIdAndDelete(req.params.taskId)
    .then((task) => {
      res.redirect(`/projects/${task.projectId}/tasks`);
    })
    .catch((err) => {
      console.error(err);
      res.send('Error deleting task');
    });
};
