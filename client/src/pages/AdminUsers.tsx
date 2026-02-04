import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import type { User } from '../types';
import { Users, Mail, Calendar } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<User[]>('/user/all');
        setUsers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-page">
      <div className="app-container">
        <AppHeader
          title="Users"
          subtitle="Super admin only · Track growth for future engagement."
          backTo="/dashboard"
          right={
            <button
              className="btn-outline"
              onClick={() => navigate('/dashboard')}
              title="Back to dashboard"
              aria-label="Back to dashboard"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          }
        />

        <div className="mb-6 surface p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">Total users</div>
          <div className="text-2xl font-semibold text-lavender-700">{users.length}</div>
        </div>

        {loading && (
          <div className="card">
            <p className="text-lavender-700 font-medium">Loading users...</p>
          </div>
        )}

        {error && !loading && (
          <div className="surface p-4 border-red-200 bg-red-50/70 text-red-700">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="surface-strong p-0 overflow-x-auto">
            {users.length === 0 ? (
              <div className="p-6">
                <p className="text-sm text-gray-500">No users registered yet.</p>
              </div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50/60">
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </span>
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Joined
                      </span>
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Primary goal</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Contraceptive</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">{u.fullName}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {u.email || <span className="text-xs text-gray-400">Anonymous</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {/* createdAt is present on the backend model; cast to any to avoid strict typing here */}
                        {/*
                          We defensively handle absence to avoid runtime issues if older records lack this field client-side.
                        */}
                        <span className="text-xs text-gray-500">
                          {(u as any).createdAt
                            ? new Date((u as any).createdAt).toLocaleDateString()
                            : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{u.primaryGoal}</td>
                      <td className="py-3 px-4 text-gray-700 text-xs">{u.contraceptiveUse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

