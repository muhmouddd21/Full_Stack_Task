class TaskController {
  constructor(taskService) {
    this.taskService = taskService;
  }

  async getMyTasks(req, res) {
    try {
      const userId = req.user.id;

      const queryOptions = {
        status: req.query.status,
        q: req.query.q,
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const result = await this.taskService.getAllTasksForUser(userId, queryOptions);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  }


  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const task = await this.taskService.getTaskById(id, userId);

      if (!task) {
        return res.status(404).json({ message: 'Task not found ' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
  }

 

  async createTask(req, res) {
    try {
      const taskDetails = req.body;
      const userId = req.user.id;
      const newTask = await this.taskService.createTask(taskDetails, userId);
      res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
      if (error.message.includes('required field')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error creating task', error: error.message });
    }
  }

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const taskUpdates = req.body;
      const userId = req.user.id;
      const updatedTask = await this.taskService.updateTask(id, taskUpdates, userId);
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found or you do not have permission to update it' });
      }
      res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
      res.status(500).json({ message: 'Error updating task', error: error.message });
    }
  }

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const deletedCount = await this.taskService.deleteTask(id, userId);
      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
      }
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
  }
}

module.exports = TaskController;