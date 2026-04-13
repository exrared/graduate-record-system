import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graduateApi } from '../services/api';

// Profile Queries
export const useGraduateProfile = () => {
  return useQuery({
    queryKey: ['graduate-profile'],
    queryFn: () => graduateApi.getProfile().then(res => res.data),
  });
};

export const useProfileCompletion = () => {
  return useQuery({
    queryKey: ['profile-completion'],
    queryFn: () => graduateApi.getProfileCompletion().then(res => res.data),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => graduateApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graduate-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion'] });
    },
  });
};

// Dashboard Query
export const useDashboardData = () => {
  return useQuery({
    queryKey: ['graduate-dashboard'],
    queryFn: () => graduateApi.getDashboard().then(res => res.data),
  });
};

// Student Records Queries
export const useStudentRecords = () => {
  return useQuery({
    queryKey: ['student-records'],
    queryFn: () => graduateApi.getStudentRecords().then(res => res.data),
  });
};

// Request Queries
export const useRequests = () => {
  return useQuery({
    queryKey: ['graduate-requests'],
    queryFn: () => graduateApi.getRequests().then(res => res.data),
  });
};

export const useRequestHistory = () => {
  return useQuery({
    queryKey: ['request-history'],
    queryFn: () => graduateApi.getRequestHistory().then(res => res.data),
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => graduateApi.createRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graduate-requests'] });
      queryClient.invalidateQueries({ queryKey: ['graduate-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['request-history'] });
    },
  });
};

// Track Request Query
export const useTrackRequest = (id) => {
  return useQuery({
    queryKey: ['track-request', id],
    queryFn: () => graduateApi.trackRequest(id).then(res => res.data),
    enabled: !!id,
  });
};

// Payment Queries
export const usePayments = () => {
  return useQuery({
    queryKey: ['graduate-payments'],
    queryFn: () => graduateApi.getPayments().then(res => res.data),
  });
};

export const useUploadPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, file, paymentMethod, referenceNumber }) => 
      graduateApi.uploadPaymentProof(requestId, file, paymentMethod, referenceNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graduate-requests'] });
      queryClient.invalidateQueries({ queryKey: ['graduate-payments'] });
    },
  });
};

export const useDownloadReceipt = () => {
  return useMutation({
    mutationFn: (paymentId) => graduateApi.downloadReceipt(paymentId),
  });
};