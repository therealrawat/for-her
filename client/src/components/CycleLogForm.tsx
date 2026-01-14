import { useState } from 'react';
import { format } from 'date-fns';
import api from '../utils/api';
import type { Cycle } from '../types';

interface CycleLogFormProps {
  onCycleAdded: (cycle: Cycle) => void;
  avgCycleLength: number;
}

const CycleLogForm = ({ onCycleAdded, avgCycleLength }: CycleLogFormProps) => {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(
    format(new Date(Date.now() + avgCycleLength * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  );
  const [flowIntensity, setFlowIntensity] = useState<'Spotting' | 'Light' | 'Medium' | 'Heavy'>('Medium');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState('Calm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const symptomOptions = [
    'Cramps',
    'Bloating',
    'Headache',
    'Fatigue',
    'Mood Swings',
    'Back Pain',
    'Nausea',
    'Acne',
    'Other',
  ];

  const flowIntensityOptions = ['Spotting', 'Light', 'Medium', 'Heavy'];

  const moodOptions = [
    'Happy',
    'Sad',
    'Anxious',
    'Irritable',
    'Calm',
    'Energetic',
    'Tired',
    'Other',
  ];

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post<Cycle>('/cycles', {
        startDate,
        endDate,
        flowIntensity,
        symptoms,
        mood,
      });
      onCycleAdded(response.data);
      // Reset form
      setStartDate(format(new Date(), 'yyyy-MM-dd'));
      setEndDate(
        format(new Date(Date.now() + avgCycleLength * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      );
      setSymptoms([]);
      setMood('Calm');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log cycle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Log New Cycle</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="flowIntensity" className="block text-sm font-medium text-gray-700 mb-1">
            Flow Intensity
          </label>
          <select
            id="flowIntensity"
            value={flowIntensity}
            onChange={(e) => setFlowIntensity(e.target.value as typeof flowIntensity)}
            className="input-field"
          >
            {flowIntensityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {symptomOptions.map((symptom) => (
              <label
                key={symptom}
                className="flex items-center gap-2 p-2 border border-lavender-200 rounded-lg cursor-pointer hover:bg-lavender-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={symptoms.includes(symptom)}
                  onChange={() => handleSymptomToggle(symptom)}
                  className="rounded text-lavender-600 focus:ring-lavender-500"
                />
                <span className="text-sm text-gray-700">{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-1">
            Mood
          </label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="input-field"
          >
            {moodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging...' : 'Log Cycle'}
        </button>
      </form>
    </div>
  );
};

export default CycleLogForm;

