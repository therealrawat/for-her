import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from './Loader';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader message="Loading your data..." size="lg" fullScreen />;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

