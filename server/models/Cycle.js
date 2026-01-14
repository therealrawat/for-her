import mongoose from 'mongoose';

const cycleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  flowIntensity: {
    type: String,
    enum: ['Spotting', 'Light', 'Medium', 'Heavy'],
    default: 'Medium'
  },
  symptoms: {
    type: [String],
    default: [],
    enum: ['Cramps', 'Bloating', 'Headache', 'Fatigue', 'Mood Swings', 'Back Pain', 'Nausea', 'Acne', 'Other']
  },
  mood: {
    type: String,
    enum: ['Happy', 'Sad', 'Anxious', 'Irritable', 'Calm', 'Energetic', 'Tired', 'Other'],
    default: 'Calm'
  }
}, {
  timestamps: true
});

// Index for efficient queries
cycleSchema.index({ userId: 1, startDate: -1 });

const Cycle = mongoose.model('Cycle', cycleSchema);

export default Cycle;

