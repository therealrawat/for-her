import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Shield, Lock } from 'lucide-react';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avgCycleLength, setAvgCycleLength] = useState(28);
  const [birthYear, setBirthYear] = useState(new Date().getFullYear() - 25);
  const [contraceptiveUse, setContraceptiveUse] = useState<'None' | 'Birth Control Pill' | 'IUD' | 'Hormonal Shots' | 'Other'>('None');
  const [primaryGoal, setPrimaryGoal] = useState<'General Health' | 'Trying to Conceive' | 'Trying to Avoid Pregnancy'>('General Health');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(
        fullName,
        isAnonymous ? undefined : email,
        isAnonymous ? undefined : password,
        avgCycleLength,
        birthYear,
        contraceptiveUse,
        primaryGoal,
        isAnonymous
      );
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Help us personalize your cycle tracking experience</p>
        </div>

        {/* Privacy Notice */}
        <div className="mb-6 p-4 bg-lavender-50 border border-lavender-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-lavender-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">Your Privacy Matters</p>
              <p>Your health data is encrypted and stays with us. No selling, no sharing, no compromises.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Anonymous Mode Toggle */}
          {/* <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              id="anonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-lavender-600 focus:ring-lavender-500"
            />
            <label htmlFor="anonymous" className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <Lock className="w-4 h-4" />
              Use Anonymous Mode (Local Storage - No Email Required)
            </label>
          </div> */}

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Basic Information
            </h2>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="input-field"
                placeholder="Your full name"
              />
            </div>

            {!isAnonymous && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="input-field"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                </div>
              </>
            )}
          </div>

          {/* Cycle Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Cycle Information
            </h2>

            <div>
              <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
                Birth Year *
              </label>
              <input
                id="birthYear"
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                min={minYear}
                max={maxYear}
                required
                className="input-field"
              />
              <p className="mt-1 text-xs text-gray-500">
                This helps us provide age-appropriate insights (e.g., puberty vs. perimenopause)
              </p>
            </div>

            <div>
              <label htmlFor="cycleLength" className="block text-sm font-medium text-gray-700 mb-1">
                Typical Cycle Length (days) *
              </label>
              <input
                id="cycleLength"
                type="number"
                value={avgCycleLength}
                onChange={(e) => setAvgCycleLength(Number(e.target.value))}
                min={21}
                max={35}
                required
                className="input-field"
              />
              <p className="mt-1 text-xs text-gray-500">
                Your best guess - we'll calculate a more accurate average as you track
              </p>
            </div>
          </div>

          {/* Health Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Health Information
            </h2>

            <div>
              <label htmlFor="contraceptive" className="block text-sm font-medium text-gray-700 mb-1">
                Contraceptive Use *
              </label>
              <select
                id="contraceptive"
                value={contraceptiveUse}
                onChange={(e) => setContraceptiveUse(e.target.value as typeof contraceptiveUse)}
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
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as typeof primaryGoal)}
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

          <button
            type="submit"
            disabled={loading}
            className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
