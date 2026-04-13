import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import Skeleton from '../../components/Skeleton';
import { useRequests } from '../../hooks/useGraduateData';

const Charts = () => {
  const { data: requests, isLoading } = useRequests();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setLoading(false), 500);
    }
  }, [isLoading]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <Skeleton variant="title" className="h-8 w-64 mb-2" />
          <Skeleton variant="text" className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  const requestList = Array.isArray(requests) ? requests : [];

  // Group requests by month
  const monthlyData = {};
  requestList.forEach(req => {
    if (req?.request_date) {
      const date = new Date(req.request_date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
    }
  });

  const chartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    requests: count
  }));

  // Group by status
  const statusCount = {
    pending: requestList.filter(r => r?.request_status === 'pending').length,
    processing: requestList.filter(r => r?.request_status === 'processing').length,
    approved: requestList.filter(r => r?.request_status === 'approved').length,
    completed: requestList.filter(r => r?.request_status === 'completed').length,
    rejected: requestList.filter(r => r?.request_status === 'rejected').length,
  };

  const pieData = [
    { name: 'Pending', value: statusCount.pending, color: '#eab308' },
    { name: 'Processing', value: statusCount.processing, color: '#3b82f6' },
    { name: 'Approved', value: statusCount.approved, color: '#10b981' },
    { name: 'Completed', value: statusCount.completed, color: '#059669' },
    { name: 'Rejected', value: statusCount.rejected, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Group by document type
  const docCount = {};
  requestList.forEach(req => {
    if (req?.request_type) {
      docCount[req.request_type] = (docCount[req.request_type] || 0) + 1;
    }
  });

  const docChartData = Object.entries(docCount).map(([type, count]) => ({
    type,
    count
  }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Charts & Analytics
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visualize your request data and trends
        </p>
      </div>

      {/* Request Trends - Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border">
        <h2 className="text-lg font-semibold mb-4">Request Trends</h2>
        {chartData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#6366f1" name="Number of Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No data available. Create some requests to see charts.
          </div>
        )}
      </div>

      {/* Request Status - Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border">
          <h2 className="text-lg font-semibold mb-4">Request Status Distribution</h2>
          {pieData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Most Requested Documents - Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border">
          <h2 className="text-lg font-semibold mb-4">Most Requested Documents</h2>
          {docChartData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={docChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="type" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" name="Number of Requests" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border text-center">
          <p className="text-2xl font-bold text-indigo-600">{requestList.length}</p>
          <p className="text-xs text-gray-500">Total Requests</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border text-center">
          <p className="text-2xl font-bold text-yellow-600">{statusCount.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border text-center">
          <p className="text-2xl font-bold text-blue-600">{statusCount.processing}</p>
          <p className="text-xs text-gray-500">Processing</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border text-center">
          <p className="text-2xl font-bold text-green-600">{statusCount.completed}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border text-center">
          <p className="text-2xl font-bold text-purple-600">
            {Object.keys(docCount).length}
          </p>
          <p className="text-xs text-gray-500">Document Types</p>
        </div>
      </div>
    </div>
  );
};

export default Charts;