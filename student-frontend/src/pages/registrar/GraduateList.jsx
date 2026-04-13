import React, { useState, useEffect } from 'react';
import { Search, Eye, RefreshCw, User } from 'lucide-react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Skeleton from '../../components/Skeleton';
import api from '../../services/api';

const GraduatesList = () => {
  const [graduates, setGraduates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGraduate, setSelectedGraduate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchGraduates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      const res = await api.get(`/registrar/graduates?${params.toString()}`);
      setGraduates(res.data?.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraduates();
  }, [searchTerm]);

  const columns = [
    { key: 'student_id', header: 'Student ID' },
    { key: 'name', header: 'Name', render: (item) => `${item.firstname} ${item.lastname}` },
    { key: 'course', header: 'Course' },
    { key: 'year_graduated', header: 'Year Graduated' },
    { key: 'email', header: 'Email' },
    { key: 'contact_number', header: 'Contact' },
    { key: 'actions', header: '', render: (item) => (
      <Button variant="ghost" size="sm" onClick={() => {
        setSelectedGraduate(item);
        setIsViewModalOpen(true);
      }}>
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
            placeholder="Search by name or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <Button onClick={fetchGraduates} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Table data={graduates} columns={columns} emptyState="No graduates found." />

      {/* View Graduate Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Graduate Details" size="lg">
        {selectedGraduate && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {selectedGraduate.firstname?.[0]}{selectedGraduate.lastname?.[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedGraduate.firstname} {selectedGraduate.lastname}</h3>
                <p className="text-gray-500">{selectedGraduate.student_id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Email</p><p>{selectedGraduate.email}</p></div>
              <div><p className="text-xs text-gray-500">Contact</p><p>{selectedGraduate.contact_number || 'N/A'}</p></div>
              <div><p className="text-xs text-gray-500">Course</p><p>{selectedGraduate.course}</p></div>
              <div><p className="text-xs text-gray-500">Department</p><p>{selectedGraduate.department || 'N/A'}</p></div>
              <div><p className="text-xs text-gray-500">Year Graduated</p><p>{selectedGraduate.year_graduated}</p></div>
              <div><p className="text-xs text-gray-500">Honors</p><p>{selectedGraduate.honors || 'None'}</p></div>
              <div><p className="text-xs text-gray-500">Civil Status</p><p>{selectedGraduate.civil_status || 'N/A'}</p></div>
              <div><p className="text-xs text-gray-500">Gender</p><p>{selectedGraduate.gender || 'N/A'}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GraduatesList;