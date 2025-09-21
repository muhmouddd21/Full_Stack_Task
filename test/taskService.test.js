const { expect } = require('chai');
const sinon = require('sinon'); // just a library that make a fake taskdao
const TaskService = require('../services/taskService'); 

describe('TaskService', () => {
  let taskDao;
  let taskService;

  // Runs before each test in this block
  beforeEach(() => {
    // Create a mock object for the DAO
    taskDao = {
      findByUserId: sinon.stub(),
      findById: sinon.stub(),
      create: sinon.stub(),
      update: sinon.stub(),
      delete: sinon.stub(),
    };
    // Initialize the service with the mock DAO
    taskService = new TaskService(taskDao);
  });

  // Test case for getAllTasksForUser
  describe('getAllTasksForUser', () => {
    it('should return all tasks for a specific user', async () => {
      const userId = 'user123';
      const expectedTasks = [{ id: 'task1', title: 'Test Task' }];
      

      // fake database
      // Configure the mock to return a specific value
      // when i call findByUserId with these args return expectedTasks
      taskDao.findByUserId.withArgs(userId, {}).resolves(expectedTasks); //resolves return a promise

      const tasks = await taskService.getAllTasksForUser(userId, {});
      
      // Assert that the result is what we expect
      expect(tasks).to.deep.equal(expectedTasks);

      // Verify that the DAO method was called correctly
      expect(taskDao.findByUserId.calledOnceWith(userId, {})).to.be.true;
    });
  });

  // Test case for getTaskById
  describe('getTaskById', () => {
    it('should return a single task by its ID for a user', async () => {
      const taskId = 'task1';
      const userId = 'user123';
      const expectedTask = { id: taskId, title: 'A specific task' };

      taskDao.findById.withArgs(taskId, userId).resolves(expectedTask);

      const task = await taskService.getTaskById(taskId, userId);

      expect(task).to.deep.equal(expectedTask);
      expect(taskDao.findById.calledOnceWith(taskId, userId)).to.be.true;
    });
  });

  // Test case for createTask
  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const userId = 'user123';
      const taskDetails = { title: 'New Task', description: 'A description' };
      const createdTask = { id: 'taskNew', ...taskDetails };

      taskDao.create.withArgs(taskDetails, userId).resolves(createdTask);

      const newTask = await taskService.createTask(taskDetails, userId);

      expect(newTask).to.deep.equal(createdTask);
      expect(taskDao.create.calledOnceWith(taskDetails, userId)).to.be.true;
    });

    it('should throw an error if there is no title', async () => {
      const userId = 'user123';
      const taskDetails = { description: 'no title' };

      try {
        await taskService.createTask(taskDetails, userId);
        // If it doesn't throw, the test should fail
        throw new Error('Test failed: expected an error to be thrown.');
      } catch (error) {
        expect(error.message).to.equal('Title is a required field.');
        // Ensure the DAO create method was not called
        expect(taskDao.create.notCalled).to.be.true;
      }
    });
  });

  // Test suite for updateTask
  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const taskId = 'task1';
      const userId = 'user123';
      const taskUpdates = { title: 'Updated Title' };
      const updatedTask = { id: taskId, ...taskUpdates };

      taskDao.update.withArgs(taskId, taskUpdates, userId).resolves(updatedTask);

      const result = await taskService.updateTask(taskId, taskUpdates, userId);

      expect(result).to.deep.equal(updatedTask);
      expect(taskDao.update.calledOnceWith(taskId, taskUpdates, userId)).to.be.true;
    });
  });

  // Test case for deleteTask
  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = 'task1';
      const userId = 'user123';
      const deleteResult = { success: true };

      taskDao.delete.withArgs(taskId, userId).resolves(deleteResult);

      const result = await taskService.deleteTask(taskId, userId);

      expect(result).to.deep.equal(deleteResult);
      expect(taskDao.delete.calledOnceWith(taskId, userId)).to.be.true;
    });
  });
});