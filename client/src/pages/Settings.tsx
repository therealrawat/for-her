import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Settings as SettingsIcon, Save, ArrowLeft, User } from 'lucide-react';

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    avgCycleLength: 28,
    birthYear: new Date().getFullYear() - 25,
    contraceptiveUse: 'None' as 'None' | 'Birth Control Pill' | 'IUD' | 'Hormonal Shots' | 'Other',
    primaryGoal: 'General Health' as 'General Health' | 'Trying to Conceive' | 'Trying to Avoid Pregnancy',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/profile');
      setFormData({
        fullName: response.data.fullName || '',
        avgCycleLength: response.data.avgCycleLength || 28,
        birthYear: response.data.birthYear || new Date().getFullYear() - 25,
        contraceptiveUse: response.data.contraceptiveUse || 'None',
        primaryGoal: response.data.primaryGoal || 'General Health',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await api.put('/user/profile', formData);
      
      // Update local storage with new user data
      const userData = localStorage.getItem('user');
      if (userData) {
        const updatedUser = { ...JSON.parse(userData), ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setSuccess('Profile updated successfully!');
      
      // Refresh page after a short delay to show success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 12;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lavender-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-600 hover:text-lavender-600 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-lavender-100 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-lavender-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-lavender-600" />
            <h2 className="text-xl font-semibold text-gray-800">Health Information</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Update your health information as it changes. This helps us provide more accurate predictions and insights.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Basic Information
              </h3>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  required
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Cycle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Cycle Information
              </h3>

              <div>
                <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Year *
                </label>
                <input
                  id="birthYear"
                  type="number"
                  value={formData.birthYear}
                  onChange={(e) => handleChange('birthYear', Number(e.target.value))}
                  min={minYear}
                  max={maxYear}
                  required
                  className="input-field"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This helps us provide age-appropriate insights
                </p>
              </div>

              <div>
                <label htmlFor="avgCycleLength" className="block text-sm font-medium text-gray-700 mb-1">
                  Average Cycle Length (days) *
                </label>
                <input
                  id="avgCycleLength"
                  type="number"
                  value={formData.avgCycleLength}
                  onChange={(e) => handleChange('avgCycleLength', Number(e.target.value))}
                  min={21}
                  max={35}
                  required
                  className="input-field"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your typical cycle length - we'll refine this as you track more cycles
                </p>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Health Information
              </h3>

              <div>
                <label htmlFor="contraceptiveUse" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraceptive Use *
                </label>
                <select
                  id="contraceptiveUse"
                  value={formData.contraceptiveUse}
                  onChange={(e) => handleChange('contraceptiveUse', e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="None">None</option>
                  <option value="Birth Control Pill">Birth Control Pill</option>
                  <option value="IUD">IUD</option>
                  <option value="Hormonal Shots">Hormonal Shots</option>
                  <option value="Other">Other</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  This affects how we calculate ovulation and fertility windows
                </p>
              </div>

              <div>
                <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Goal *
                </label>
                <select
                  id="primaryGoal"
                  value={formData.primaryGoal}
                  onChange={(e) => handleChange('primaryGoal', e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="General Health">General Health</option>
                  <option value="Trying to Conceive">Trying to Conceive</option>
                  <option value="Trying to Avoid Pregnancy">Trying to Avoid Pregnancy</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  This helps us customize how we display fertility windows
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Account Actions */}
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

