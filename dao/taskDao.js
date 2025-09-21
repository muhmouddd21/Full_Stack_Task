// get all tasks for a specific user
// get all tasks

class TaskDao {

  constructor(db) {
    this.db = db;
  }

  // get all tasks for a specific user
  // filter && pagination && search
  // default value if not passed is 10
  async findByUserId(userId, { status, q, limit = 10, page = 1 } = {}) {
    const offset = (page - 1) * limit;

    const query = this.db('tasks').where({ user_id: userId });

    // filter by status
    if (status) {
      query.andWhere({ status });
    }

    // Apply search query 
    if (q) {
      query.andWhere(function() {
        this.where('title', 'like', `%${q}%`)
            .orWhere('description', 'like', `%${q}%`);
      });
    }

    // query.clone => get a copy of the above query
    const countQuery = query.clone().count('* as total').first();
    const { total } = await countQuery;

    // Then, apply limit, offset, and ordering to get the actual data for the page
    const data = await query
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');

    return {
      total: parseInt(total, 10),
      page,
      limit,
      data,
    };
  }

    // get the first task that matches the id and belongs to the user
  findById(taskId, userId) {
    return this.db('tasks').where({ id: taskId, user_id: userId }).first();
  }
    // Create a new task and return the created task object
  async create(taskDetails, userId) {
    const [insertedId] = await this.db("tasks").insert({
      ...taskDetails,
      user_id: userId,
    });

    // get the new inserted row
    const newTask = await this.db("tasks")
      .where({ id: insertedId })
      .first();

    return newTask;
  }

    // Update task details and return the updated task object
  async update(taskId, taskUpdates, userId) {
      const allowedUpdates = {
      title: taskUpdates.title,
      description: taskUpdates.description,
      status: taskUpdates.status,
      due_date: taskUpdates.due_date,
      updated_at: this.db.fn.now(),
    };
    await this.db('tasks')
      .where({ id: taskId, user_id: userId })
      .update(allowedUpdates)
      
      // get the updated task
      const updatedTask = await this.db("tasks")
      .where({ id: taskId, user_id: userId })
      .first();

  return updatedTask;
  }
  // Delete a task by ID and user ID. Returns the number of rows deleted (0 or 1).
  delete(taskId, userId) {
    return this.db('tasks').where({ id: taskId, user_id: userId }).del();
  }
}

module.exports = TaskDao;