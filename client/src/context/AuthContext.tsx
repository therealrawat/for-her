import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../utils/api';
import type { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (
    fullName: string,
    email: string | undefined,
    password: string | undefined,
    avgCycleLength: number,
    birthYear: number,
    contraceptiveUse: User['contraceptiveUse'],
    primaryGoal: User['primaryGoal'],
    isAnonymous?: boolean
  ) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    const { token, ...userData } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData as User);
    return userData as User;
  };

  const signup = async (
    fullName: string,
    email: string | undefined,
    password: string | undefined,
    avgCycleLength: number,
    birthYear: number,
    contraceptiveUse: User['contraceptiveUse'],
    primaryGoal: User['primaryGoal'],
    isAnonymous = false
  ) => {
    const response = await api.post<AuthResponse>('/auth/signup', {
      fullName,
      email,
      password,
      avgCycleLength,
      birthYear,
      contraceptiveUse,
      primaryGoal,
      isAnonymous,
    });
    const { token, ...userData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/user/account');
      // Clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, deleteAccount, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

