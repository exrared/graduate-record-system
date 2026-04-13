import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Clock, CheckCircle, AlertCircle, XCircle, Calendar, 
  MapPin, Search, Eye, ChevronDown, ChevronUp,
  Package, Truck, FileText, CreditCard, Download, RefreshCw
} from 'lucide-react';
import Button from '../../components/Button';
import Skeleton from '../../components/Skeleton';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import { useRequests } from '../../hooks/useGraduateData';

const TrackRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: requests, isLoading, refetch } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestId = params.get('id');
    if (requestId && requests) {
      const request = requests.find(r => r.id == requestId);
      if (request) setSelectedRequest(request);
    }
  }, [location, requests]);

  const statusConfig = {
    pending: { label: 'Pending', color: 'yellow', icon: Clock, progress: 20, description: 'Your request is waiting for review.' },
    processing: { label: 'Processing', color: 'blue', icon: Package, progress: 40, description: 'Your request is being processed.' },
    approved: { label: 'Approved', color: 'green', icon: CheckCircle, progress: 60, description: 'Your request has been approved!' },
    ready: { label: 'Ready for Pickup', color: 'purple', icon: Truck, progress: 80, description: 'Your document is ready for pickup.' },
    completed: { label: 'Completed', color: 'green', icon: CheckCircle, progress: 100, description: 'Your document has been released.' },
    rejected: { label: 'Rejected', color: 'red', icon: XCircle, progress: 0, description: 'Your request was rejected.' },
    cancelled: { label: 'Cancelled', color: 'gray', icon: XCircle, progress: 0, description: 'Your request was cancelled.' }
  };

  const filteredRequests = requests?.filter(request => {
    const matchesSearch = !searchTerm || request.id.toString().includes(searchTerm) || request.request_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.request_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}><Icon className="w-3.5 h-3.5" />{config.label}</span>;
  };

  const getProgressBar = (status) => {
    const progress = statusConfig[status]?.progress || 0;
    const color = status === 'rejected' || status === 'cancelled' ? 'red' : status === 'completed' ? 'green' : status === 'ready' ? 'purple' : status === 'approved' ? 'green' : status === 'processing' ? 'blue' : 'yellow';
    return <div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full bg-${color}-500`} style={{ width: `${progress}%` }} /></div>;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => { setIsRefreshing(false); setToast({ isOpen: true, message: 'Requests refreshed!', type: 'success' }); }, 1000);
  };

  const handleViewDetails = (request) => setSelectedRequest(request);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6"><div><Skeleton variant="title" className="h-8 w-48 mb-2" /><Skeleton variant="text" className="h-4 w-64" /></div><Skeleton variant="button" className="h-10 w-32" /></div>
        <div className="space-y-4">{[...Array(3)].map((_, i) => (<Skeleton key={i} variant="card" className="h-40" />))}</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div><h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Track Requests</h1><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monitor your document requests in real-time</p></div>
        <Button onClick={handleRefresh} variant="secondary" disabled={isRefreshing}><RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />{isRefreshing ? 'Refreshing...' : 'Refresh'}</Button>
      </div>

      {requests && requests.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border"><p className="text-2xl font-bold">{requests.length}</p><p className="text-xs text-gray-500">Total Requests</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border"><p className="text-2xl font-bold text-yellow-600">{requests.filter(r => r.request_status === 'pending').length}</p><p className="text-xs text-gray-500">Pending</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border"><p className="text-2xl font-bold text-blue-600">{requests.filter(r => r.request_status === 'processing').length}</p><p className="text-xs text-gray-500">Processing</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border"><p className="text-2xl font-bold text-green-600">{requests.filter(r => r.request_status === 'ready' || r.request_status === 'completed').length}</p><p className="text-xs text-gray-500">Ready/Completed</p></div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by Request ID or Document Type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"><option value="all">All Status</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="approved">Approved</option><option value="ready">Ready</option><option value="completed">Completed</option><option value="rejected">Rejected</option></select>
      </div>

      {filteredRequests && filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const status = statusConfig[request.request_status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const schedule = request.schedule;
            return (
              <div key={request.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition">
                <div className="p-6 cursor-pointer" onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold">{request.request_type}</h3>
                        {getStatusBadge(request.request_status)}
                        {request.payment_status === 'unpaid' && request.request_status === 'approved' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><CreditCard className="w-3 h-3" />Payment Required</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Request #{request.id}</p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{request.purpose}</p>
                    </div>
                    <div className="flex items-center gap-3"><div className="text-right"><p className="text-sm text-gray-500">Requested on</p><p className="text-sm font-medium">{new Date(request.request_date).toLocaleDateString()}</p></div><Button variant="ghost" size="sm">{expandedRequest === request.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</Button></div>
                  </div>
                  <div className="mt-4">{getProgressBar(request.request_status)}</div>
                </div>

                {expandedRequest === request.id && (
                  <div className="border-t p-6 bg-gray-50 dark:bg-gray-700/30">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4" />Request Progress</h4>
                        <div className="mt-4 p-4 bg-white rounded-lg"><div className="flex items-start gap-3"><StatusIcon className={`w-5 h-5 text-${status.color}-500 mt-0.5`} /><div><p className="font-medium">{status.label}</p><p className="text-sm text-gray-600 mt-1">{status.description}</p></div></div></div>
                        {request.remarks && <div className="mt-4 p-4 bg-yellow-50 rounded-lg"><p className="text-sm font-medium text-yellow-800">Remarks:</p><p className="text-sm text-yellow-700">{request.remarks}</p></div>}
                      </div>
                      <div>
                        {schedule && (
                          <div className="mb-6"><h4 className="font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" />Release Schedule</h4><div className="bg-green-50 border border-green-200 rounded-lg p-4"><div className="grid grid-cols-1 gap-3"><div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-green-600" /><div><p className="text-xs text-gray-500">Release Date</p><p className="font-medium">{new Date(schedule.release_date).toLocaleDateString()}</p></div></div><div className="flex items-center gap-3"><Clock className="w-5 h-5 text-green-600" /><div><p className="text-xs text-gray-500">Release Time</p><p className="font-medium">{schedule.release_time}</p></div></div><div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-green-600" /><div><p className="text-xs text-gray-500">Location</p><p className="font-medium">{schedule.location}</p></div></div></div></div></div>
                        )}
                        <div className="mb-6"><h4 className="font-semibold mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" />Payment Status</h4><div className={`rounded-lg p-4 border ${request.payment_status === 'paid' ? 'bg-green-50 border-green-200' : request.payment_status === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}><div className="flex items-center justify-between"><span className="font-medium">{request.payment_status === 'paid' ? 'Paid' : request.payment_status === 'pending' ? 'Pending Verification' : 'Unpaid'}</span>{request.payment_status === 'unpaid' && request.request_status === 'approved' && <Button variant="primary" size="sm" onClick={() => navigate(`/billing?request=${request.id}`)}>Pay Now</Button>}</div></div></div>
                        <div className="flex gap-3"><Button variant="outline" size="sm" onClick={() => handleViewDetails(request)} className="flex-1"><Eye className="w-4 h-4 mr-2" />Full Details</Button></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Requests Found</h3>
          <p className="text-gray-500 mb-6">{searchTerm || statusFilter !== 'all' ? 'No requests match your search criteria.' : 'You haven\'t submitted any document requests yet.'}</p>
          <Button onClick={() => navigate('/request-documents')} variant="primary">Request a Document</Button>
        </div>
      )}

      <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title="Request Details" size="lg">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Request ID</p><p className="font-semibold">#{selectedRequest.id}</p></div>
              <div><p className="text-xs text-gray-500">Status</p>{getStatusBadge(selectedRequest.request_status)}</div>
              <div><p className="text-xs text-gray-500">Document Type</p><p className="font-medium">{selectedRequest.request_type}</p></div>
              <div><p className="text-xs text-gray-500">Quantity</p><p className="font-medium">{selectedRequest.quantity} copy/copies</p></div>
              <div><p className="text-xs text-gray-500">Request Date</p><p>{new Date(selectedRequest.request_date).toLocaleDateString()}</p></div>
              <div><p className="text-xs text-gray-500">Payment Status</p><p className={`font-medium ${selectedRequest.payment_status === 'paid' ? 'text-green-600' : selectedRequest.payment_status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{selectedRequest.payment_status || 'Unpaid'}</p></div>
              <div className="col-span-2"><p className="text-xs text-gray-500">Purpose</p><p className="text-sm">{selectedRequest.purpose}</p></div>
            </div>
            {selectedRequest.schedule && (
              <div className="border-t pt-4"><h4 className="font-semibold mb-3">Release Schedule</h4><div className="bg-green-50 p-4 rounded-lg"><div className="grid grid-cols-1 gap-2"><p><strong>Date:</strong> {new Date(selectedRequest.schedule.release_date).toLocaleDateString()}</p><p><strong>Time:</strong> {selectedRequest.schedule.release_time}</p><p><strong>Location:</strong> {selectedRequest.schedule.location}</p></div></div></div>
            )}
            <div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={() => setSelectedRequest(null)}>Close</Button>{selectedRequest.payment_status === 'unpaid' && selectedRequest.request_status === 'approved' && <Button variant="primary" onClick={() => navigate(`/billing?request=${selectedRequest.id}`)}>Proceed to Payment</Button>}</div>
          </div>
        )}
      </Modal>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </div>
  );
};

export default TrackRequests;