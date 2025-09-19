const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const userRouter = express.Router();


// Apply authentication middleware
userRouter.use(authMiddleware);

// GET /api/users/me
userRouter.get('/me', (req, res) => {
  res.status(200).json(req.user);
});



module.exports = userRouter;