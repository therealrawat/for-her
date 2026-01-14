import express from 'express';
import DailyLog from '../models/DailyLog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/daily-logs
// @desc    Create or update a daily log
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      date,
      flowIntensity,
      physicalSymptoms,
      lifestyleFactors,
      biometricData,
      notes
    } = req.body;

    // Normalize date to start of day for consistency
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    const logData = {
      userId: req.user._id,
      date: logDate,
      flowIntensity: flowIntensity || 'None',
      physicalSymptoms: physicalSymptoms || [],
      lifestyleFactors: lifestyleFactors || {},
      biometricData: biometricData || {},
      notes: notes || ''
    };

    // Use findOneAndUpdate with upsert to create or update
    const dailyLog = await DailyLog.findOneAndUpdate(
      { userId: req.user._id, date: logDate },
      logData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(dailyLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/daily-logs
// @desc    Get daily logs for a date range
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const logs = await DailyLog.find(query)
      .sort({ date: -1 })
      .select('-__v');

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/daily-logs/:date
// @desc    Get a specific daily log by date
// @access  Private
router.get('/:date', async (req, res) => {
  try {
    // Parse date string (format: YYYY-MM-DD)
    const dateStr = req.params.date;
    const [year, month, day] = dateStr.split('-').map(Number);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const logDate = new Date(year, month - 1, day);
    logDate.setHours(0, 0, 0, 0);

    // Also check for date range to handle timezone issues
    const startOfDay = new Date(logDate);
    const endOfDay = new Date(logDate);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyLog = await DailyLog.findOne({
      userId: req.user._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (!dailyLog) {
      return res.status(404).json({ message: 'Daily log not found' });
    }

    res.json(dailyLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/daily-logs/:date
// @desc    Update a daily log
// @access  Private
router.put('/:date', async (req, res) => {
  try {
    const dateStr = req.params.date;
    const [year, month, day] = dateStr.split('-').map(Number);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const logDate = new Date(year, month - 1, day);
    logDate.setHours(0, 0, 0, 0);
    
    const startOfDay = new Date(logDate);
    const endOfDay = new Date(logDate);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyLog = await DailyLog.findOne({
      userId: req.user._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (!dailyLog) {
      return res.status(404).json({ message: 'Daily log not found' });
    }

    const {
      flowIntensity,
      physicalSymptoms,
      lifestyleFactors,
      biometricData,
      notes
    } = req.body;

    if (flowIntensity) dailyLog.flowIntensity = flowIntensity;
    if (physicalSymptoms) dailyLog.physicalSymptoms = physicalSymptoms;
    if (lifestyleFactors) dailyLog.lifestyleFactors = { ...dailyLog.lifestyleFactors, ...lifestyleFactors };
    if (biometricData) dailyLog.biometricData = { ...dailyLog.biometricData, ...biometricData };
    if (notes !== undefined) dailyLog.notes = notes;

    await dailyLog.save();
    res.json(dailyLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/daily-logs/:date
// @desc    Delete a daily log
// @access  Private
router.delete('/:date', async (req, res) => {
  try {
    const dateStr = req.params.date;
    const [year, month, day] = dateStr.split('-').map(Number);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const logDate = new Date(year, month - 1, day);
    logDate.setHours(0, 0, 0, 0);
    
    const startOfDay = new Date(logDate);
    const endOfDay = new Date(logDate);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyLog = await DailyLog.findOne({
      userId: req.user._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (!dailyLog) {
      return res.status(404).json({ message: 'Daily log not found' });
    }

    await dailyLog.deleteOne();
    res.json({ message: 'Daily log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

