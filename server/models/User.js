import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: function() {
      return !this.isAnonymous;
    },
    unique: true,
    sparse: true, // Allows multiple null values
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: function() {
      return !this.isAnonymous;
    },
    minlength: [6, 'Password must be at least 6 characters']
  },
  avgCycleLength: {
    type: Number,
    default: 28,
    min: [21, 'Cycle length must be at least 21 days'],
    max: [35, 'Cycle length must be at most 35 days']
  },
  birthYear: {
    type: Number,
    required: [true, 'Birth year is required'],
    min: [1900, 'Birth year must be valid'],
    max: [new Date().getFullYear(), 'Birth year cannot be in the future']
  },
  contraceptiveUse: {
    type: String,
    enum: ['None', 'Birth Control Pill', 'IUD', 'Hormonal Shots', 'Other'],
    default: 'None'
  },
  primaryGoal: {
    type: String,
    enum: ['General Health', 'Trying to Conceive', 'Trying to Avoid Pregnancy'],
    default: 'General Health'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

