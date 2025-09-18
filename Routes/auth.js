const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');


function createAuthRouter(userController) {
 
  router.post('/register', userController.register.bind(userController));
  router.post('/login', userController.login.bind(userController));

  // POST /api/auth/logout
  // Invalidates the refresh token and clears the cookie.
  router.post('/logout', userController.logout.bind(userController));

  // POST /api/auth/refresh
  // Issues a new access token using a valid refresh token.
  router.post('/refresh', userController.refresh.bind(userController));

  return router;
}

module.exports = createAuthRouter;