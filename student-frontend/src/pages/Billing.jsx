import React, { useState } from 'react'
import { CreditCard, Receipt, DollarSign, TrendingUp, Filter, Download, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '../components/Button'
import Table from '../components/Table'
import Skeleton from '../components/Skeleton'
import SkeletonTable from '../components/SkeletonTable'

const Billing = () => {
  const [activeTab, setActiveTab] = useState('unpaid')
  const [loading, setLoading] = useState(true)

  const billingData = [
    {
      id: 'INV-001',
      description: 'Transcript Request (REQ-001) - 2 copies',
      amount: '₱250.00',
      date: '2026-03-10',
      status: 'Unpaid',
      dueDate: '2026-03-15',
      method: 'Online'
    },
    {
      id: 'INV-002',
      description: 'Diploma Auth (REQ-002) - 1 copy',
      amount: '₱450.00',
      date: '2026-03-08',
      status: 'Paid',
      dueDate: '2026-03-13',
      method: 'GCash'
    },
    {
      id: 'INV-003',
      description: 'GMC (REQ-003) - 3 copies',
      amount: '₱225.00',
      date: '2026-03-05',
      status: 'Overdue',
      dueDate: '2026-02-28',
      method: 'Cash'
    }
  ]

  const summary = {
    totalDue: '₱475.00',
    totalPaid: '₱675.00',
    overdue: '₱225.00'
  }

  const columns = [
    { key: 'id', header: 'Invoice #' },
    { key: 'description', header: 'Description' },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => (
        <span className="font-semibold text-gray-900 dark:text-white">₱{item.amount}</span>
      )
    },
    { key: 'date', header: 'Invoice Date' },
    { key: 'dueDate', header: 'Due Date' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          item?.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
          item?.status === 'Unpaid' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item?.status || 'N/A'}
        </span>
      )
    },
    {
      key: 'method',
      header: 'Payment Method',
      render: (item) => item?.method || 'N/A'
    },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm">
            <Download className="w-3 h-3" />
          </Button>
          <Button variant="primary" size="sm" disabled={item?.status === 'Paid'}>
            Pay Now
          </Button>
        </div>
      )
    }
  ]

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Payments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage invoices and payment history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 border border-yellow-200 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Due</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalDue}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 border border-emerald-200 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalPaid}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 border border-red-200 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="flex -mb-px">
          <button
            onClick={() => setActiveTab('unpaid')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'unpaid'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Unpaid ({billingData.filter(i => i.status === 'Unpaid').length})
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'paid'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Paid ({billingData.filter(i => i.status === 'Paid').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            All History
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table
          data={billingData.filter(item => activeTab === 'all' || item.status.toLowerCase() === activeTab)}
          columns={columns}
          emptyState={`No ${activeTab} invoices found.`}
        />
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 p-8 rounded-2xl border border-indigo-200">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <CreditCard className="w-7 h-7" />
            Payment Methods
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border">
              <span className="font-medium">GCash</span>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Primary</span>
                <Button variant="ghost" size="sm">Set as Primary</Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border">
              <span className="font-medium">Cash (Pickup)</span>
              <div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 p-8 rounded-2xl border border-emerald-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
              <Receipt className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment Summary</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2">
              <span>Total Requests:</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Total Amount:</span>
              <span className="font-semibold text-2xl text-emerald-600">₱2,450</span>
            </div>
            <div className="flex justify-between pt-4 border-t">
              <span className="font-semibold">Average per Request:</span>
              <span className="font-semibold text-emerald-600">₱204</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing

