// services/taskService.js


class TaskService {
     constructor(taskDao) {
        this.taskDao = taskDao;
    }
    // get all tasks of a specific user

  async getAllTasksForUser(userId,queryOptions) {
    return this.taskDao.findByUserId(userId,queryOptions);
  }

// get a single task by its ID for a specific user
  async getTaskById(taskId, userId) {
    return this.taskDao.findById(taskId, userId);
  }
    // Create a new task
  async createTask(taskDetails, userId) {
    if (!taskDetails.title) {
      throw new Error('Title is a required field.');
    }
    const newTask = await this.taskDao.create(taskDetails, userId);
    return newTask;
  }

  // Update an existing task
  async updateTask(taskId, taskUpdates, userId) {
    return this.taskDao.update(taskId, taskUpdates, userId);
  }

  // Delete a task
  async deleteTask(taskId, userId) {
    return this.taskDao.delete(taskId, userId);
  }
}

module.exports = TaskService;