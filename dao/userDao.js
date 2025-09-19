class UserDao {
  // Get DB => a Knex instance.
  constructor(db) {
    this.db = db;
  }

  // get the first user that matches the id
  async findById(id) {
    return this.db('users').where({ id }).first();
  }

  // get the first user that matches the email
  async findByEmail(email) {
    return this.db('users').where({ email }).first();
  }

    // get the first user that matches the username
  async findByUsername(username) {
    return this.db('users').where({ username }).first();
  }

  // Create a new user and return the created user object
  async create(userDetails) {
    const [id] = await this.db('users').insert(userDetails);
    return this.findById(id);
  }
// Update user details and return the updated user object
  async update(id, userUpdates) {
    const updatedCount = await this.db('users')
      .where({ id })
      .update(userUpdates);

    // if it is a truthy value it means the user was found and updated
    if (updatedCount) {
      return this.findById(id);
    }
    // Otherwise, the user was not found.
    return undefined;
  }
  // Delete a user by ID. Returns the number of rows deleted (0 or 1).
  async delete(id) {
    return this.db('users').where({ id }).del();
  }

  // Check if an email is already in use. Returns the email if found, otherwise undefined.
  async checkAvailabilityOfEmail(email) {
    const result = await this.db('users').select('email').where({ email }).first();
    return result ? result.email : undefined;
  }
  // Check if a username is already in use. Returns the username if found, otherwise undefined.
  async getUserByRefreshToken(refreshToken) {
    const user = await this.db('users')
      .join('refresh_tokens', 'users.id', 'refresh_tokens.user_id')
      .where('refresh_tokens.token', refreshToken)
      .andWhere('refresh_tokens.expires_at', '>', new Date())
      .select('users.*')
      .first();

    return user;
  }


  // store refresh token in the database [ i made it 14 days]
  async storeRefreshToken(refreshToken, userId) {
    const expires_at = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await this.db('refresh_tokens').insert({
      token: refreshToken,
      user_id: userId,
      expires_at: expires_at
    });
  }
  // when the user logs out or we want to
// invalidate (delete) a refresh token from the database
  async invalidateRefreshToken(refreshToken) {
    // .del() is the Knex method for deletion.
    await this.db('refresh_tokens').where({ token: refreshToken }).del();
  }
}

// Export the class using module.exports for CommonJS
module.exports = UserDao;