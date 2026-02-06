import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { differenceInDays, addDays, format, subDays } from 'date-fns';
import api from '../utils/api';
import type { Cycle, CycleAnalysis, DailyLog } from '../types';
import { Calendar, Plus, Heart, AlertCircle, Shield, FileText, Users, Activity } from 'lucide-react';
import CycleLogForm from '../components/CycleLogForm';
import DailyLogForm from '../components/DailyLogForm';
import CalendarView from '../components/CalendarView';
import CycleInsights from '../components/CycleInsights';
import RecentEntries from '../components/RecentEntries';
import { AppHeader } from '../components/AppHeader';
import { Loader } from '../components/Loader';


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cycleAnalysis, setCycleAnalysis] = useState<CycleAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDailyLog, setShowDailyLog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [existingDailyLog, setExistingDailyLog] = useState<DailyLog | null>(null);
  const [showOvulationWindow, setShowOvulationWindow] = useState(true);

  useEffect(() => {
    fetchCycles();
    // Load preference for General Health users
    const savedPreference = localStorage.getItem('showOvulationWindow');
    if (savedPreference !== null) {
      setShowOvulationWindow(savedPreference === 'true');
    }
  }, []);

  const fetchCycles = async () => {
    try {
      const response = await api.get<{ cycles: Cycle[]; analysis: CycleAnalysis }>('/cycles');
      setCycles(response.data.cycles);
      setCycleAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Failed to fetch cycles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyLog = async (date: Date) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const response = await api.get<DailyLog>(`/daily-logs/${dateStr}`);
      setExistingDailyLog(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setExistingDailyLog(null);
      }
    }
  };

  useEffect(() => {
    if (showDailyLog) {
      fetchDailyLog(selectedDate);
    }
  }, [showDailyLog, selectedDate]);

  const handleCycleAdded = () => {
    fetchCycles();
    setShowForm(false);
  };

  const handleDailyLogSaved = () => {
    fetchDailyLog(selectedDate);
    setShowDailyLog(false);
  };

  const calculateNextPeriod = () => {
    if (cycles.length === 0) return null;

    const lastCycle = cycles[0];
    const lastStartDate = new Date(lastCycle.startDate);
    const avgCycleLength = user?.avgCycleLength || 28;
    const nextPeriodDate = addDays(lastStartDate, avgCycleLength);

    return {
      date: nextPeriodDate,
      daysUntil: differenceInDays(nextPeriodDate, new Date())
    };
  };

  const calculateOvulationWindow = () => {
    const nextPeriod = calculateNextPeriod();
    if (!nextPeriod) return null;

    // Ovulation typically occurs ~14 days before next period
    const ovulationDate = subDays(nextPeriod.date, 14);
    const windowStart = subDays(ovulationDate, 3);
    const windowEnd = addDays(ovulationDate, 3);

    return {
      start: windowStart,
      end: windowEnd,
      isActive: new Date() >= windowStart && new Date() <= windowEnd
    };
  };

  const nextPeriod = calculateNextPeriod();
  const ovulationWindow = calculateOvulationWindow();

  const shouldShowFertilityWindow = () => {
    if (!user || !ovulationWindow) return false;

    // Don't show window if on hormonal contraception (show message instead)
    if (user.contraceptiveUse === 'Birth Control Pill' || user.contraceptiveUse === 'Hormonal Shots') {
      return false;
    }

    // Always show for "Trying to Conceive" or "Trying to Avoid Pregnancy"
    if (user.primaryGoal === 'Trying to Conceive' || user.primaryGoal === 'Trying to Avoid Pregnancy') {
      return true;
    }

    // For "General Health", show only if user has toggled it on
    if (user.primaryGoal === 'General Health') {
      return showOvulationWindow;
    }

    return false;
  };



  const getFertilityWindowTitle = () => {
    if (user?.primaryGoal === 'Trying to Conceive') {
      return 'Peak Fertility';
    }
    if (user?.primaryGoal === 'Trying to Avoid Pregnancy') {
      return 'High Risk Period';
    }
    return 'Your Ovulation Window';
  };



  if (loading) {
    return <Loader message="Loading your cycles..." size="lg" fullScreen />;
  }

  return (
    <div className="app-page relative">
      <div className="app-container">
        <AppHeader
          title="4HER"
          subtitle={`Welcome back, ${user?.fullName || user?.email || 'friend'}`}
          right={
            user?.role === 'admin' ? (
              <button
                onClick={() => navigate('/admin/users')}
                className="btn-outline"
                title="Admin: Users"
                aria-label="Admin: Users"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </button>
            ) : null
          }
        />

        {/* Cycle Variability Insight */}
        {cycleAnalysis?.hasDeviation && cycleAnalysis.insight && (
          <div className="mb-6 surface p-4 border-amber-200 bg-amber-50/70">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-800 mb-1">Cycle Insight</p>
                <p className="text-sm text-amber-700">{cycleAnalysis.insight.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Next Period Card */}
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-lavender-100 rounded-lg">
                <Calendar className="w-5 h-5 text-lavender-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Next Period</h3>
            </div>
            {nextPeriod ? (
              <div>
                <div className="text-2xl font-bold text-lavender-600 mb-1">
                  {format(nextPeriod.date, 'MMM dd')}
                </div>
                <p className="text-sm text-gray-600">
                  {nextPeriod.daysUntil === 0
                    ? 'Expected today'
                    : nextPeriod.daysUntil === 1
                      ? 'Expected in 1 day'
                      : `Expected in ${nextPeriod.daysUntil} days`}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Log your first cycle</p>
            )}
          </div>

          {/* Peak Fertility Card (if applicable) */}
          {shouldShowFertilityWindow() && ovulationWindow && (
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${user?.primaryGoal === 'Trying to Conceive'
                  ? 'bg-teal-100'
                  : user?.primaryGoal === 'Trying to Avoid Pregnancy'
                    ? 'bg-amber-100'
                    : 'bg-lavender-100'
                  }`}>
                  <Heart className={`w-5 h-5 ${user?.primaryGoal === 'Trying to Conceive'
                    ? 'text-teal-600'
                    : user?.primaryGoal === 'Trying to Avoid Pregnancy'
                      ? 'text-amber-600'
                      : 'text-lavender-600'
                    }`} />
                </div>
                <h3 className="font-semibold text-gray-800">{getFertilityWindowTitle()}</h3>
              </div>
              <div>
                <div className={`text-2xl font-bold mb-1 ${ovulationWindow.isActive
                  ? user?.primaryGoal === 'Trying to Conceive'
                    ? 'text-teal-600'
                    : user?.primaryGoal === 'Trying to Avoid Pregnancy'
                      ? 'text-amber-600'
                      : 'text-lavender-600'
                  : 'text-gray-600'
                  }`}>
                  {ovulationWindow.isActive ? 'Active' : 'Upcoming'}
                </div>
                <p className="text-sm text-gray-600">
                  {format(ovulationWindow.start, 'MMM dd')} - {format(ovulationWindow.end, 'MMM dd')}
                </p>
              </div>
            </div>
          )}

          {/* Cycle Health Card */}
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Cycle Health</h3>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {cycles.length > 0 ? 'Good' : '-'}
              </div>
              {cycleAnalysis?.variability ? (
                <p className="text-sm text-gray-600">
                  Avg Cycle: {cycleAnalysis.variability.average} days
                </p>
              ) : (
                <p className="text-sm text-gray-500">Log cycles to track</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setShowDailyLog(false);
            }}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Log Period'}
          </button>
          <button
            onClick={() => {
              setShowDailyLog(!showDailyLog);
              setShowForm(false);
              setSelectedDate(new Date());
            }}
            className="btn-secondary"
          >
            <FileText className="w-5 h-5" />
            {showDailyLog ? 'Cancel' : 'Daily Tx'}
          </button>
        </div>

        {/* Cycle Log Form */}
        {showForm && (
          <div className="mb-6">
            <CycleLogForm
              onCycleAdded={handleCycleAdded}
              avgCycleLength={user?.avgCycleLength || 28}
            />
          </div>
        )}

        {/* Daily Log Form */}
        {showDailyLog && (
          <div className="mb-6">
            <DailyLogForm
              date={selectedDate}
              onLogSaved={handleDailyLogSaved}
              existingLog={existingDailyLog}
            />
          </div>
        )}

        {/* Two Column Layout */}
        <div className="dashboard-layout mb-6">
          {/* Main Content - Calendar and Insights */}
          <div className="dashboard-main">
            {/* Calendar View */}
            <CalendarView
              cycles={cycles}
              fertilityWindow={
                shouldShowFertilityWindow() ? ovulationWindow : null
              }
              onDateClick={(date) => {
                setSelectedDate(date);
                setShowDailyLog(true);
                setShowForm(false);
              }}
            />

            {/* Cycle Insights */}
            <CycleInsights cycles={cycles} />
          </div>

          {/* Sidebar - Recent Entries */}
          <div className="dashboard-sidebar">
            <RecentEntries cycles={cycles} />
          </div>
        </div>

        {/* Privacy Statement */}
        <div className="mt-6 mb-6 surface p-4 bg-lavender-50/70 border-lavender-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-lavender-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">Your Data Privacy</p>
              <p>Your health data is encrypted and stays with us. No selling, no sharing, no compromises.</p>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-85 bg-gradient-to-br from-lavender-600 via-lavender-500 to-teal-500 text-white"
      />
    </div>
  );
};

export default Dashboard;
