import Cycle from '../models/Cycle.js';

/**
 * Calculate cycle variability and detect deviations
 * @param {Array} cycles - Array of cycle documents
 * @param {Number} avgCycleLength - User's average cycle length
 * @returns {Object} Analysis results with variability and alerts
 */
export const analyzeCycleVariability = (cycles, avgCycleLength) => {
  if (cycles.length < 2) {
    return {
      variability: null,
      hasDeviation: false,
      insight: null
    };
  }

  // Calculate actual cycle lengths (days between start dates)
  const cycleLengths = [];
  for (let i = 0; i < cycles.length - 1; i++) {
    const daysBetween = Math.round(
      (cycles[i].startDate - cycles[i + 1].startDate) / (1000 * 60 * 60 * 24)
    );
    cycleLengths.push(Math.abs(daysBetween));
  }

  // Calculate average and standard deviation
  const avgActual = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
  const variance = cycleLengths.reduce((sum, length) => {
    return sum + Math.pow(length - avgActual, 2);
  }, 0) / cycleLengths.length;
  const stdDev = Math.sqrt(variance);

  // Check for significant deviation (more than 5-7 days from average)
  const deviationThreshold = 6; // days
  const lastCycleLength = cycleLengths[0];
  const deviationFromAvg = Math.abs(lastCycleLength - avgCycleLength);
  const hasDeviation = deviationFromAvg > deviationThreshold;

  // Generate insight message
  let insight = null;
  if (hasDeviation) {
    if (lastCycleLength > avgCycleLength + deviationThreshold) {
      insight = {
        type: 'longer',
        message: `Your cycle was ${lastCycleLength - avgCycleLength} days longer than usual. Was it a stressful week, or did you travel recently?`,
        severity: 'moderate'
      };
    } else if (lastCycleLength < avgCycleLength - deviationThreshold) {
      insight = {
        type: 'shorter',
        message: `Your cycle was ${avgCycleLength - lastCycleLength} days shorter than usual. Consider tracking lifestyle factors that might affect your cycle.`,
        severity: 'moderate'
      };
    }
  }

  return {
    variability: {
      average: Math.round(avgActual),
      standardDeviation: Math.round(stdDev * 10) / 10,
      cycleLengths
    },
    hasDeviation,
    insight,
    lastCycleLength
  };
};

/**
 * Calculate age from birth year
 * @param {Number} birthYear 
 * @returns {Number} Age
 */
export const calculateAge = (birthYear) => {
  return new Date().getFullYear() - birthYear;
};

/**
 * Determine if user is in perimenopause range based on age
 * @param {Number} age 
 * @returns {Boolean}
 */
export const isPerimenopauseAge = (age) => {
  return age >= 40 && age <= 55;
};

/**
 * Determine if user is in puberty range
 * @param {Number} age 
 * @returns {Boolean}
 */
export const isPubertyAge = (age) => {
  return age >= 12 && age <= 18;
};

