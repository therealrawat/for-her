# 4Her - Period Tracker MVP

A full-stack MERN application for tracking menstrual cycles with smart predictions and privacy features.

## Features

- 🔐 JWT-based authentication (Signup/Login)
- 📅 Cycle tracking with start/end dates
- 🧠 Smart dashboard with:
  - Countdown to next period based on average cycle length
  - Fertility/Ovulation window predictions (14 days before next period)
- 📝 Symptom logging (Cramps, Bloating, Headache, etc.)
- 😊 Mood tracking
- 🔒 Privacy Mode - Hide sensitive terminology

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router
- Axios
- date-fns
- Lucide React (icons)

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/period-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

4. Make sure MongoDB is running

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:5000):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
for-her/
├── server/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js        # User schema
│   │   └── Cycle.js       # Cycle schema
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   └── cycles.js      # Cycle CRUD routes
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   └── server.js          # Express server setup
│
└── client/
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── context/       # Auth context
    │   ├── utils/         # API utilities
    │   └── types/         # TypeScript types
    └── ...
```

## Usage

1. Sign up with your email and password
2. Set your average cycle length (default: 28 days)
3. Log your cycles with start/end dates
4. Track symptoms and mood
5. View predictions for next period and fertility window
6. Toggle Privacy Mode for discrete terminology

## Color Palette

- **Lavender**: Primary color for UI elements
- **Teal**: Secondary color for accents
- Soft gradient backgrounds for a clean, modern look

