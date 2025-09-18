const bcrypt = require('bcrypt');

class UserService {

  constructor(userDao) {
    this.userDao = userDao;
  }

  // Register a new user
  async registerUser({ username, email, password }) {
    //  Check if email or username is already taken.
    const existingUser = await this.userDao.findByEmail(email) || await this.userDao.findByUsername(username);
    if (existingUser) {
      throw new Error('Username or email is already in use.');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //  Create the user via the DAO.
    const newUser = await this.userDao.create({
      username,
      email,
      password: hashedPassword
    });

    //  Return the created user object (without the password).
    delete newUser.password;
    return newUser;
  }
    // Login an existing user
  async loginUser(email, password) {

    const user = await this.userDao.findByEmail(email);
    if (!user) {
      return null; 
    }
    //  Verify the password.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null; 
    }

    // Return the user object (without the password).
    delete user.password;
    return user;
  }
    // Get user details by ID
  async getUserById(id) {
    const user = await this.userDao.findById(id);
    if (user) {
      delete user.password; // Always remove the password.
    }
    return user;
  }
  // Store refresh token in the database
  async storeRefreshToken(token, userId) {
    await this.userDao.storeRefreshToken(token, userId);
  }


  // Refresh the user's tokens using the provided refresh token 
// when he refreshed the app or access token has expired during his session
   async refreshUserToken(oldRefreshToken) {

    const user = await this.userDao.getUserByRefreshToken(oldRefreshToken);
    if (!user) {
      throw new Error('Invalid or expired refresh token.');
    }


    //  Issue a new access token.
    const { generateAccessToken, generateRefreshToken } = require('../Services/tokenService');
    const newAccessToken = generateAccessToken(user);

    //  Return the new token and user info.
    delete user.password; // Ensure password is not returned
    return { newAccessToken, user };
  }
}

module.exports = UserService;