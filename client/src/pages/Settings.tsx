import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Save, User } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';

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
        <div className="text-lavender-700 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="app-container">
        <AppHeader
          title="Settings"
          subtitle="Keep your health profile up to date for better predictions."
          backTo="/dashboard"
        />

        {/* Success Message */}
        {success && (
          <div className="mb-6 surface p-4 bg-green-50/70 border-green-200 text-green-700">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 surface p-4 bg-red-50/70 border-red-200 text-red-700">
            {error}
          </div>
        )}

        <div className="surface-strong p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-lavender-100 rounded-xl">
              <User className="w-5 h-5 text-lavender-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Health profile</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            This information helps improve predictions and insights. Update it anytime.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Basic information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
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
            </div>

            {/* Cycle Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Cycle information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Birth year *
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
                  <p className="mt-1 text-xs text-gray-500">Helps provide age-appropriate insights.</p>
                </div>

                <div>
                  <label
                    htmlFor="avgCycleLength"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Avg cycle length (days) *
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
                  <p className="mt-1 text-xs text-gray-500">We refine this as you track more cycles.</p>
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Health & goals
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contraceptiveUse"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contraceptive use *
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
                  <p className="mt-1 text-xs text-gray-500">Affects fertility window estimates.</p>
                </div>

                <div>
                  <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700 mb-1">
                    Primary goal *
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
                  <p className="mt-1 text-xs text-gray-500">Changes how we present insights.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Account Actions */}
        <div className="surface p-6 mt-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Account</h3>
            <p className="text-sm text-gray-600">Sign out from this device.</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

