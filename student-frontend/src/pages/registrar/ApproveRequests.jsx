import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, RefreshCw, MessageCircle } from 'lucide-react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import Skeleton from '../../components/Skeleton';
import api from '../../services/api';

const ApproveRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/registrar/requests/pending');
      setRequests(res.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleApprove = async () => {
    try {
      await api.put(`/registrar/requests/${selectedRequest.id}/approve`, { remarks });
      setToast({ isOpen: true, message: 'Request approved successfully!', type: 'success' });
      setIsApproveModalOpen(false);
      fetchPendingRequests();
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to approve request', type: 'error' });
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      setToast({ isOpen: true, message: 'Please provide a reason for rejection', type: 'error' });
      return;
    }
    try {
      await api.put(`/registrar/requests/${selectedRequest.id}/reject`, { remarks });
      setToast({ isOpen: true, message: 'Request rejected', type: 'success' });
      setIsRejectModalOpen(false);
      fetchPendingRequests();
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to reject request', type: 'error' });
    }
  };

  if (loading) {
    return <Skeleton variant="card" className="h-96" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pending Approvals ({requests.length})</h2>
        <Button onClick={fetchPendingRequests} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
          <p className="text-gray-500">No pending requests to approve</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Request #{request.id}</h3>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                  </div>
                  <p className="text-gray-600"><strong>Student:</strong> {request.graduate?.firstname} {request.graduate?.lastname}</p>
                  <p className="text-gray-600"><strong>Document:</strong> {request.request_type}</p>
                  <p className="text-gray-600"><strong>Quantity:</strong> {request.quantity} copy/copies</p>
                  <p className="text-gray-600"><strong>Purpose:</strong> {request.purpose}</p>
                  <p className="text-gray-500 text-sm mt-2">Submitted: {new Date(request.request_date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigate(`/registrar/requests/${request.id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      setSelectedRequest(request);
                      setRemarks('');
                      setIsApproveModalOpen(true);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setSelectedRequest(request);
                      setRemarks('');
                      setIsRejectModalOpen(true);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve Modal */}
      <Modal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} title="Approve Request" size="md">
        <div className="space-y-4">
          <p>Are you sure you want to approve this request?</p>
          <div>
            <label className="block text-sm font-medium mb-2">Remarks (Optional)</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Add any remarks..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleApprove}>Confirm Approve</Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Request" size="md">
        <div className="space-y-4">
          <p>Please provide a reason for rejection:</p>
          <div>
            <label className="block text-sm font-medium mb-2">Reason *</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Explain why this request is being rejected..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleReject}>Confirm Reject</Button>
          </div>
        </div>
      </Modal>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </div>
  );
};

export default ApproveRequests;