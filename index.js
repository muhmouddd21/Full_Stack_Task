require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./dataStore'); // Knex instance


// routes files
const userRouter = require('./routes/user.routes.js');
const taskRouter = require('./routes/task.routes.js');
const authRouter = require('./routes/auth.routes.js');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true, // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

// async bootstrap
async function startServer() {
  try {
    console.log("Checking database connection...");

    // Check if DB is available
    await db.raw('SELECT 1');
    console.log("Database connected");

    // Mount routers
    app.use('/v1/api/auth', authRouter);
    app.use('/v1/api/tasks', taskRouter);
    app.use('/v1/api/users', userRouter);

    // Global error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

  
    app.listen(3000, () => {
      console.log(' Server running at http://localhost:3000');
    });
  } catch (err) {
    console.error(" Failed to connect to database:", err.message);
    process.exit(1); // i need to stop the whole process if DB not working
  }
}

startServer();