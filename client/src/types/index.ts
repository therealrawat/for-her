export interface User {
  _id: string;
  fullName: string;
  email?: string;
  avgCycleLength: number;
  birthYear: number;
  contraceptiveUse: 'None' | 'Birth Control Pill' | 'IUD' | 'Hormonal Shots' | 'Other';
  primaryGoal: 'General Health' | 'Trying to Conceive' | 'Trying to Avoid Pregnancy';
  isAnonymous?: boolean;
}

export interface Cycle {
  _id: string;
  userId: string;
  startDate: string;
  endDate: string;
  flowIntensity: 'Spotting' | 'Light' | 'Medium' | 'Heavy';
  symptoms: string[];
  mood: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyLog {
  _id: string;
  userId: string;
  date: string;
  flowIntensity: 'None' | 'Spotting' | 'Light' | 'Medium' | 'Heavy';
  physicalSymptoms: string[];
  lifestyleFactors: {
    highStress?: boolean;
    travel?: boolean;
    poorSleep?: boolean;
    alcohol?: boolean;
  };
  biometricData: {
    weight?: number;
    basalBodyTemp?: number;
  };
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CycleAnalysis {
  variability: {
    average: number;
    standardDeviation: number;
    cycleLengths: number[];
  } | null;
  hasDeviation: boolean;
  insight: {
    type: 'longer' | 'shorter';
    message: string;
    severity: 'moderate' | 'high';
  } | null;
  lastCycleLength?: number;
}

export interface AuthResponse {
  _id: string;
  fullName: string;
  email?: string;
  avgCycleLength: number;
  birthYear: number;
  contraceptiveUse: 'None' | 'Birth Control Pill' | 'IUD' | 'Hormonal Shots' | 'Other';
  primaryGoal: 'General Health' | 'Trying to Conceive' | 'Trying to Avoid Pregnancy';
  isAnonymous?: boolean;
  token: string;
}

