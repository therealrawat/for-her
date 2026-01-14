  import express from 'express';
  import dotenv from 'dotenv';
  import cors from 'cors';
  import connectDB from './config/db.js';
  import authRoutes from './routes/auth.js';
  import cycleRoutes from './routes/cycles.js';
  import dailyLogRoutes from './routes/dailyLogs.js';
  import userRoutes from './routes/user.js';

  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 5000;

  // Connect to MongoDB
  connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/cycles', cycleRoutes);
  app.use('/api/daily-logs', dailyLogRoutes);
  app.use('/api/user', userRoutes);

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running' });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

