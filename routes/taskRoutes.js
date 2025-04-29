const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

router.get('/projects/:projectId/tasks', auth, taskController.getTasks);
router.post('/projects/:projectId/tasks', auth, taskController.postTask);

router.get('/tasks/:taskId/edit', auth, taskController.getEditTask);
router.post('/tasks/:taskId/edit', auth, taskController.postEditTask);

router.post('/tasks/:taskId/delete', auth, taskController.deleteTask);

module.exports = router;
