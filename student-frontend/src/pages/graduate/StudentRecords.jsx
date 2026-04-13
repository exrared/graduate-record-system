import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye } from 'lucide-react';
import Button from '../../components/Button';
import Skeleton from '../../components/Skeleton';
import { useStudentRecords } from '../../hooks/useGraduateData';

const StudentRecords = () => {
  const navigate = useNavigate();
  const { data: records, isLoading } = useStudentRecords();

  const handleDownload = (record) => {
    window.open(`/api/graduate/student-records/${record.id}/download`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <Skeleton variant="title" className="h-8 w-64 mb-2" />
          <Skeleton variant="text" className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  // ✅ FIX: Check if records is an array, otherwise use empty array
  const recordsArray = Array.isArray(records) ? records : [];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Student Records</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View and download your academic records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recordsArray.map((record) => (
          <div key={record.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{record.record_type}</h3>
                  <p className="text-xs text-gray-500">Uploaded: {new Date(record.date_uploaded).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{record.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload(record)}>
                  <Eye className="w-4 h-4 mr-1" />View
                </Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => handleDownload(record)}>
                  <Download className="w-4 h-4 mr-1" />Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recordsArray.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No records available</p>
        </div>
      )}
    </div>
  );
};

export default StudentRecords;