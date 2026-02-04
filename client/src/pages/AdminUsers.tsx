import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import type { User } from '../types';
import { Users, Mail, Calendar } from 'lucide-react';

const AdminUsers = () => {
  const { user } = useAuth();
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
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-7 h-7 text-lavender-600" />
              <span>User Overview</span>
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Super admin only · Track growth of registered users for future engagement.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total users</p>
            <p className="text-2xl font-semibold text-lavender-700">{users.length}</p>
          </div>
        </div>

        {loading && (
          <div className="card">
            <p className="text-lavender-600">Loading users...</p>
          </div>
        )}

        {error && !loading && (
          <div className="card border-red-200 bg-red-50 text-red-700">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="card overflow-x-auto">
            {users.length === 0 ? (
              <p className="text-sm text-gray-500">No users registered yet.</p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-2 pr-4 font-semibold text-gray-600">Name</th>
                    <th className="py-2 pr-4 font-semibold text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </span>
                    </th>
                    <th className="py-2 pr-4 font-semibold text-gray-600">Role</th>
                    <th className="py-2 pr-4 font-semibold text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Joined
                      </span>
                    </th>
                    <th className="py-2 pr-4 font-semibold text-gray-600">Primary goal</th>
                    <th className="py-2 pr-4 font-semibold text-gray-600">Contraceptive</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 pr-4">
                        <div className="font-medium text-gray-800">{u.fullName}</div>
                      </td>
                      <td className="py-2 pr-4 text-gray-700">
                        {u.email || <span className="text-xs text-gray-400">Anonymous</span>}
                      </td>
                      <td className="py-2 pr-4">
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
                      <td className="py-2 pr-4 text-gray-700">
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
                      <td className="py-2 pr-4 text-gray-700">{u.primaryGoal}</td>
                      <td className="py-2 pr-4 text-gray-700 text-xs">{u.contraceptiveUse}</td>
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

