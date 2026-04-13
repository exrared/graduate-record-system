import React, { useState, useEffect } from 'react';
import { 
  Shield, Plus, Edit2, Trash2, CheckCircle, XCircle,
  Users, Key, Lock, Eye, EyeOff, Save, X
} from 'lucide-react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import Skeleton from '../../components/Skeleton';
import SkeletonTable from '../../components/SkeletonTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import api from '../../services/api';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, role: null });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/roles');
      setRoles(response.data);
    } catch (error) {
      setToast({
        isOpen: true,
        message: 'Failed to fetch roles',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const roleColors = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    registrar: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    user: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    graduate: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.role_name.trim()) {
      newErrors.role_name = 'Role name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (editingRole) {
        await api.put(`/admin/roles/${editingRole.id}`, formData);
        setToast({
          isOpen: true,
          message: 'Role updated successfully!',
          type: 'success',
        });
      } else {
        await api.post('/admin/roles', formData);
        setToast({
          isOpen: true,
          message: 'Role created successfully!',
          type: 'success',
        });
      }
      setIsModalOpen(false);
      setEditingRole(null);
      setFormData({ role_name: '', description: '', status: 'active' });
      fetchRoles();
    } catch (error) {
      setToast({
        isOpen: true,
        message: error.response?.data?.message || 'Failed to save role',
        type: 'error',
      });
    }
  };

  const handleDelete = async (role) => {
    setConfirmDialog({ isOpen: true, role });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/roles/${confirmDialog.role.id}`);
      setToast({
        isOpen: true,
        message: 'Role deleted successfully!',
        type: 'success',
      });
      fetchRoles();
    } catch (error) {
      setToast({
        isOpen: true,
        message: error.response?.data?.message || 'Failed to delete role',
        type: 'error',
      });
    } finally {
      setConfirmDialog({ isOpen: false, role: null });
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      role_name: role.role_name,
      description: role.description,
      status: role.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (role) => {
    try {
      const newStatus = role.status === 'active' ? 'inactive' : 'active';
      await api.put(`/admin/roles/${role.id}/status`, { status: newStatus });
      setToast({
        isOpen: true,
        message: `Role ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`,
        type: 'success',
      });
      fetchRoles();
    } catch (error) {
      setToast({
        isOpen: true,
        message: 'Failed to update role status',
        type: 'error',
      });
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      width: '5%',
    },
    {
      key: 'role_name',
      header: 'Role Name',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-500" />
          <span className="font-medium capitalize">{item.role_name}</span>
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      render: (item) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {item.description}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
        }`}>
          {item.status === 'active' ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          {item.status || 'active'}
        </span>
      )
    },
    {
      key: 'date_created',
      header: 'Date Created',
      render: (item) => item.date_created ? new Date(item.date_created).toLocaleDateString() : '-'
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(item)}
            title="Edit Role"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusToggle(item)}
            title={item.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {item.status === 'active' ? (
              <XCircle className="w-4 h-4 text-yellow-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </Button>
          {item.role_name !== 'admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item)}
              title="Delete Role"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton variant="title" className="h-8 w-48" />
          <Skeleton variant="button" className="h-10 w-32" />
        </div>
        <SkeletonTable rows={5} columns={6} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Role Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage user roles and permissions in the system
          </p>
        </div>
        <Button onClick={() => {
          setEditingRole(null);
          setFormData({ role_name: '', description: '', status: 'active' });
          setErrors({});
          setIsModalOpen(true);
        }} variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{roles.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Roles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {roles.filter(r => r.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">System Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table
          data={roles}
          columns={columns}
          emptyState="No roles found. Click 'Add New Role' to create one."
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Default System Roles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-700 dark:text-red-300">Admin</p>
              <p className="text-blue-600 dark:text-blue-400">Full system access</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300">Registrar</p>
              <p className="text-blue-600 dark:text-blue-400">Manage requests & documents</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-300">User/Graduate</p>
              <p className="text-blue-600 dark:text-blue-400">Submit requests & view records</p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRole(null);
          setFormData({ role_name: '', description: '', status: 'active' });
          setErrors({});
        }}
        title={editingRole ? 'Edit Role' : 'Add New Role'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.role_name}
              onChange={(e) => setFormData({ ...formData, role_name: e.target.value.toLowerCase() })}
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                       focus:ring-indigo-500 transition-colors
                       ${errors.role_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="e.g., staff, alumni"
            />
            {errors.role_name && <p className="mt-1 text-sm text-red-600">{errors.role_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                       focus:ring-indigo-500 transition-colors
                       ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="Describe what this role can do..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none 
                       focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editingRole ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, role: null })}
        onConfirm={confirmDelete}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${confirmDialog.role?.role_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default RoleManagement;