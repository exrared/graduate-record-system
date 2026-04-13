import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, XCircle, Eye, RefreshCw, Download } from 'lucide-react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import Skeleton from '../../components/Skeleton';
import api from '../../services/api';

const VerifyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/registrar/payments/pending');
      setPayments(res.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const handleVerify = async (payment) => {
    try {
      await api.put(`/registrar/payments/${payment.id}/verify`);
      setToast({ isOpen: true, message: 'Payment verified successfully!', type: 'success' });
      fetchPendingPayments();
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to verify payment', type: 'error' });
    }
  };

  const handleReject = async (payment) => {
    try {
      await api.put(`/registrar/payments/${payment.id}/reject`, { remarks: 'Payment proof unclear' });
      setToast({ isOpen: true, message: 'Payment rejected', type: 'success' });
      fetchPendingPayments();
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to reject payment', type: 'error' });
    }
  };

  if (loading) {
    return <Skeleton variant="card" className="h-96" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pending Payment Verifications ({payments.length})</h2>
        <Button onClick={fetchPendingPayments} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <DollarSign className="w-16 h-16 mx-auto text-green-400 mb-4" />
          <p className="text-gray-500">No pending payments to verify</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Payment #{payment.id}</h3>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                  </div>
                  <p className="text-gray-600"><strong>Request #:</strong> {payment.request_id}</p>
                  <p className="text-gray-600"><strong>Amount:</strong> ₱{payment.amount}</p>
                  <p className="text-gray-600"><strong>Method:</strong> {payment.payment_method}</p>
                  <p className="text-gray-600"><strong>Reference:</strong> {payment.reference_number || 'N/A'}</p>
                  <p className="text-gray-500 text-sm mt-2">Date: {new Date(payment.payment_date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => {
                    setSelectedPayment(payment);
                    setIsViewModalOpen(true);
                  }}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Proof
                  </Button>
                  <Button variant="primary" onClick={() => handleVerify(payment)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify
                  </Button>
                  <Button variant="secondary" onClick={() => handleReject(payment)}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Payment Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Proof" size="lg">
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              {selectedPayment.payment_proof ? (
                <img src={selectedPayment.payment_proof} alt="Payment Proof" className="max-w-full max-h-96 mx-auto" />
              ) : (
                <p className="text-gray-500">No payment proof uploaded</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Amount</p><p className="font-medium">₱{selectedPayment.amount}</p></div>
              <div><p className="text-xs text-gray-500">Payment Method</p><p className="font-medium capitalize">{selectedPayment.payment_method}</p></div>
              <div><p className="text-xs text-gray-500">Reference Number</p><p className="font-mono">{selectedPayment.reference_number || 'N/A'}</p></div>
              <div><p className="text-xs text-gray-500">Payment Date</p><p>{new Date(selectedPayment.payment_date).toLocaleDateString()}</p></div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </div>
  );
};

export default VerifyPayments;