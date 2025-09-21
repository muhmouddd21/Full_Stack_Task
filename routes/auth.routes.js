const express = require('express');
const db = require('../dataStore');
const UserDao = require('../dao/userDao');
const UserService = require('../services/userService');
const UserController = require('../controllers/userController');
const  tokenService  = require('../services/tokenService');

const authRouter = express.Router();

// get instance of a controller to user it
const userDao = new UserDao(db);
const userService = new UserService(userDao);
const tokenServiceinstance = new tokenService(userDao);
const userController = new UserController(userService,tokenServiceinstance);

// POST /api/auth/register
authRouter.post('/register', userController.register.bind(userController));

// POST /api/auth/login
authRouter.post('/login', userController.login.bind(userController));

// POST /api/auth/logout
// Invalidates the refresh token and clears the cookie
authRouter.post('/logout', userController.logout.bind(userController));

// POST /api/auth/refresh
// Issues a new access token using a valid refresh token
authRouter.post('/refresh', userController.refresh.bind(userController));

module.exports = authRouter;