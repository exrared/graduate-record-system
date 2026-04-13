import React, { useState } from 'react';
import { BarChart3, Download, Calendar, FileText, TrendingUp, Users } from 'lucide-react';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import api from '../../services/api';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });
  const [reportType, setReportType] = useState('requests');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const reportOptions = [
    { value: 'requests', label: 'Requests Summary', icon: FileText },
    { value: 'payments', label: 'Payments Report', icon: TrendingUp },
    { value: 'graduates', label: 'Graduates List', icon: Users },
    { value: 'documents', label: 'Documents Issued', icon: BarChart3 },
  ];

  const handleExport = async () => {
    setLoading(true);
    try {
      window.open(`/api/registrar/reports/${reportType}?start_date=${dateRange.start_date}&end_date=${dateRange.end_date}`, '_blank');
      setToast({ isOpen: true, message: 'Report generated successfully!', type: 'success' });
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to generate report', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Generate Reports</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Report Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setReportType(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    reportType === option.value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${reportType === option.value ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium">{option.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleExport} variant="primary" disabled={loading}>
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </div>
  );
};

export default Reports;