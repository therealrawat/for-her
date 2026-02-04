import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Shield } from 'lucide-react';
import heroIllustration from '../assets/pr-light.svg';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avgCycleLength, setAvgCycleLength] = useState(28);
  const [birthYear, setBirthYear] = useState(new Date().getFullYear() - 25);
  const [contraceptiveUse, setContraceptiveUse] = useState<
    'None' | 'Birth Control Pill' | 'IUD' | 'Hormonal Shots' | 'Other'
  >('None');
  const [primaryGoal, setPrimaryGoal] = useState<
    'General Health' | 'Trying to Conceive' | 'Trying to Avoid Pregnancy'
  >('General Health');
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
        email,
        password,
        avgCycleLength,
        birthYear,
        contraceptiveUse,
        primaryGoal,
      );
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur rounded-3xl shadow-2xl border border-lavender-100 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Hero column (left on desktop) */}
          <div className="hidden md:flex relative bg-gradient-to-br from-teal-600 via-teal-500 to-lavender-500 text-white order-1">
            <div className="absolute inset-0 opacity-10">
              <img
                src={heroIllustration}
                alt="Cycle tracking illustration"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 flex flex-col justify-between p-10">
              <div>
                <p className="inline-flex px-3 py-1 rounded-full bg-white/10 text-xs font-medium tracking-wide mb-4 border border-white/20">
                  Start your personalized journey
                </p>
                <h1 className="text-2xl font-semibold leading-snug mb-3">
                  Build a cycle profile that actually reflects you.
                </h1>
                <p className="text-sm text-teal-50/90 max-w-xs">
                  Share just enough about your body and goals so we can give you gentle,
                  science-informed guidance—not generic advice.
                </p>
              </div>

              <div className="mt-8 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                  <span>Adjust insights based on contraceptive use and age.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
                  <span>Track moods, symptoms, and flow to see real patterns.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Switch your primary goal anytime—life changes, and so do we.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form column (right on desktop) */}
          <div className="order-1 md:order-2 px-6 py-8 sm:px-10 sm:py-10 max-h-[90vh] overflow-y-auto">
            <div className="mb-6 text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-100 rounded-2xl mb-4">
                <UserPlus className="w-7 h-7 text-teal-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
              <p className="text-gray-600">
                Answer a few questions so we can personalize your cycle tracking experience.
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="mb-6 p-4 bg-lavender-50 border border-lavender-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-lavender-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-gray-700">
                  <p className="font-semibold mb-1">Your privacy comes first</p>
                  <p>
                    Your health data is encrypted and stays with us. No selling, no sharing, no
                    hidden ad networks.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Basic information
                </h3>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full name *
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
                    placeholder="you@example.com"
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
              </div>

              {/* Cycle Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Cycle information
                </h3>

                <div>
                  <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Birth year *
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
                    Helps us provide age-appropriate insights (e.g., puberty vs perimenopause).
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="cycleLength"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Typical cycle length (days) *
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
                    Your best guess is enough—we&apos;ll refine this as you log more cycles.
                  </p>
                </div>
              </div>

              {/* Health Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Health & goals
                </h3>

                <div>
                  <label
                    htmlFor="contraceptive"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contraceptive use *
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
                    This changes how we estimate ovulation and fertility windows.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="primaryGoal"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Primary goal *
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
                    We&apos;ll highlight what matters most based on where you are right now.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
