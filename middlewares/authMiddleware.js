const UserDao = require('../dao/userDao');
const db = require('../dataStore'); 
const userDao = new UserDao(db);
const tokenService  = require('../services/tokenService');
const tokenServiceInstance = new tokenService(userDao);
// get the service to use the functions of dealing with access token



const authMiddleware = async (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // cancel barear word

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  try {
    //  Verify the access token.
    const payload = tokenServiceInstance.verifyAccessToken(token);
    if (!payload) {
      // If the token is invalid 
      return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    }

    //  Find the user associated with the token.
    const user = await userDao.findById(payload.id);

    if (!user) {
      // If the user ID in the token doesn't correspond to a real user.
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    // 4. Attach the user object (without the password) to the request.
    delete user.password;
    req.user = user;

    next();

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};

module.exports = authMiddleware;