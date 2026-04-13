import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Filter, Calendar, TrendingUp, History as HistoryIcon, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Skeleton from '../../components/Skeleton';
import { useRequestHistory } from '../../hooks/useGraduateData';

const RequestHistory = () => {
  const navigate = useNavigate();
  const { data: historyData, isLoading } = useRequestHistory();

  // Define requestList FIRST before using it in functions
  const requestList = Array.isArray(historyData) ? historyData : [];

  // Then define functions that use requestList
  const getChartData = () => {
    if (!requestList.length) return [];
    
    // Group requests by month
    const monthlyData = {};
    requestList.forEach(req => {
      if (req?.request_date) {
        const date = new Date(req.request_date);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { month: monthYear, requests: 0, completed: 0, pending: 0 };
        }
        monthlyData[monthYear].requests++;
        
        if (req.request_status === 'completed') {
          monthlyData[monthYear].completed++;
        }
        if (req.request_status === 'pending') {
          monthlyData[monthYear].pending++;
        }
      }
    });
    
    // Sort by date
    const sortedData = Object.values(monthlyData).sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    });
    
    return sortedData;
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      ready: 'bg-purple-100 text-purple-800',
      completed: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    
    const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
    const displayText = status || 'Unknown';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style}`}>
        {displayText}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusStyles = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
    const displayText = status || 'Unpaid';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style}`}>
        {displayText}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  // CSV Export Function
  const exportToCSV = () => {
    if (!requestList.length) {
      alert('No data to export');
      return;
    }

    const headers = ['Request ID', 'Document Type', 'Copies', 'Status', 'Payment', 'Requested', 'Release'];
    
    const rows = requestList.map(item => [
      item?.id || '',
      item?.request_type || '',
      item?.quantity || '',
      item?.request_status || '',
      item?.payment_status || '',
      formatDate(item?.request_date),
      item?.schedule?.release_date ? formatDate(item.schedule.release_date) : 'Not scheduled'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `request_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const chartData = getChartData();

  const columns = [
    { 
      key: 'id', 
      header: 'Request ID',
      render: (item) => <span className="font-mono font-semibold text-indigo-600">#{item?.id || 'N/A'}</span>
    },
    { 
      key: 'request_type', 
      header: 'Document Type',
      render: (item) => <span className="font-medium">{item?.request_type || 'N/A'}</span>
    },
    { 
      key: 'quantity', 
      header: 'Copies',
      render: (item) => <span>{item?.quantity || 1}</span>
    },
    { 
      key: 'request_status', 
      header: 'Status',
      render: (item) => getStatusBadge(item?.request_status)
    },
    { 
      key: 'payment_status', 
      header: 'Payment',
      render: (item) => getPaymentStatusBadge(item?.payment_status)
    },
    { 
      key: 'request_date', 
      header: 'Requested',
      render: (item) => formatDate(item?.request_date)
    },
    { 
      key: 'schedule', 
      header: 'Release',
      render: (item) => {
        if (item?.schedule?.release_date) {
          return (
            <div>
              <p className="text-sm">{formatDate(item.schedule.release_date)}</p>
              {item.schedule.location && <p className="text-xs text-gray-500">{item.schedule.location}</p>}
            </div>
          );
        }
        return <span className="text-gray-400">Not scheduled</span>;
      }
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            title="View Details"
            onClick={() => navigate(`/track-requests?id=${item?.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {item?.payment_status === 'paid' && (
            <Button variant="ghost" size="sm" title="Download Receipt">
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton variant="title" className="h-10 w-72" />
          <Skeleton variant="text" className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (<Skeleton key={i} variant="card" className="h-24" />))}
        </div>
        <Skeleton variant="card" className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group mb-2"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Request History
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Complete record of all your document requests with schedules and payments
          </p>
        </div>
        <div className="text-sm text-right">
          <p className="text-gray-500 dark:text-gray-400">All time</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {requestList.length || 0} total requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
          <p className="text-2xl font-bold">{requestList.length}</p>
          <p className="text-xs text-gray-500">Total Requests</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
          <p className="text-2xl font-bold text-yellow-600">
            {requestList.filter(r => r?.request_status === 'pending').length}
          </p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
          <p className="text-2xl font-bold text-blue-600">
            {requestList.filter(r => r?.request_status === 'processing').length}
          </p>
          <p className="text-xs text-gray-500">Processing</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
          <p className="text-2xl font-bold text-green-600">
            {requestList.filter(r => r?.request_status === 'approved').length}
          </p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
          <p className="text-2xl font-bold text-emerald-600">
            {requestList.filter(r => r?.request_status === 'completed').length}
          </p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
          <p className="text-2xl font-bold text-teal-600">
            ₱{requestList.filter(r => r?.payment_status === 'paid').reduce((sum, r) => sum + (r?.payment?.amount || 0), 0)}
          </p>
          <p className="text-xs text-gray-500">Total Spent</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="w-4 h-4 text-gray-400" />
          <select className="flex-1 bg-transparent border-none focus:ring-0 text-sm">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">All time</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={exportToCSV}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden">
        {requestList.length > 0 ? (
          <Table
            data={requestList}
            columns={columns}
            emptyState="No request history available. Submit a request to get started."
          />
        ) : (
          <div className="p-12 text-center">
            <HistoryIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Request History</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't submitted any document requests yet.
            </p>
            <Button onClick={() => navigate('/request-documents')} variant="primary">
              Request a Document
            </Button>
          </div>
        )}
      </div>

      {/* Trends Section with Functional Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Trends Chart */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 md:p-8 rounded-2xl border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Request Trends</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly request activity</p>
            </div>
          </div>
          
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Bar dataKey="requests" fill="#6366f1" name="Total Requests" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#eab308" name="Pending" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
                <p className="text-xs mt-1">Submit requests to see trends</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Most Requested Documents */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 md:p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800">
          <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-4">Most Requested Documents</h3>
          <div className="space-y-3">
            {requestList.length > 0 ? (
              (() => {
                const docCount = {};
                requestList.forEach(req => {
                  if (req?.request_type) {
                    docCount[req.request_type] = (docCount[req.request_type] || 0) + 1;
                  }
                });
                const sortedDocs = Object.entries(docCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
                const maxCount = sortedDocs[0]?.[1] || 1;
                
                return sortedDocs.length > 0 ? (
                  <div className="space-y-3">
                    {sortedDocs.map(([doc, count], index) => (
                      <div key={doc} className="flex items-center gap-3">
                        <div className="w-8 text-sm font-semibold text-emerald-600">#{index + 1}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{doc}</span>
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{count}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(count / maxCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No data available</p>
                );
              })()
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No requests yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHistory;