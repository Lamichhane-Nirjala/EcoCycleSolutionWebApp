# EcoCycle Backend API

A Node.js and Express backend API for the EcoCycle environmental impact tracking application, powered by PostgreSQL.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Installation

1. **Install dependencies:**

```bash
cd Backend
npm install
```

2. **Configure environment variables:**

Create a `.env` file in the Backend directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=eco_cycle

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

3. **Initialize the database:**

```bash
npm run init-db
```

This will create the PostgreSQL database and all necessary tables.

## Running the Server

### Development Mode (with hot reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/user/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Login User
- **POST** `/api/user/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response includes JWT token**

### Users

#### Get All Users
- **GET** `/api/user`

#### Get Current User
- **GET** `/api/user/current`
- **Headers:** `Authorization: Bearer <token>`

#### Get User by ID
- **GET** `/api/user/:id`

#### Update User
- **PUT** `/api/user/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
  ```

#### Delete User
- **DELETE** `/api/user/:id`
- **Headers:** `Authorization: Bearer <token>`

### Health Check
- **GET** `/api/health`

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login or registration, include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Input Validation

All inputs are validated using Joi:

- **Name:** Min 3, max 255 characters
- **Email:** Valid email format
- **Password:** Min 6 characters (register), required for login

## Error Handling

All errors return a standardized JSON response:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development mode only)"
}
```

## Security Features

- Password hashing with bcryptjs (salt rounds: 10)
- JWT-based authentication
- CORS enabled for frontend communication
- Input validation and sanitization
- Protected routes with token verification

## Project Structure

```
Backend/
├── Controller/
│   └── userController.js
├── Database/
│   └── db.js
├── Middleware/
│   └── auth.js
├── Model/
│   └── userModel.js
├── Router/
│   └── userRouter.js
├── .env
├── .gitignore
├── init-db.js
├── package.json
└── server.js
```

## Development Notes

- Use `npm run dev` for development with automatic restart
- Use `npm run init-db` to recreate the database
- Check `.env` file for database credentials
- JWT tokens expire after 7 days by default
- Passwords are hashed before storage

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check `.env` credentials
- Verify database user has proper permissions

### Port Already in Use
- Change PORT in `.env`
- Or kill the process using the port

### Token Errors
- Ensure token is included in Authorization header
- Check JWT_SECRET matches in `.env`
- Verify token hasn't expired

## License

ISC
