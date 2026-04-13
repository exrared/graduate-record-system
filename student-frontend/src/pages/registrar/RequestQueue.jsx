import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Skeleton from '../../components/Skeleton';
import api from '../../services/api';

const RequestQueue = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('request_type', typeFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const res = await api.get(`/registrar/requests?${params.toString()}`);
      setRequests(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, typeFilter]);

  const handleSearch = () => {
    fetchRequests();
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      ready: 'bg-purple-100 text-purple-800',
      completed: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  const columns = [
    { key: 'id', header: 'ID', width: '5%' },
    { key: 'graduate_name', header: 'Student', render: (item) => `${item.graduate?.firstname || ''} ${item.graduate?.lastname || ''}` },
    { key: 'request_type', header: 'Document' },
    { key: 'quantity', header: 'Copies' },
    { key: 'request_date', header: 'Date', render: (item) => new Date(item.request_date).toLocaleDateString() },
    { key: 'request_status', header: 'Status', render: (item) => getStatusBadge(item.request_status) },
    { key: 'payment_status', header: 'Payment', render: (item) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {item.payment_status || 'unpaid'}
      </span>
    ) },
    { key: 'actions', header: '', render: (item) => (
      <Button variant="ghost" size="sm" onClick={() => navigate(`/registrar/requests/${item.id}`)}>
        <Eye className="w-4 h-4" />
      </Button>
    ) },
  ];

  if (loading) {
    return <Skeleton variant="card" className="h-96" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="approved">Approved</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Types</option>
          <option value="TOR">Transcript of Records</option>
          <option value="Diploma">Diploma</option>
          <option value="Certificate">Certificate</option>
          <option value="GMC">Good Moral Certificate</option>
        </select>
        <Button onClick={handleSearch} variant="primary">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button onClick={fetchRequests} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Table data={requests} columns={columns} emptyState="No requests found." />
    </div>
  );
};

export default RequestQueue;