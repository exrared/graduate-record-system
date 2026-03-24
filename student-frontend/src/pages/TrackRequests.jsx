import React, { useState } from 'react'
import { Search, Clock, CheckCircle, AlertCircle, Truck, Eye } from 'lucide-react'
import Button from '../components/Button'
import Table from '../components/Table'
import Skeleton from '../components/Skeleton'
import SkeletonTable from '../components/SkeletonTable'

const TrackRequests = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('tracking')
  const [loading, setLoading] = useState(true)

  // Sample tracking data
  const trackingData = [
    {
      id: 'REQ-001',
      document: 'Transcript of Records (2 copies)',
      status: 'Approved',
      progress: 80,
      currentStep: 'Quality Check',
      eta: '2026-03-12',
      trackingNumber: 'TRK-789012'
    },
    {
      id: 'REQ-002',
      document: 'Diploma (1 copy)',
      status: 'Processing',
      progress: 50,
      currentStep: 'Document Verification',
      eta: '2026-03-15',
      trackingNumber: 'TRK-789013'
    },
    {
      id: 'REQ-003',
      document: 'Good Moral Certificate (3 copies)',
      status: 'Ready for Pickup',
      progress: 100,
      currentStep: 'Completed',
      eta: '2026-03-11',
      trackingNumber: 'TRK-789014'
    }
  ]

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const columns = [
    { key: 'id', header: 'Request ID' },
    { key: 'document', header: 'Document', className: 'max-w-xs' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          item.status === 'Approved' ? 'bg-green-100 text-green-800' :
          item.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
          item.status === 'Ready for Pickup' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (item) => (
        <div className="w-24">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500 ${
                item.progress === 100 ? 'to-green-500' : ''
              }`}
              style={{ width: `${item.progress}%` }}
            />
          </div>
          <p className="text-sm font-medium mt-1">{item.progress}%</p>
        </div>
      )
    },
    { key: 'currentStep', header: 'Current Step' },
    { key: 'eta', header: 'ETA' },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          {item?.trackingNumber && (
            <Button variant="ghost" size="sm">
              Track
            </Button>
          )}
        </div>
      )
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton variant="title" className="h-10 w-72" />
          <Skeleton variant="text" className="h-10 w-64" />
        </div>
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Track Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time tracking of your document requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Request ID or Tracking Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <Button variant="primary">
            <Clock className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
        {[
          { id: 'tracking', label: 'Tracking', icon: Clock, count: 3 },
          { id: 'ready', label: 'Ready for Pickup', icon: CheckCircle, count: 1 },
          { id: 'issues', label: 'Needs Attention', icon: AlertCircle, count: 0 }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table
          data={trackingData}
          columns={columns}
          emptyState="No requests to track. Create a new request from Dashboard."
          searchTerm={searchTerm}
        />
      </div>

      {/* Delivery Options Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Delivery Options</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Choose how you want to receive your documents
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-white rounded-full shadow-sm">Pickup</span>
                <span className="px-2 py-1 bg-white rounded-full shadow-sm">Email</span>
                <span className="px-2 py-1 bg-white rounded-full shadow-sm">Courier</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">1 document ready</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Available for pickup today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackRequests

