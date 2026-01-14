import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile (health information)
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const {
      fullName,
      avgCycleLength,
      birthYear,
      contraceptiveUse,
      primaryGoal
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    if (fullName !== undefined) user.fullName = fullName;
    if (avgCycleLength !== undefined) user.avgCycleLength = avgCycleLength;
    if (birthYear !== undefined) user.birthYear = birthYear;
    if (contraceptiveUse !== undefined) user.contraceptiveUse = contraceptiveUse;
    if (primaryGoal !== undefined) user.primaryGoal = primaryGoal;

    await user.save();

    // Return user without password
    const userResponse = await User.findById(user._id).select('-password');
    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

