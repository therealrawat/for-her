import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings as SettingsIcon, ArrowLeft } from 'lucide-react';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  backTo?: string;
  right?: ReactNode;
};

export const AppHeader = ({ title, subtitle, backTo, right }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="flex items-center gap-3 min-w-0">
          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="btn-ghost"
              title="Back"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-gray-600 truncate">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {right}
          <button
            onClick={() => navigate('/settings')}
            className="btn-outline"
            title="Settings"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button
            onClick={logout}
            className="btn-outline"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

