import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import api from '../../services/api';

const UploadDocuments = () => {
  const [formData, setFormData] = useState({
    graduate_id: '',
    record_type: '',
    description: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const recordTypes = [
    'Transcript of Records (TOR)',
    'Diploma',
    'Certificate of Graduation',
    'Good Moral Certificate',
    'Transfer Credentials',
    'Honors/Awards',
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf' && !file.type.includes('image')) {
      setToast({ isOpen: true, message: 'Only PDF and image files are allowed', type: 'error' });
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setToast({ isOpen: true, message: 'File size must be less than 5MB', type: 'error' });
      return;
    }
    setFormData({ ...formData, file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.graduate_id || !formData.record_type || !formData.file) {
      setToast({ isOpen: true, message: 'Please fill all required fields', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('graduate_id', formData.graduate_id);
      submitData.append('record_type', formData.record_type);
      submitData.append('description', formData.description);
      submitData.append('file', formData.file);
      submitData.append('uploaded_by', 'registrar');

      await api.post('/registrar/student-records', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setToast({ isOpen: true, message: 'Document uploaded successfully!', type: 'success' });
      setFormData({ graduate_id: '', record_type: '', description: '', file: null });
      document.getElementById('file-input').value = '';
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to upload document', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Upload Student Records</h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Student ID *</label>
            <input
              type="text"
              value={formData.graduate_id}
              onChange={(e) => setFormData({ ...formData, graduate_id: e.target.value })}
              placeholder="Enter student ID"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Record Type *</label>
            <select
              value={formData.record_type}
              onChange={(e) => setFormData({ ...formData, record_type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select record type</option>
              {recordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            placeholder="Additional notes about this document..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Upload File *</label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              id="file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            {formData.file ? (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">{formData.file.name}</p>
                    <p className="text-xs text-gray-500">{(formData.file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button type="button" onClick={() => setFormData({ ...formData, file: null })} className="text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</p>
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </form>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </div>
  );
};

export default UploadDocuments;