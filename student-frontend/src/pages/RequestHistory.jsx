import React from 'react'
import { History, Download, Eye, Filter, Calendar, TrendingUp } from 'lucide-react'
import Button from '../components/Button'
import Table from '../components/Table'
import Skeleton from '../components/Skeleton'

const RequestHistory = () => {
  const historyData = [
    {
      id: 'REQ-001',
      document: 'Transcript of Records',
      copies: 2,
      status: 'Completed',
      requestDate: '2026-03-10',
      completedDate: '2026-03-12',
      totalAmount: '₱250.00',
      delivery: 'Pickup'
    },
    {
      id: 'REQ-002',
      document: 'Diploma (Authenticated)',
      copies: 1,
      status: 'Completed',
      requestDate: '2026-02-28',
      completedDate: '2026-03-05',
      totalAmount: '₱450.00',
      delivery: 'Courier'
    },
    {
      id: 'REQ-003',
      document: 'Good Moral Certificate',
      copies: 3,
      status: 'Cancelled',
      requestDate: '2026-02-20',
      completedDate: 'N/A',
      totalAmount: '₱0.00',
      delivery: 'Pickup'
    },
    {
      id: 'REQ-004',
      document: 'TOR (Partial)',
      copies: 1,
      status: 'Completed',
      requestDate: '2026-01-15',
      completedDate: '2026-01-20',
      totalAmount: '₱150.00',
      delivery: 'Email'
    }
  ]

  const columns = [
    { key: 'id', header: 'Request ID' },
    { key: 'document', header: 'Document Type' },
    { key: 'copies', header: 'Copies' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
          item.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.status}
        </span>
      )
    },
    { key: 'requestDate', header: 'Requested' },
    { key: 'completedDate', header: 'Completed' },
    { key: 'totalAmount', header: 'Amount' },
    { key: 'delivery', header: 'Delivery' },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" title="View Details">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Download Receipt">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  const stats = [
    { label: 'Total Requests', value: 12, color: 'indigo' },
    { label: 'Completed', value: 8, color: 'emerald' },
    { label: 'Pending', value: 2, color: 'yellow' },
    { label: 'Cancelled', value: 2, color: 'red' },
    { label: 'Total Spent', value: '₱2,450', color: 'blue' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Request History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Complete record of all your document requests</p>
        </div>
        <div className="text-sm text-right">
          <p className="text-gray-500 dark:text-gray-400">Last 12 months</p>
          <p className="font-semibold text-gray-900 dark:text-white">12 total requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                <div className={`w-3 h-3 bg-${stat.color}-600 rounded-full shadow-sm`}></div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">{stat.label}</p>
              </div>
            </div>
            <div className="mt-2 h-1 bg-gradient-to-r from-gray-200 to-transparent rounded-full group-hover:from-indigo-500"></div>
          </div>
        ))}
      </div>

      {/* Filters & Export */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="w-4 h-4 text-gray-400" />
          <select className="flex-1 bg-transparent border-none focus:ring-0 text-sm">
            <option>All Status</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">2025 - 2026</span>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table
          data={historyData}
          columns={columns}
          emptyState="No request history available."
        />
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 p-8 rounded-2xl border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Request Trends</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly request pattern</p>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-r from-indigo-100 to-transparent rounded-xl opacity-60 animate-pulse"></div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 p-8 rounded-2xl border border-emerald-200">
          <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-4">Most Requested Documents</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Transcript</span>
              <span className="text-sm font-semibold text-emerald-600">8</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Diploma</span>
              <span className="text-sm font-semibold text-emerald-600">4</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">GMC</span>
              <span className="text-sm font-semibold text-emerald-600">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestHistory

