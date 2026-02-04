import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import heroIllustration from '../assets/pr-light.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'admin') {
        navigate('/admin/users');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur rounded-3xl shadow-2xl border border-lavender-100 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Form column (left on desktop) */}
          <div className="px-6 py-8 sm:px-10 sm:py-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-lavender-100 rounded-2xl mb-5">
                <LogIn className="w-7 h-7 text-lavender-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Welcome back
              </h1>
              <p className="text-gray-600">
                Log in to continue tracking your cycle and get personalized insights.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-lavender-600 hover:text-lavender-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>

          {/* Hero column (right on desktop) */}
          <div className="hidden md:flex relative bg-gradient-to-br from-lavender-600 via-lavender-500 to-teal-500 text-white">
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
                  Designed for hormonal health
                </p>
                <h2 className="text-2xl font-semibold leading-snug mb-3">
                  Understand your cycle, not just your period.
                </h2>
                <p className="text-sm text-lavender-50/90 max-w-xs">
                  Track symptoms, moods, and energy so you can plan your life around your body,
                  not the other way around.
                </p>
              </div>

              <div className="mt-8 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>See predicted fertile windows and PMS phases.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
                  <span>Spot patterns across months, not just one cycle.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-300" />
                  <span>Your data is encrypted and never sold.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

