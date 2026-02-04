import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      avgCycleLength,
      birthYear,
      contraceptiveUse,
      primaryGoal,
      isAnonymous
    } = req.body;

    // For anonymous users, email is optional
    if (!isAnonymous && email) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
    }

    // Create user
    const user = await User.create({
      fullName,
      email: isAnonymous ? undefined : email,
      password: isAnonymous ? undefined : password,
      avgCycleLength: avgCycleLength || 28,
      birthYear,
      contraceptiveUse: contraceptiveUse || 'None',
      primaryGoal: primaryGoal || 'General Health',
      isAnonymous: isAnonymous || false
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avgCycleLength: user.avgCycleLength,
        birthYear: user.birthYear,
        contraceptiveUse: user.contraceptiveUse,
        primaryGoal: user.primaryGoal,
        isAnonymous: user.isAnonymous,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avgCycleLength: user.avgCycleLength,
        birthYear: user.birthYear,
        contraceptiveUse: user.contraceptiveUse,
        primaryGoal: user.primaryGoal,
        isAnonymous: user.isAnonymous,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

