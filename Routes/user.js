const express = require('express');
const router = express.Router();


const UserController = require('../controllers/UserController');
const authMiddleware = require('../Middlewares/'); // We will create this next!

function createUserRouter(userController) {
    // GET /api/users/me
  router.get('/me', authMiddleware, (req, res) => {
    // The user object was attached to the request by the middleware.
    res.status(200).json(req.user);
  });

  router.get('/:id', authMiddleware, userController.getUserById.bind(userController));
  return router;
}

module.exports = createUserRouter;