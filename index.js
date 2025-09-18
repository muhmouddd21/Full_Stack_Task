require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser()); // handle cookies

// Initialize components and wire them together
const db = require('./DataStore'); // Knex instance
const UserDao = require('./DAO/userDAO');
const UserService = require('./Services/UserService');
const UserController = require('./Controllers/UserController');
const createAuthRouter = require('./Routes/auth');
const createUserRouter = require('./Routes/users');

// Initialize DAO, Service, and Controller
const userDao = new UserDao(db);
const userService = new UserService(userDao);
const userController = new UserController(userService);

// Create routers
const authRouter = createAuthRouter(userController);
const userRouter = createUserRouter(userController);

// auth routes
app.use('/api/auth', authRouter);
// users 
app.use('/api/users', userRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});