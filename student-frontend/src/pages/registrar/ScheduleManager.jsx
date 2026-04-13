import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Save, RefreshCw, Eye } from 'lucide-react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import Skeleton from '../../components/Skeleton';
import api from '../../services/api';

const ScheduleManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    release_date: '',
    release_time: '',
    location: 'Registrar\'s Office',
  });
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const fetchApprovedRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/registrar/requests?status=approved');
      setRequests(res.data?.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const handleSetSchedule = async () => {
    if (!scheduleData.release_date || !scheduleData.release_time) {
      setToast({ isOpen: true, message: 'Please set release date and time', type: 'error' });
      return;
    }
    try {
      await api.post(`/registrar/requests/${selectedRequest.id}/schedule`, scheduleData);
      setToast({ isOpen: true, message: 'Schedule set successfully!', type: 'success' });
      setIsScheduleModalOpen(false);
      fetchApprovedRequests();
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to set schedule', type: 'error' });
    }
  };

  if (loading) {
    return <Skeleton variant="card" className="h-96" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Approved Requests - Set Release Schedule</h2>
        <Button onClick={fetchApprovedRequests} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No approved requests waiting for schedule</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Request #{request.id}</h3>
                  <p className="text-gray-600"><strong>Student:</strong> {request.graduate?.firstname} {request.graduate?.lastname}</p>
                  <p className="text-gray-600"><strong>Document:</strong> {request.request_type}</p>
                  <p className="text-gray-600"><strong>Quantity:</strong> {request.quantity} copy/copies</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      setSelectedRequest(request);
                      setScheduleData({
                        release_date: new Date().toISOString().split('T')[0],
                        release_time: '09:00',
                        location: 'Registrar\'s Office',
                      });
                      setIsScheduleModalOpen(true);
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Set Schedule
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Set Release Schedule" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Release Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={scheduleData.release_date}
                onChange={(e) => setScheduleData({ ...scheduleData, release_date: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Release Time *</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={scheduleData.release_time}
                onChange={(e) => setScheduleData({ ...scheduleData, release_time: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={scheduleData.location}
                onChange={(e) => setScheduleData({ ...scheduleData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              >
                <option>Registrar's Office</option>
                <option>Cashier's Office</option>
                <option>Student Affairs Office</option>
                <option>Delivery/Courier</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setIsScheduleModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSetSchedule}>Save Schedule</Button>
          </div>
        </div>
      </Modal>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </div>
  );
};

export default ScheduleManager;