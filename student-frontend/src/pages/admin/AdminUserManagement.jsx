import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'

const AdminUserManagement = () => {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'registrar' })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json' },
  })

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sanctum_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
      addNotification({
        type: 'success',
        title: 'Users Loaded',
        message: `${response.data.length} users loaded from database`,
        duration: 2000
      })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load users',
        duration: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData) => {
    try {
      await api.post('/admin/users', userData)
      addNotification({
        type: 'success',
        title: 'User Created',
        message: `${userData.name} has been added successfully`,
        duration: 3000
      })
      fetchUsers()
      setShowCreateForm(false)
      setFormData({ name: '', email: '', password: '', role: 'registrar' })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.response?.data?.message || 'Failed to create user',
        duration: 3000
      })
    }
  }

  const updateUser = async (id, userData) => {
    try {
      await api.put(`/admin/users/${id}`, userData)
      addNotification({
        type: 'success',
        title: 'User Updated',
        message: 'User information updated successfully',
        duration: 3000
      })
      fetchUsers()
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', role: 'registrar' })
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update user',
        duration: 3000
      })
    }
  }

  const deactivateUser = async (id, name) => {
    if (!window.confirm(`Deactivate ${name}?`)) return
    try {
      await api.post(`/admin/users/${id}/deactivate`)
      addNotification({
        type: 'warning',
        title: 'User Deactivated',
        message: `${name}'s account has been deactivated`,
        duration: 3000
      })
      fetchUsers()
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to deactivate user',
        duration: 3000
      })
    }
  }

  const activateUser = async (id, name) => {
    try {
      await api.post(`/admin/users/${id}/activate`)
      addNotification({
        type: 'success',
        title: 'User Activated',
        message: `${name}'s account has been activated`,
        duration: 3000
      })
      fetchUsers()
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to activate user',
        duration: 3000
      })
    }
  }

  const updateRole = async (id, role, name) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role })
      addNotification({
        type: 'info',
        title: 'Role Updated',
        message: `${name}'s role changed to ${role}`,
        duration: 3000
      })
      fetchUsers()
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update role',
        duration: 3000
      })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingUser) {
      await updateUser(editingUser.id, { name: formData.name, email: formData.email, role: formData.role })
    } else {
      await createUser(formData)
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRowClick = (user) => {
    setSelectedUser(user)
    addNotification({
      type: 'info',
      title: 'User Selected',
      message: `Viewing details for ${user.name}`,
      duration: 2000
    })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="cursor-pointer hover:opacity-80 transition" onClick={() => addNotification({ type: 'info', title: 'User Management', message: 'Manage all user accounts here', duration: 2000 })}>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage registrar accounts and assign user roles</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm)
            setEditingUser(null)
            setFormData({ name: '', email: '', password: '', role: 'registrar' })
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
        >
          + Create Registrar Account
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          />
        </div>
      </div>

      {(showCreateForm || editingUser) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 mb-6 animate-slideDown">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 cursor-pointer hover:text-blue-600 transition" onClick={() => addNotification({ type: 'info', title: 'Form', message: editingUser ? 'Editing user information' : 'Creating new user', duration: 2000 })}>
            {editingUser ? '✏️ Update User Information' : '➕ Create Registrar Account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              {!editingUser && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              )}
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="registrar">Registrar</option>
                <option value="admin">Admin</option>
                <option value="user">Graduate</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all cursor-pointer hover:scale-105 active:scale-95">
                {editingUser ? 'Update User' : 'Create Registrar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingUser(null)
                  setFormData({ name: '', email: '', password: '', role: 'registrar' })
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4 text-sm text-gray-500 cursor-pointer hover:text-blue-600 transition" onClick={() => addNotification({ type: 'info', title: 'User Count', message: `Showing ${filteredUsers.length} of ${users.length} users`, duration: 2000 })}>
        📊 Showing {filteredUsers.length} of {users.length} users
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 animate-pulse">Loading users from database...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">ID</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Name</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell cursor-pointer hover:text-blue-600 transition">Email</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Role</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Status</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredUsers.map((u) => (
                  <tr 
                    key={u.id} 
                    onClick={() => handleRowClick(u)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
                  >
                    <td className="px-4 md:px-6 py-3 text-sm text-gray-500 group-hover:text-blue-600">{u.id}</td>
                    <td className="px-4 md:px-6 py-3 text-sm font-medium text-gray-800 dark:text-white group-hover:text-blue-600 transition">{u.name}</td>
                    <td className="px-4 md:px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 md:px-6 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value, u.name)}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs border rounded px-2 py-1 cursor-pointer transition ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200' :
                          u.role === 'registrar' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200' :
                          'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                        }`}
                      >
                        <option value="admin">Admin</option>
                        <option value="registrar">Registrar</option>
                        <option value="user">Graduate</option>
                      </select>
                    </td>
                    <td className="px-4 md:px-6 py-3">
                      <span 
                        onClick={(e) => e.stopPropagation()}
                        className={`px-2 py-1 text-xs rounded-full cursor-pointer transition ${
                          u.status ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {u.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sm space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingUser(u)
                          setFormData({ name: u.name, email: u.email, password: '', role: u.role })
                          setShowCreateForm(false)
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer hover:scale-105 inline-block"
                      >
                        ✏️ Edit
                      </button>
                      {u.status ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deactivateUser(u.id, u.name)
                          }}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors cursor-pointer hover:scale-105 inline-block"
                        >
                          🔒 Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            activateUser(u.id, u.name)
                          }}
                          className="text-green-600 hover:text-green-800 transition-colors cursor-pointer hover:scale-105 inline-block"
                        >
                          🔓 Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div 
        onClick={() => addNotification({ type: 'info', title: 'Assign Roles', message: 'Click on role dropdown to change user permissions', duration: 3000 })}
        className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-600 text-lg">ℹ️</span>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Assign User Roles:</strong> Click on the role dropdown in the table above to change user permissions.
            Only administrators can assign and modify user roles.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminUserManagement