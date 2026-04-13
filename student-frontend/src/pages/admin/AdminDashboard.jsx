import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, FileText, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import Skeleton from '../../components/Skeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_admins: 0,
    total_registrars: 0,
    total_graduates: 0,
    total_records: 0,
    total_requests: 0,
    pending_requests: 0,
    completed_requests: 0,
    active_users: 0,
    inactive_users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dashboard');
      console.log('API Response:', response.data);
      
      // The data is in response.data.stats
      const dashboardData = response.data.stats || response.data;
      setStats(dashboardData);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.total_users, icon: Users, color: 'indigo' },
    { title: 'Active Users', value: stats.active_users, icon: UserCheck, color: 'green' },
    { title: 'Inactive Users', value: stats.inactive_users, icon: UserX, color: 'red' },
    { title: 'Total Requests', value: stats.total_requests, icon: FileText, color: 'blue' },
    { title: 'Pending Requests', value: stats.pending_requests, icon: Clock, color: 'yellow' },
    { title: 'Completed Requests', value: stats.completed_requests, icon: CheckCircle, color: 'emerald' },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton variant="title" className="h-8 w-48 mb-2" />
          <Skeleton variant="text" className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of system statistics and user management
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;