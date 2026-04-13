import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const graduateApi = {
  // Profile
  getProfile: () => api.get('/graduate/profile'),
  updateProfile: (data) => api.post('/graduate/profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getProfileCompletion: () => api.get('/graduate/profile-completion'),
  
  // Dashboard
  getDashboard: () => api.get('/graduate/dashboard'),
  
  // Student Records
  getStudentRecords: () => api.get('/graduate/student-records'),
  downloadRecord: (id) => api.get(`/graduate/student-records/${id}/download`, { responseType: 'blob' }),
  
  // Document Requests
  createRequest: (data) => api.post('/graduate/requests', data),
  getRequests: () => api.get('/graduate/requests'),
  getRequestHistory: () => api.get('/graduate/requests/history'),
  trackRequest: (id) => api.get(`/graduate/requests/${id}/track`),
  
  // Payments
  getPayments: () => api.get('/graduate/payments'),
  uploadPaymentProof: (requestId, file, paymentMethod, referenceNumber) => {
    const formData = new FormData();
    formData.append('payment_proof', file);
    formData.append('payment_method', paymentMethod);
    if (referenceNumber) {
      formData.append('reference_number', referenceNumber);
    }
    return api.post(`/graduate/requests/${requestId}/payment`, formData);
  },
  downloadReceipt: (paymentId) => api.get(`/graduate/payments/${paymentId}/receipt`, { responseType: 'blob' }),
};

export default api;