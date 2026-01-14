import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  flowIntensity: {
    type: String,
    enum: ['None', 'Spotting', 'Light', 'Medium', 'Heavy'],
    default: 'None'
  },
  physicalSymptoms: {
    type: [String],
    default: [],
    enum: ['Cramps', 'Bloating', 'Acne', 'Headaches', 'Back Pain', 'Nausea', 'Breast Tenderness', 'Other']
  },
  lifestyleFactors: {
    highStress: { type: Boolean, default: false },
    travel: { type: Boolean, default: false },
    poorSleep: { type: Boolean, default: false },
    alcohol: { type: Boolean, default: false }
  },
  biometricData: {
    weight: { type: Number, min: 0 },
    basalBodyTemp: { type: Number, min: 0, max: 110 } // in Fahrenheit
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Compound index to ensure one log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

// Index for efficient date range queries
dailyLogSchema.index({ userId: 1, date: -1 });

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);

export default DailyLog;

