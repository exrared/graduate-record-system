import React from 'react'
import { LayoutDashboard, Users, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { BarChart3, PieChart } from 'lucide-react'

const UserOverview = () => {
  const stats = [
    { name: 'Total Requests', value: '12', change: '+3', icon: FileText, color: 'indigo' },
    { name: 'Pending', value: '3', change: '0', icon: Clock, color: 'yellow' },
    { name: 'Approved', value: '7', change: '+2', icon: CheckCircle, color: 'green' },
    { name: 'Completed', value: '2', change: '+1', icon: Users, color: 'blue' }
  ]

  const recentRequests = [
    { id: 'REQ-001', doc: 'Transcript', status: 'Approved', date: '2026-03-10' },
    { id: 'REQ-002', doc: 'TOR', status: 'Pending', date: '2026-03-08' },
    { id: 'REQ-003', doc: 'Diploma', status: 'Ready', date: '2026-03-05' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Quick stats and recent activity</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated</p>
          <p className="font-semibold text-gray-900 dark:text-white">3 minutes ago</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold text-gray-900 dark:text-white`}>{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
                  <p className={`text-xs font-medium ${stat.change.includes('+') ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {stat.change} from last month
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Requests</h2>
            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-sm font-medium">
              View All →
            </button>
          </div>
          
          <div className="space-y-3">
            {recentRequests.map((req) => (
              <div key={req.id} className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mr-3 ${
                  req.status === 'Approved' ? 'bg-green-500' :
                  req.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{req.doc}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">#{req.id} • {req.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  req.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                  req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
        <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm">New Document Request</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Track Request</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm">View Billing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section (Static for demo) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Status</h3>
            <select className="text-sm border rounded-lg px-3 py-1">
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p>Chart will display here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Types</h3>
          </div>
          <div className="h-64 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <PieChart className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p>Pie chart preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserOverview

