import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle, User, CreditCard, 
  History, FilePlus, LayoutDashboard, Activity, 
  Calendar, DollarSign, Bell, ArrowRight, 
  MessageCircle, X, Send, Mail, Phone
} from 'lucide-react';
import { useDashboardData, useProfileCompletion } from '../../hooks/useGraduateData';
import Skeleton from '../../components/Skeleton';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

const GraduateDashboard = () => {
  const navigate = useNavigate();
  const { data: dashboard, isLoading: dashboardLoading } = useDashboardData();
  const { data: profileCompletion, isLoading: profileLoading } = useProfileCompletion();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  if (dashboardLoading || profileLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton variant="title" className="h-8 w-64 mb-2" />
            <Skeleton variant="text" className="h-4 w-96" />
          </div>
          <Skeleton variant="button" className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Requests',
      value: dashboard?.totalRequests || 0,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      onClick: () => navigate('/request-history'),
    },
    {
      title: 'Pending Requests',
      value: dashboard?.pendingRequests || 0,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600',
      onClick: () => navigate('/track-requests'),
    },
    {
      title: 'Approved/Scheduled',
      value: dashboard?.approvedRequests || 0,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      onClick: () => navigate('/track-requests'),
    },
    {
      title: 'Profile Completion',
      value: `${profileCompletion?.percentage || 0}%`,
      icon: User,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      onClick: () => navigate('/profile'),
    },
  ];

  const actionCards = [
    {
      icon: FilePlus,
      title: 'Request Document',
      description: 'Request transcript, diploma, or certificates',
      color: 'indigo',
      path: '/request-documents',
    },
    {
      icon: Clock,
      title: 'Track Request',
      description: 'Monitor your request status',
      color: 'green',
      path: '/track-requests',
    },
    {
      icon: History,
      title: 'Request History',
      description: 'View all your past requests',
      color: 'blue',
      path: '/request-history',
    },
    {
      icon: CreditCard,
      title: 'Billing & Payment',
      description: 'Manage payments and invoices',
      color: 'purple',
      path: '/billing',
    },
    {
      icon: FileText,
      title: 'Student Records',
      description: 'View your academic records',
      color: 'teal',
      path: '/student-records',
    },
    {
      icon: User,
      title: 'My Profile',
      description: 'Update your personal information',
      color: 'orange',
      path: '/profile',
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'ready': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-emerald-600 bg-emerald-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleContactSupport = () => {
    setIsSupportModalOpen(true);
  };

const handleSubmitSupport = async () => {
  if (!supportMessage.trim()) {
    setToast({
      isOpen: true,
      message: 'Please enter your message',
      type: 'error',
    });
    return;
  }

  setIsSubmitting(true);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/support/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message: supportMessage }),
    });

    const data = await response.json();

    if (response.ok) {
      setToast({
        isOpen: true,
        message: data.message || 'Message sent successfully!',
        type: 'success',
      });
      setIsSupportModalOpen(false);
      setSupportMessage('');
    } else {
      setToast({
        isOpen: true,
        message: data.message || 'Failed to send message',
        type: 'error',
      });
    }
  } catch (error) {
    setToast({
      isOpen: true,
      message: 'Network error. Please try again.',
      type: 'error',
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {dashboard?.graduateName || user?.name || 'Graduate'}!
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage your document requests, track progress, and access your records
          </p>
        </div>
        
        {profileCompletion?.percentage < 100 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Profile {profileCompletion?.percentage}% Complete
              </p>
              <div className="w-32 bg-yellow-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-yellow-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${profileCompletion?.percentage || 0}%` }}
                />
              </div>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate('/profile')}
            >
              Complete Now
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              onClick={stat.onClick}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 
                       hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
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

      {/* Main Action Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5" />
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => navigate(card.path)}
                className="group relative bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl 
                         hover:-translate-y-2 hover:ring-4 hover:ring-indigo-100 dark:hover:ring-indigo-900/50 
                         rounded-xl p-6 border border-gray-200 dark:border-gray-700 
                         transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 
                              from-indigo-500 to-purple-600 transition-opacity duration-300" />
                
                <div className="relative z-10 mb-4">
                  <div className={`p-3 rounded-xl bg-${card.color}-50 dark:bg-${card.color}-900/20 
                                group-hover:scale-110 transition-transform duration-300 inline-block`}>
                    <Icon className={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 
                               group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 
                              transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <ArrowRight className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Requests & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Requests
              </h2>
              <button 
                onClick={() => navigate('/request-history')}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {dashboard?.recentRequests?.length > 0 ? (
              dashboard.recentRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  onClick={() => navigate(`/track-requests?id=${request.id}`)}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {request.request_type}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.request_status)}`}>
                          {request.request_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        #{request.id} • {new Date(request.request_date).toLocaleDateString()}
                      </p>
                    </div>
                    {request.payment_status === 'unpaid' && request.request_status === 'approved' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/billing');
                        }}
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No requests yet</p>
                <button
                  onClick={() => navigate('/request-documents')}
                  className="mt-3 text-indigo-600 hover:text-indigo-500 text-sm font-medium inline-flex items-center gap-1"
                >
                  Create your first request
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Quick Overview
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Spent</span>
              </div>
              <span className="font-bold text-lg text-green-600">
                ₱{dashboard?.totalSpent || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Actions</span>
              </div>
              <span className="font-bold text-lg text-yellow-600">
                {dashboard?.pendingActions || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed Requests</span>
              </div>
              <span className="font-bold text-lg text-blue-600">
                {dashboard?.completedRequests || 0}
              </span>
            </div>
          </div>
          
          {/* Help/Support - NOW FUNCTIONAL */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Contact the Registrar's Office for assistance with your requests.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleContactSupport}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('tel:+1234567890')}
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support Modal */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => {
          setIsSupportModalOpen(false);
          setSupportMessage('');
        }}
        title="Contact Support"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Support Information</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email: <a href="mailto:registrar@gradtrack.edu" className="text-blue-600 hover:underline">registrar@gradtrack.edu</a>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Phone: <a href="tel:+1234567890" className="text-blue-600 hover:underline">+1 (234) 567-890</a>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Message *
            </label>
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              rows="5"
              placeholder="Describe your issue or question here..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                       focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Our support team will respond within 24-48 hours.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="secondary" 
              onClick={() => {
                setIsSupportModalOpen(false);
                setSupportMessage('');
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmitSupport}
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default GraduateDashboard;