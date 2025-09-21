# EverestMinds Backend

A Node.js RESTful API for user authentication and task management, built with Express, Knex, and MySQL.

## Features

- User registration and login with JWT authentication (access & refresh tokens)
- Secure password hashing with bcrypt
- Task CRUD operations (create, read, update, delete)
- Filtering, searching, and pagination for tasks
- Refresh token rotation and secure storage
- Logout and token invalidation
- error handling
- Unit tests for Taskservice

## Project Structure
```
.
├── controllers/    # Route controllers for business logic
├── dao/            # Data access objects (database queries)
├── dataStore/      # Database config and migrations
├── middlewares/    # Auth middleware to protect user data
├── routes/         # Express route definitions
├── services/       # Business logic and utilities
├── test/           # Unit and integration tests
├── index.js        # Application entry point
├── package.json    # Project metadata and scripts
└── .env            # Environment variables


```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MySQL database

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/muhmouddd21/Full_Stack_Task]
    cd Full_Stack_Task
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    NODE_ENV=development
    PORT=3000

    # JWT Secrets
    JWT_ACCESS_TOKEN_SECRET=your_super_secret_access_key
    JWT_REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
    JWT_EXPIRES_IN=15m
    JWT_REFRESH_EXPIRES_IN=14d

    # Bcrypt
    BCRYPT_SALT_ROUNDS=10

    # Database Connection
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    ```

4.  **Set up the database:**
    - Edit `dataStore/knexfile.js` with your database credentials if they are not managed by environment variables.
    - Run migrations to create the necessary tables:
      ```sh
      npm run migrate
      ```

### Running the Application

Start the development server:

```sh
npm start

The API will be available at http://localhost:3000.
API Endpoints
All endpoints are prefixed with /v1/api.
Auth

    POST /auth/register — Register a new user
    POST /auth/login — Login and receive access/refresh tokens
    POST /auth/logout — Logout and invalidate the refresh token
    POST /auth/refresh — Get a new access token using a refresh token

Users

    GET /users/me — Get the current authenticated user's info (requires authentication )

Tasks

    GET /tasks — List all tasks for the authenticated user.
        Query Params: status, q (search), page, limit
    POST /tasks — Create a new task
    GET /tasks/:id — Get a specific task by its ID
    PUT /tasks/:id — Update an existing task
    DELETE /tasks/:id — Delete a task

Code Quality & Security

    Code Quality: Uses ESLint and Prettier for consistent code style. Follows MVC and DAO patterns for better maintainability.
    Security:
        Passwords are securely hashed using bcrypt.
        Sensitive credentials (JWT secrets, DB credentials) are managed via .env files.
        Refresh tokens are stored in the database and are invalidated upon logout for enhanced security.
        Includes basic security headers, CORS, and cookie settings.
