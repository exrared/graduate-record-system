import React, { useState } from 'react'
import { FilePlus, Download, Eye, Search, Filter, Plus } from 'lucide-react'
import Button from '../components/Button'
import Table from '../components/Table'
import Skeleton from '../components/Skeleton'
import SkeletonTable from '../components/SkeletonTable'
import Modal from '../components/Modal'

const RequestDocuments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState(null)

  // Sample data
  const documentRequests = [
    {
      id: 'REQ-001',
      document: 'Transcript of Records',
      copies: 2,
      purpose: 'Employment',
      status: 'Pending Payment',
      date: '2026-03-10',
      amount: '₱250.00'
    },
    {
      id: 'REQ-002',
      document: 'Diploma (Authenticated)',
      copies: 1,
      purpose: 'Further Studies',
      status: 'Approved',
      date: '2026-03-08',
      amount: '₱150.00'
    },
    {
      id: 'REQ-003',
      document: 'Good Moral Certificate',
      copies: 3,
      purpose: 'Scholarship',
      date: '2026-03-05',
      status: 'Ready for Pickup',
      amount: '₱75.00'
    }
  ]

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const statusColors = {
    'Pending Payment': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Ready for Pickup': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-indigo-100 text-indigo-800'
  }

  const columns = [
    { key: 'id', header: 'Request ID' },
    { key: 'document', header: 'Document Type' },
    { key: 'copies', header: 'Copies' },
    { key: 'purpose', header: 'Purpose' },
    { key: 'status', header: 'Status', render: (item) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item?.status] || 'bg-gray-100 text-gray-800'}`}>
        {item?.status || 'N/A'}
      </span>
    ) },
    { key: 'date', header: 'Date' },
    { key: 'amount', header: 'Amount' },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => {/* view details */}}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {/* download */}}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  const handleAddNew = () => setIsModalOpen(true)
  const handleSave = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton variant="title" className="h-12 w-64 mb-6" />
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all your document requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button onClick={handleAddNew} variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</label>
          {['all', 'Pending Payment', 'Approved', 'Ready for Pickup', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table
          data={documentRequests}
          columns={columns}
          emptyState="No document requests found. Create your first request above!"
        />
      </div>

      {/* New Request Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg" title="New Document Request">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Document Type *</label>
            <select className="w-full p-3 border rounded-lg">
              <option>Transcript of Records</option>
              <option>Diploma</option>
              <option>Good Moral Certificate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Number of Copies *</label>
            <input type="number" defaultValue="1" className="w-full p-3 border rounded-lg" />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Purpose of Request *</label>
          <textarea className="w-full p-3 border rounded-lg h-24" placeholder="Explain purpose..."></textarea>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Submit Request</Button>
        </div>
      </Modal>
    </div>
  )
}

export default RequestDocuments

