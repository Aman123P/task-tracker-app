const Project = require('../models/Project');

exports.getProjects = (req, res) => {
  Project.find({ userId: req.user.id })
    .then((projects) => {
        console.log('Loaded Projects:', projects);
      res.render('project', { projects });
    })
    .catch((err) => {
      console.error(err);
      res.send('Error loading projects');
    });
};

exports.postProject = (req, res) => {
  const name = req.body.name;
  const userId = req.user.id;

  Project.countDocuments({ userId }).then((count) => {
    if (count >= 4) {
      return res.send('You can create up to 4 projects only.');
    }

    const project = new Project({ name, userId });
    project
      .save()
      .then(() => res.redirect('/projects'))
      .catch((err) => {
        console.error(err);
        res.send('Error saving project');
      });
  });
};
