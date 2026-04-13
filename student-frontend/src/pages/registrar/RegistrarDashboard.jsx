import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Clock, CheckCircle, XCircle, 
  Calendar, Upload, DollarSign, Users, BarChart3, Settings,
  RefreshCw, Eye, ArrowRight
} from 'lucide-react';
import Button from '../../components/Button';
import Skeleton from '../../components/Skeleton';
import api from '../../services/api';

const RegistrarDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    processingRequests: 0,
    approvedRequests: 0,
    readyRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
    pendingPayments: 0,
    totalGraduates: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all requests
      const requestsRes = await api.get('/registrar/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const allRequests = requestsRes.data?.data || [];
      
      // Fetch pending payments
      const paymentsRes = await api.get('/registrar/payments/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const pendingPayments = paymentsRes.data || [];
      
      setStats({
        totalRequests: allRequests.length,
        pendingRequests: allRequests.filter(r => r.request_status === 'pending').length,
        processingRequests: allRequests.filter(r => r.request_status === 'processing').length,
        approvedRequests: allRequests.filter(r => r.request_status === 'approved').length,
        readyRequests: allRequests.filter(r => r.request_status === 'ready').length,
        completedRequests: allRequests.filter(r => r.request_status === 'completed').length,
        rejectedRequests: allRequests.filter(r => r.request_status === 'rejected').length,
        pendingPayments: pendingPayments.length,
        totalGraduates: [...new Set(allRequests.map(r => r.graduate_id))].length,
      });
      
      setRecentRequests(allRequests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const menuItems = [
    { title: 'Request Queue', icon: FileText, path: '/registrar/requests', color: 'blue', count: stats.pendingRequests },
    { title: 'Approve Requests', icon: CheckCircle, path: '/registrar/approve', color: 'green', count: stats.pendingRequests },
    { title: 'Schedule Manager', icon: Calendar, path: '/registrar/schedules', color: 'purple' },
    { title: 'Upload Documents', icon: Upload, path: '/registrar/upload', color: 'indigo' },
    { title: 'Verify Payments', icon: DollarSign, path: '/registrar/payments', color: 'orange', count: stats.pendingPayments },
    { title: 'Graduates List', icon: Users, path: '/registrar/graduates', color: 'teal' },
    { title: 'Reports', icon: BarChart3, path: '/registrar/reports', color: 'red' },
    { title: 'Settings', icon: Settings, path: '/registrar/settings', color: 'gray' },
  ];

  const statCards = [
    { title: 'Total Requests', value: stats.totalRequests, icon: FileText, color: 'indigo' },
    { title: 'Pending', value: stats.pendingRequests, icon: Clock, color: 'yellow' },
    { title: 'Processing', value: stats.processingRequests, icon: RefreshCw, color: 'blue' },
    { title: 'Ready', value: stats.readyRequests, icon: CheckCircle, color: 'purple' },
    { title: 'Completed', value: stats.completedRequests, icon: CheckCircle, color: 'green' },
    { title: 'Pending Payments', value: stats.pendingPayments, icon: DollarSign, color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <Skeleton variant="title" className="h-8 w-48 mb-2" />
          <Skeleton variant="text" className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Registrar Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage document requests, schedules, and student records
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Quick Actions Menu */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                onClick={() => navigate(item.path)}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 
                         hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-${item.color}-50 dark:bg-${item.color}-900/20`}>
                    <Icon className={`w-5 h-5 text-${item.color}-600`} />
                  </div>
                  {item.count > 0 && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1 group-hover:text-indigo-600 transition-colors">
                  Click to manage →
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Requests</h2>
            <button 
              onClick={() => navigate('/registrar/requests')}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentRequests.map((request) => (
            <div key={request.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">#{request.id} - {request.request_type}</p>
                  <p className="text-sm text-gray-500">Student ID: {request.graduate?.student_id || 'N/A'}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(request.request_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.request_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.request_status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.request_status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.request_status}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/registrar/requests/${request.id}`)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {recentRequests.length === 0 && (
            <div className="p-8 text-center text-gray-500">No requests yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrarDashboard;