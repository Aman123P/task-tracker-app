const Task = require('../models/Task');
exports.getTasks = (req, res) => {
  const projectId = req.params.projectId;
  console.log('Project ID:', projectId);
    Task.find({ projectId })
      .then((tasks) => {
        res.render('tasks', { projectId, tasks });
      })
      .catch((err) => {
        console.error(err);
        res.send('Error loading tasks');
      });

};

exports.postTask = (req, res) => {
  const { title, description, status } = req.body;
  const projectId = req.params.projectId;

  const task = new Task({ title, description, status, projectId });

  if (status === 'Completed') {
    task.completedAt = new Date();
  }

  task
    .save()
    .then(() => res.redirect(`/projects/${projectId}/tasks`))
    .catch((err) => {
      console.error(err);
      res.send('Error saving task');
    });
};

exports.getEditTask = (req, res) => {
  Task.findById(req.params.taskId)
    .then((task) => {
      res.render('editTask', { task });
    })
    .catch((err) => {
      console.error(err);
      res.send('Error loading task');
    });
};

exports.postEditTask = (req, res) => {
  const { title, description, status } = req.body;
  const { taskId } = req.params;

  Task.findById(taskId)
    .then((task) => {
      task.title = title;
      task.description = description;
      task.status = status;
      task.completedAt = status === 'Completed' ? new Date() : null;

      return task.save();
    })
    .then((task) => res.redirect(`/projects/${task.projectId}/tasks`))
    .catch((err) => {
      console.error(err);
      res.send('Error updating task');
    });
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
