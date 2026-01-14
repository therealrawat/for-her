import express from 'express';
import Cycle from '../models/Cycle.js';
import { protect } from '../middleware/auth.js';
import { analyzeCycleVariability } from '../utils/cycleAnalysis.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/cycles
// @desc    Create a new cycle
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { startDate, endDate, flowIntensity, symptoms, mood } = req.body;

    const cycle = await Cycle.create({
      userId: req.user._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      flowIntensity: flowIntensity || 'Medium',
      symptoms: symptoms || [],
      mood: mood || 'Calm'
    });

    res.status(201).json(cycle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/cycles
// @desc    Get all cycles for the logged-in user with analysis
// @access  Private
router.get('/', async (req, res) => {
  try {
    const cycles = await Cycle.find({ userId: req.user._id })
      .sort({ startDate: -1 })
      .select('-__v');

    // Calculate cycle variability if we have enough cycles
    const analysis = analyzeCycleVariability(cycles, req.user.avgCycleLength);

    res.json({
      cycles,
      analysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/cycles/:id
// @desc    Get a single cycle by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const cycle = await Cycle.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/cycles/:id
// @desc    Update a cycle
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { startDate, endDate, symptoms, mood } = req.body;

    const cycle = await Cycle.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    if (startDate) cycle.startDate = new Date(startDate);
    if (endDate) cycle.endDate = new Date(endDate);
    if (flowIntensity) cycle.flowIntensity = flowIntensity;
    if (symptoms) cycle.symptoms = symptoms;
    if (mood) cycle.mood = mood;

    await cycle.save();
    res.json(cycle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/cycles/:id
// @desc    Delete a cycle
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const cycle = await Cycle.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    await cycle.deleteOne();
    res.json({ message: 'Cycle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

