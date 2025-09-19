const express = require('express');
const db = require('../dataStore'); // Knex instance
const TaskDao = require('../dao/taskDao');
const TaskService = require('../services/taskService');
const TaskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

const taskRouter = express.Router();

// get instance of a controller to user it
const taskDao = new TaskDao(db);
const taskService = new TaskService(taskDao);
const taskController = new TaskController(taskService);

// Apply authentication middleware to all task routes
taskRouter.use(authMiddleware);

// GET /api/tasks -> Get all tasks for the logged-in user (with filtering/pagination)
taskRouter.get('/', taskController.getMyTasks.bind(taskController));

// POST /api/tasks -> Create a new task
taskRouter.post('/', taskController.createTask.bind(taskController));

// GET /api/tasks/:id -> Get a single one of my tasks by its ID
taskRouter.get('/:id', taskController.getTaskById.bind(taskController));

// PUT /api/tasks/:id -> Update one of my tasks
taskRouter.put('/:id', taskController.updateTask.bind(taskController));

// DELETE /api/tasks/:id -> Delete one of my tasks
taskRouter.delete('/:id', taskController.deleteTask.bind(taskController));

module.exports = taskRouter;