import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, Clock, CheckCircle, AlertCircle, Info, DollarSign, GraduationCap, Award, BookOpen, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import Skeleton from '../../components/Skeleton';
import { useCreateRequest, useProfileCompletion, useRequests } from '../../hooks/useGraduateData';

const RequestDocuments = () => {
  const navigate = useNavigate();
  const { data: profileCompletion, isLoading: profileLoading } = useProfileCompletion();
  const { data: existingRequests, refetch: refetchRequests } = useRequests();
  const createRequest = useCreateRequest();
  
  const [formData, setFormData] = useState({ request_type: '', purpose: '', quantity: 1 });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentTypes = [
    { value: 'TOR', label: 'Transcript of Records (TOR)', description: 'Official record of your academic performance', price: 150, processingDays: 3, icon: FileText, color: 'blue' },
    { value: 'Diploma', label: 'Diploma', description: 'Official certification of degree completion', price: 250, processingDays: 5, icon: GraduationCap, color: 'purple' },
    { value: 'Certificate', label: 'Certificate of Graduation', description: 'Proof of graduation from the institution', price: 75, processingDays: 2, icon: Award, color: 'green' },
    { value: 'GMC', label: 'Good Moral Certificate', description: 'Certificate of good moral character', price: 50, processingDays: 2, icon: BookOpen, color: 'orange' },
  ];

  const commonPurposes = ['Employment Application', 'Further Studies', 'Board/Bar Examination', 'Scholarship Application', 'Immigration/Visa', 'Personal Records', 'Government Requirements', 'Professional Licensing'];

  const hasPendingRequest = (docType) => existingRequests?.some(req => req.request_type === docType && ['pending', 'processing', 'approved'].includes(req.request_status));
  const getPendingRequestsCount = () => existingRequests?.filter(req => ['pending', 'processing'].includes(req.request_status)).length || 0;

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'request_type':
        if (!value) error = 'Please select a document type';
        else if (hasPendingRequest(value)) error = 'You already have a pending request for this document.';
        break;
      case 'purpose':
        if (!value.trim()) error = 'Please state the purpose of your request';
        else if (value.trim().length < 10) error = 'Please provide a more detailed purpose (minimum 10 characters)';
        else if (value.trim().length > 500) error = 'Purpose must be less than 500 characters';
        break;
      case 'quantity':
        if (!value || value < 1) error = 'Quantity must be at least 1';
        else if (value > 10) error = 'Maximum quantity is 10 copies per request';
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleQuickPurposeSelect = (purpose) => {
    setFormData(prev => ({ ...prev, purpose }));
    if (errors.purpose) setErrors(prev => ({ ...prev, purpose: '' }));
  };

  const validateForm = () => {
    const typeValid = validateField('request_type', formData.request_type);
    const purposeValid = validateField('purpose', formData.purpose);
    const quantityValid = validateField('quantity', formData.quantity);
    setTouched({ request_type: true, purpose: true, quantity: true });
    return typeValid && purposeValid && quantityValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({ isOpen: true, message: 'Please fix the errors in the form', type: 'error' });
      return;
    }
    if (profileCompletion?.percentage < 100) {
      setToast({ isOpen: true, message: 'Please complete your profile before requesting documents', type: 'error' });
      setTimeout(() => navigate('/profile'), 2000);
      return;
    }

    setIsSubmitting(true);
    try {
      await createRequest.mutateAsync({
        request_type: formData.request_type,
        purpose: formData.purpose.trim(),
        quantity: formData.quantity,
        request_date: new Date().toISOString().split('T')[0],
        request_status: 'pending',
        payment_status: 'unpaid',
      });
      setToast({ isOpen: true, message: 'Document request submitted successfully!', type: 'success' });
      setFormData({ request_type: '', purpose: '', quantity: 1 });
      setTouched({});
      refetchRequests();
      setTimeout(() => navigate('/track-requests'), 2000);
    } catch (error) {
      setToast({ isOpen: true, message: error.response?.data?.message || 'Failed to submit request', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalPrice = () => {
    const doc = documentTypes.find(d => d.value === formData.request_type);
    return doc ? doc.price * formData.quantity : 0;
  };

  if (profileLoading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="mb-6"><Skeleton variant="title" className="h-8 w-64 mb-2" /><Skeleton variant="text" className="h-4 w-96" /></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2"><Skeleton variant="card" className="h-96" /></div><div><Skeleton variant="card" className="h-80" /></div></div>
      </div>
    );
  }

  const isProfileIncomplete = profileCompletion?.percentage < 100;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group mb-4"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <div className="mb-6"><h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Request Document</h1><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Submit a new request for your academic documents.</p></div>

      {isProfileIncomplete && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3"><AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" /><div><p className="font-semibold text-yellow-800">Profile Incomplete ({profileCompletion?.percentage}%)</p><p className="text-sm text-yellow-700">Please complete your profile before requesting documents</p></div></div>
            <Button variant="primary" onClick={() => navigate('/profile')}>Complete Profile</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b"><h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="w-5 h-5" />Request Details</h2></div>
            <div className="p-6 space-y-6">
              <div><label className="block text-sm font-medium mb-2">Document Type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documentTypes.map((doc) => {
                    const Icon = doc.icon;
                    const isSelected = formData.request_type === doc.value;
                    const hasPending = hasPendingRequest(doc.value);
                    const isDisabled = isProfileIncomplete || hasPending || getPendingRequestsCount() >= 3;
                    return (
                      <button key={doc.value} type="button" onClick={() => !isDisabled && handleFieldChange('request_type', doc.value)} disabled={isDisabled} className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected ? `border-${doc.color}-500 bg-${doc.color}-50` : 'border-gray-200 hover:border-gray-300'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <div className="flex items-start gap-3"><div className={`p-2 rounded-lg ${isSelected ? `bg-${doc.color}-100` : 'bg-gray-100'}`}><Icon className={`w-5 h-5 ${isSelected ? `text-${doc.color}-600` : 'text-gray-500'}`} /></div><div className="flex-1"><p className="font-medium">{doc.label}</p><p className="text-xs text-gray-500 mt-0.5">{doc.description}</p><div className="flex items-center gap-2 mt-2"><span className={`text-xs font-semibold text-${doc.color}-600`}>₱{doc.price}</span><span className="text-xs text-gray-400">•</span><span className="text-xs text-gray-500">{doc.processingDays} days</span></div></div>{isSelected && <CheckCircle className={`w-5 h-5 text-${doc.color}-500`} />}</div>
                      </button>
                    );
                  })}
                </div>
                {errors.request_type && touched.request_type && <p className="mt-2 text-sm text-red-600">{errors.request_type}</p>}
              </div>

              <div><label className="block text-sm font-medium mb-2">Purpose of Request *</label>
                <textarea value={formData.purpose} onChange={(e) => handleFieldChange('purpose', e.target.value)} onBlur={() => handleFieldBlur('purpose')} disabled={isProfileIncomplete || !formData.request_type} rows="4" placeholder="e.g., I need this document for employment application..." className={`w-full px-4 py-3 rounded-lg border resize-none ${errors.purpose && touched.purpose ? 'border-red-500' : 'border-gray-300'} ${(!formData.request_type || isProfileIncomplete) ? 'opacity-50 cursor-not-allowed' : ''}`} />
                {errors.purpose && touched.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>}
                {formData.request_type && (<div className="mt-3"><p className="text-xs text-gray-500 mb-2">Quick suggestions:</p><div className="flex flex-wrap gap-2">{commonPurposes.map((purpose) => (<button key={purpose} type="button" onClick={() => handleQuickPurposeSelect(purpose)} className="text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition">{purpose}</button>))}</div></div>)}
              </div>

              <div><label className="block text-sm font-medium mb-2">Number of Copies *</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg"><button type="button" onClick={() => handleFieldChange('quantity', Math.max(1, formData.quantity - 1))} disabled={!formData.request_type || isProfileIncomplete || formData.quantity <= 1} className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50">-</button><input type="number" value={formData.quantity} onChange={(e) => handleFieldChange('quantity', parseInt(e.target.value) || 1)} onBlur={() => handleFieldBlur('quantity')} disabled={!formData.request_type || isProfileIncomplete} min="1" max="10" className="w-16 text-center px-2 py-2 border-x" /><button type="button" onClick={() => handleFieldChange('quantity', Math.min(10, formData.quantity + 1))} disabled={!formData.request_type || isProfileIncomplete || formData.quantity >= 10} className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50">+</button></div>
                  <p className="text-sm text-gray-500">Maximum of 10 copies</p>
                </div>
                {errors.quantity && touched.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button type="button" variant="secondary" onClick={() => navigate('/graduate-dashboard')}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isProfileIncomplete || !formData.request_type || !formData.purpose || isSubmitting || getPendingRequestsCount() >= 3} className="min-w-[150px]">{isSubmitting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Submitting...</>) : (<><Send className="w-4 h-4 mr-2" />Submit Request</>)}</Button>
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {formData.request_type && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden sticky top-20">
              <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50"><h3 className="font-semibold flex items-center gap-2"><DollarSign className="w-5 h-5" />Fee Summary</h3></div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between"><span className="text-gray-600">{documentTypes.find(d => d.value === formData.request_type)?.label}</span><span className="font-medium">₱{documentTypes.find(d => d.value === formData.request_type)?.price || 0}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Quantity</span><span className="font-medium">x{formData.quantity}</span></div>
                <div className="border-t pt-4"><div className="flex justify-between"><span className="font-semibold">Total Amount</span><span className="text-2xl font-bold text-indigo-600">₱{getTotalPrice()}</span></div><p className="text-xs text-gray-500 mt-2">* Payment is required upon request approval</p></div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden">
            <div className="p-6"><h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5" />Processing Steps</h3><div className="space-y-3 text-sm"><div className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div><p>1. Submit request online</p></div><div className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div><p>2. Registrar validates request</p></div><div className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5"></div><p>3. Make payment upon approval</p></div><div className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div><p>4. Document processing</p></div><div className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div><p>5. Release or delivery</p></div></div></div>
          </div>
        </div>
      </div>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </div>
  );
};

export default RequestDocuments;
