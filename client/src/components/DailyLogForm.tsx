import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../utils/api';
import type { DailyLog } from '../types';
import { Calendar, Activity, Heart, Coffee } from 'lucide-react';

interface DailyLogFormProps {
  date?: Date;
  onLogSaved: () => void;
  existingLog?: DailyLog | null;
}

const DailyLogForm = ({ date = new Date(), onLogSaved, existingLog }: DailyLogFormProps) => {
  const [logDate, setLogDate] = useState(format(date, 'yyyy-MM-dd'));
  const [flowIntensity, setFlowIntensity] = useState<'None' | 'Spotting' | 'Light' | 'Medium' | 'Heavy'>('None');
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([]);
  const [lifestyleFactors, setLifestyleFactors] = useState({
    highStress: false,
    travel: false,
    poorSleep: false,
    alcohol: false,
  });
  const [biometricData, setBiometricData] = useState({
    weight: '',
    basalBodyTemp: '',
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingLog) {
      setFlowIntensity(existingLog.flowIntensity);
      setPhysicalSymptoms(existingLog.physicalSymptoms || []);
      setLifestyleFactors({
        highStress: existingLog.lifestyleFactors?.highStress ?? false,
        travel: existingLog.lifestyleFactors?.travel ?? false,
        poorSleep: existingLog.lifestyleFactors?.poorSleep ?? false,
        alcohol: existingLog.lifestyleFactors?.alcohol ?? false,
      });
      setBiometricData({
        weight: existingLog.biometricData?.weight?.toString() || '',
        basalBodyTemp: existingLog.biometricData?.basalBodyTemp?.toString() || '',
      });
      setNotes(existingLog.notes || '');
    }
  }, [existingLog]);

  const symptomOptions = [
    'Cramps',
    'Bloating',
    'Acne',
    'Headaches',
    'Back Pain',
    'Nausea',
    'Breast Tenderness',
    'Other',
  ];

  const handleSymptomToggle = (symptom: string) => {
    setPhysicalSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleLifestyleToggle = (factor: keyof typeof lifestyleFactors) => {
    setLifestyleFactors((prev) => ({
      ...prev,
      [factor]: !prev[factor],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post<DailyLog>('/daily-logs', {
        date: logDate,
        flowIntensity,
        physicalSymptoms,
        lifestyleFactors,
        biometricData: {
          weight: biometricData.weight ? Number(biometricData.weight) : undefined,
          basalBodyTemp: biometricData.basalBodyTemp ? Number(biometricData.basalBodyTemp) : undefined,
        },
        notes,
      });
      onLogSaved();
      // Reset form if not editing
      if (!existingLog) {
        setFlowIntensity('None');
        setPhysicalSymptoms([]);
        setLifestyleFactors({
          highStress: false,
          travel: false,
          poorSleep: false,
          alcohol: false,
        });
        setBiometricData({ weight: '', basalBodyTemp: '' });
        setNotes('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save daily log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-lavender-600" />
        <h2 className="text-xl font-semibold text-gray-800">Daily Log</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="logDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            id="logDate"
            type="date"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
            required
            className="input-field"
          />
        </div>

        {/* Flow Intensity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Activity className="w-4 h-4 inline mr-1" />
            Flow Intensity
          </label>
          <div className="grid grid-cols-5 gap-2">
            {['None', 'Spotting', 'Light', 'Medium', 'Heavy'].map((intensity) => (
              <label
                key={intensity}
                className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-colors ${
                  flowIntensity === intensity
                    ? 'bg-lavender-100 border-lavender-500 text-lavender-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="flowIntensity"
                  value={intensity}
                  checked={flowIntensity === intensity}
                  onChange={(e) => setFlowIntensity(e.target.value as typeof flowIntensity)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{intensity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Physical Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Heart className="w-4 h-4 inline mr-1" />
            Physical Symptoms
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {symptomOptions.map((symptom) => (
              <label
                key={symptom}
                className="flex items-center gap-2 p-2 border border-lavender-200 rounded-lg cursor-pointer hover:bg-lavender-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={physicalSymptoms.includes(symptom)}
                  onChange={() => handleSymptomToggle(symptom)}
                  className="rounded text-lavender-600 focus:ring-lavender-500"
                />
                <span className="text-sm text-gray-700">{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Lifestyle Factors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Coffee className="w-4 h-4 inline mr-1" />
            Lifestyle Factors
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { key: 'highStress', label: 'High Stress' },
              { key: 'travel', label: 'Travel' },
              { key: 'poorSleep', label: 'Poor Sleep' },
              { key: 'alcohol', label: 'Alcohol' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 p-2 border border-teal-200 rounded-lg cursor-pointer hover:bg-teal-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={lifestyleFactors[key as keyof typeof lifestyleFactors]}
                  onChange={() => handleLifestyleToggle(key as keyof typeof lifestyleFactors)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Biometric Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (lbs) - Optional
            </label>
            <input
              id="weight"
              type="number"
              value={biometricData.weight}
              onChange={(e) => setBiometricData({ ...biometricData, weight: e.target.value })}
              min="0"
              step="0.1"
              className="input-field"
              placeholder="e.g., 150"
            />
          </div>

          <div>
            <label htmlFor="bbt" className="block text-sm font-medium text-gray-700 mb-1">
              Basal Body Temp (°F) - Optional
            </label>
            <input
              id="bbt"
              type="number"
              value={biometricData.basalBodyTemp}
              onChange={(e) => setBiometricData({ ...biometricData, basalBodyTemp: e.target.value })}
              min="0"
              max="110"
              step="0.1"
              className="input-field"
              placeholder="e.g., 98.6"
            />
            <p className="mt-1 text-xs text-gray-500">
              BBT rises slightly after ovulation
            </p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            rows={3}
            className="input-field resize-none"
            placeholder="Any additional notes about your day..."
          />
          <p className="mt-1 text-xs text-gray-500">{notes.length}/500 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : existingLog ? 'Update Log' : 'Save Log'}
        </button>
      </form>
    </div>
  );
};

export default DailyLogForm;

