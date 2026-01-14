# 4Her - Period Tracker - Backend Server

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/period-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

3. Make sure MongoDB is running on your system (or update MONGODB_URI to point to your MongoDB instance)

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000` (or the PORT specified in your .env file)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Cycles
- `GET /api/cycles` - Get all cycles for logged-in user
- `POST /api/cycles` - Create a new cycle
- `GET /api/cycles/:id` - Get a single cycle
- `PUT /api/cycles/:id` - Update a cycle
- `DELETE /api/cycles/:id` - Delete a cycle

All cycle endpoints require authentication (Bearer token in Authorization header).

