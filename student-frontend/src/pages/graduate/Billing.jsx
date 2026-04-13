import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Receipt, DollarSign, Filter, 
  Download, CheckCircle, AlertCircle, Clock, XCircle,
  Eye, Upload, FileText, Banknote, Wallet, Smartphone, Search,
  ArrowLeft
} from 'lucide-react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Skeleton from '../../components/Skeleton';
import SkeletonTable from '../../components/SkeletonTable';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import { usePayments, useUploadPayment, useRequests } from '../../hooks/useGraduateData';

const Billing = () => {
  const navigate = useNavigate();
  const { data: payments, isLoading: paymentsLoading, refetch: refetchPayments } = usePayments();
  const { data: requests, isLoading: requestsLoading } = useRequests();
  const uploadPayment = useUploadPayment();

  // Debug: Log the data when it loads
  React.useEffect(() => {
    console.log('=== BILLING DEBUG ===');
    console.log('Requests data:', requests);
    console.log('Payments data:', payments);
    console.log('Requests loading:', requestsLoading);
    console.log('Payments loading:', paymentsLoading);
  }, [requests, payments, requestsLoading, paymentsLoading]);
  
  const [activeTab, setActiveTab] = useState('unpaid');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const processPayments = () => {
    if (!requests || !Array.isArray(requests)) return [];
    
    return requests.map(request => {
      const payment = payments?.find(p => p?.request_id === request?.id);
      
      let amount = 0;
      switch (request?.request_type) {
        case 'TOR': amount = 150 * (request?.quantity || 1); break;
        case 'Diploma': amount = 250 * (request?.quantity || 1); break;
        case 'Certificate': amount = 75 * (request?.quantity || 1); break;
        case 'GMC': amount = 50 * (request?.quantity || 1); break;
        default: amount = 100 * (request?.quantity || 1);
      }
      
      let paymentStatus = 'unpaid';
      if (payment) paymentStatus = payment?.payment_status || 'unpaid';
      else if (request?.payment_status) paymentStatus = request.payment_status;
      
      const requestDate = request?.request_date ? new Date(request.request_date) : new Date();
      const dueDate = new Date(requestDate);
      dueDate.setDate(requestDate.getDate() + 7);
      
      return {
        id: request?.id,
        request_id: request?.id,
        invoice_no: `INV-${String(request?.id || 0).padStart(5, '0')}`,
        description: `${request?.request_type || 'Unknown'} Request`,
        document_type: request?.request_type || 'Unknown',
        quantity: request?.quantity || 1,
        amount: amount,
        date: request?.request_date || new Date().toISOString(),
        due_date: dueDate.toISOString().split('T')[0],
        status: paymentStatus,
        payment_method: payment?.payment_method || null,
        reference_number: payment?.reference_number || null,
        payment_date: payment?.payment_date || null,
        purpose: request?.purpose || '',
        request_status: request?.request_status || 'pending',
      };
    });
  };

  const billingData = processPayments();
  
  const filteredData = billingData.filter(item => {
    if (!item) return false;
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesSearch = !searchTerm || 
      (item.invoice_no && item.invoice_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const summary = {
    totalDue: filteredData.filter(i => i && i.status === 'unpaid').reduce((sum, i) => sum + (i?.amount || 0), 0),
    totalPaid: filteredData.filter(i => i && i.status === 'paid').reduce((sum, i) => sum + (i?.amount || 0), 0),
    totalPending: filteredData.filter(i => i && i.status === 'pending').reduce((sum, i) => sum + (i?.amount || 0), 0),
    overdue: filteredData.filter(i => i && i.status === 'unpaid' && new Date(i.due_date) < new Date()).reduce((sum, i) => sum + (i?.amount || 0), 0),
    totalRequests: billingData.length,
    paidCount: billingData.filter(i => i && i.status === 'paid').length,
    unpaidCount: billingData.filter(i => i && i.status === 'unpaid').length,
  };

  const handlePayNow = (request) => {
    setSelectedRequest(request);
    setPaymentMethod('');
    setReferenceNumber('');
    setPaymentFile(null);
    setIsPaymentModalOpen(true);
  };

  const handleViewDetails = (payment) => setSelectedPayment(payment);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToast({ isOpen: true, message: 'File size must be less than 5MB', type: 'error' });
        return;
      }
      setPaymentFile(file);
    }
  };

  const handleSubmitPayment = async () => {
    if (!paymentMethod) {
      setToast({ isOpen: true, message: 'Please select a payment method', type: 'error' });
      return;
    }
    if (!paymentFile) {
      setToast({ isOpen: true, message: 'Please upload proof of payment', type: 'error' });
      return;
    }

    try {
      await uploadPayment.mutateAsync({
        requestId: selectedRequest?.id,
        file: paymentFile,
        paymentMethod,
        referenceNumber,
      });
      setToast({ isOpen: true, message: 'Payment proof submitted successfully!', type: 'success' });
      setIsPaymentModalOpen(false);
      setSelectedRequest(null);
      setPaymentFile(null);
      setPaymentMethod('');
      setReferenceNumber('');
      refetchPayments();
    } catch (error) {
      setToast({ isOpen: true, message: error.response?.data?.message || 'Failed to submit payment', type: 'error' });
    }
  };

  const downloadReceipt = (payment) => {
    window.open(`/api/payments/${payment?.id}/receipt`, '_blank');
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    
    const badges = {
      paid: { color: 'green', icon: CheckCircle, text: 'Paid' },
      unpaid: { color: 'red', icon: AlertCircle, text: 'Unpaid' },
      pending: { color: 'yellow', icon: Clock, text: 'Pending' },
    };
    const badge = badges[status] || badges.unpaid;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  const columns = [
    { key: 'invoice_no', header: 'Invoice #', render: (item) => <span className="font-mono font-semibold text-indigo-600">{item?.invoice_no || 'N/A'}</span> },
    { key: 'description', header: 'Description', render: (item) => <span>{item?.description || 'N/A'}</span> },
    { key: 'document_type', header: 'Document', render: (item) => <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item?.document_type || 'N/A'}</span> },
    { key: 'amount', header: 'Amount', render: (item) => <span className="font-semibold">₱{(item?.amount || 0).toFixed(2)}</span> },
    { key: 'date', header: 'Invoice Date', render: (item) => <span>{item?.date || 'N/A'}</span> },
    { key: 'due_date', header: 'Due Date', render: (item) => <span>{item?.due_date || 'N/A'}</span> },
    { key: 'status', header: 'Status', render: (item) => getStatusBadge(item?.status) },
    { key: 'actions', header: 'Actions', render: (item) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item)}><Eye className="w-4 h-4" /></Button>
        {item?.status === 'unpaid' && <Button variant="primary" size="sm" onClick={() => handlePayNow(item)}>Pay Now</Button>}
        {item?.status === 'paid' && <Button variant="secondary" size="sm" onClick={() => downloadReceipt(item)}><Download className="w-4 h-4 mr-1" />Receipt</Button>}
      </div>
    )}
  ];

  const isLoading = paymentsLoading || requestsLoading;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton variant="title" className="h-10 w-72" />
          <Skeleton variant="text" className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (<Skeleton key={i} variant="card" className="h-32" />))}
        </div>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group mb-2"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Billing & Payments</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage invoices and payment history</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by invoice #..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 w-full sm:w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl"><DollarSign className="w-6 h-6 text-yellow-600" /></div>
            <div><p className="text-sm text-gray-600">Total Due</p><p className="text-2xl font-bold">₱{(summary.totalDue || 0).toFixed(2)}</p></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl"><CheckCircle className="w-6 h-6 text-emerald-600" /></div>
            <div><p className="text-sm text-gray-600">Total Paid</p><p className="text-2xl font-bold">₱{(summary.totalPaid || 0).toFixed(2)}</p></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl"><Clock className="w-6 h-6 text-blue-600" /></div>
            <div><p className="text-sm text-gray-600">Pending</p><p className="text-2xl font-bold">₱{(summary.totalPending || 0).toFixed(2)}</p></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl"><AlertCircle className="w-6 h-6 text-red-600" /></div>
            <div><p className="text-sm text-gray-600">Overdue</p><p className="text-2xl font-bold">₱{(summary.overdue || 0).toFixed(2)}</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden shadow-sm">
        <div className="flex flex-wrap -mb-px">
          {[
            { id: 'unpaid', label: 'Unpaid', count: summary.unpaidCount },
            { id: 'pending', label: 'Pending', count: billingData.filter(i => i && i.status === 'pending').length },
            { id: 'paid', label: 'Paid', count: summary.paidCount },
            { id: 'all', label: 'All', count: summary.totalRequests }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 md:px-6 py-3 md:py-4 font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.label} {tab.count > 0 && <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden">
        <Table data={filteredData} columns={columns} emptyState={`No ${activeTab} invoices found.`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 md:p-8 rounded-2xl border border-indigo-200">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3"><CreditCard className="w-6 h-6" />Accepted Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border"><div className="flex items-center gap-3"><Smartphone className="w-5 h-5 text-blue-600" /><span className="font-medium">GCash</span></div><span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Recommended</span></div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border"><div className="flex items-center gap-3"><Banknote className="w-5 h-5 text-green-600" /><span className="font-medium">Cash (On-site)</span></div></div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border"><div className="flex items-center gap-3"><Wallet className="w-5 h-5 text-purple-600" /><span className="font-medium">Bank Transfer</span></div></div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 md:p-8 rounded-2xl border border-emerald-200">
          <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-emerald-100 rounded-xl"><Receipt className="w-6 h-6 text-emerald-600" /></div><h3 className="text-lg font-bold">Payment Summary</h3></div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b"><span>Total Requests:</span><span className="font-semibold">{summary.totalRequests}</span></div>
            <div className="flex justify-between py-2 border-b"><span>Total Amount:</span><span className="font-semibold text-xl text-emerald-600">₱{((summary.totalPaid || 0) + (summary.totalDue || 0) + (summary.totalPending || 0)).toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Make Payment" size="md">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600">Invoice #{selectedRequest.invoice_no}</p><p className="text-2xl font-bold">₱{(selectedRequest.amount || 0).toFixed(2)}</p><p className="text-xs text-gray-500 mt-1">Due: {selectedRequest.due_date}</p></div>
            <div><label className="block text-sm font-medium mb-2">Payment Method *</label><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-2 rounded-lg border"><option value="">Select payment method</option><option value="gcash">GCash</option><option value="cash">Cash (On-site)</option><option value="bank_transfer">Bank Transfer</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Reference Number (Optional)</label><input type="text" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="e.g., GCash reference #" className="w-full px-4 py-2 rounded-lg border" /></div>
            <div><label className="block text-sm font-medium mb-2">Upload Proof of Payment *</label><div className="border-2 border-dashed rounded-lg p-4 text-center"><input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="payment-proof" /><label htmlFor="payment-proof" className="cursor-pointer">{paymentFile ? <div className="flex items-center justify-center gap-2"><FileText className="w-8 h-8 text-green-600" /><span className="text-sm">{paymentFile.name}</span><Button variant="ghost" size="sm" onClick={() => setPaymentFile(null)}>Change</Button></div> : <div className="flex flex-col items-center gap-2"><Upload className="w-8 h-8 text-gray-400" /><span className="text-sm text-gray-500">Click to upload</span><span className="text-xs text-gray-400">JPG, PNG, PDF (Max 5MB)</span></div>}</label></div></div>
            <div className="flex gap-3 justify-end pt-4"><Button variant="secondary" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmitPayment} disabled={uploadPayment.isPending}>{uploadPayment.isPending ? 'Submitting...' : 'Submit Payment'}</Button></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Payment Details" size="md">
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Invoice #</p><p className="font-semibold">{selectedPayment.invoice_no}</p></div>
              <div><p className="text-xs text-gray-500">Status</p>{getStatusBadge(selectedPayment.status)}</div>
              <div><p className="text-xs text-gray-500">Amount</p><p className="font-semibold text-lg">₱{(selectedPayment.amount || 0).toFixed(2)}</p></div>
              <div><p className="text-xs text-gray-500">Due Date</p><p className="font-semibold">{selectedPayment.due_date}</p></div>
              {selectedPayment.payment_method && <div><p className="text-xs text-gray-500">Payment Method</p><p className="capitalize">{selectedPayment.payment_method}</p></div>}
            </div>
            <div className="border-t pt-4"><p className="text-xs text-gray-500">Description</p><p>{selectedPayment.description}</p></div>
            <div className="flex justify-end">{selectedPayment.status === 'paid' && <Button variant="primary" onClick={() => downloadReceipt(selectedPayment)}><Download className="w-4 h-4 mr-2" />Download Receipt</Button>}</div>
          </div>
        )}
      </Modal>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </div>
  );
};

export default Billing;