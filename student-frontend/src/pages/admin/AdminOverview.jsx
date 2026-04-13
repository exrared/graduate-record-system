import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'

const AdminOverview = ({ onNavigate }) => {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGraduates: 0,
    totalRegistrars: 0,
    totalDocuments: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    revenue: 0,
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [recentUsers, setRecentUsers] = useState([])

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

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const usersRes = await api.get('/admin/users')
      const users = usersRes.data
      const students = users.filter(u => u.role === 'user')
      const registrars = users.filter(u => u.role === 'registrar')
      
      const statsRes = await api.get('/admin/stats')
      const systemStats = statsRes.data
      
      setStats({
        totalStudents: students.length,
        totalGraduates: students.filter(u => u.status === 1).length,
        totalRegistrars: registrars.length,
        totalDocuments: systemStats.total_records || 0,
        totalRequests: systemStats.total_requests || 0,
        pendingRequests: systemStats.pending_requests || 0,
        completedRequests: systemStats.completed_requests || 0,
        revenue: (systemStats.completed_requests || 0) * 150,
      })
      
      setRecentRequests([
        { id: 'REQ-001', student: 'Juan Dela Cruz', document: 'Transcript of Records', status: 'pending', date: '2024-01-15' },
        { id: 'REQ-002', student: 'Maria Santos', document: 'Diploma', status: 'completed', date: '2024-01-14' },
        { id: 'REQ-003', student: 'John Smith', document: 'Certificate', status: 'processing', date: '2024-01-13' },
      ])
      
      setRecentUsers(users.slice(0, 5))
      
    } catch (err) {
      console.error('Error:', err)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard data',
        duration: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleCardClick = (cardType) => {
    switch(cardType) {
      case 'students':
        addNotification({
          type: 'info',
          title: 'Navigation',
          message: 'Viewing all students list',
          duration: 2000
        })
        if (onNavigate) onNavigate('students')
        break
      case 'graduates':
        addNotification({
          type: 'info',
          title: 'Navigation',
          message: 'Viewing graduates list',
          duration: 2000
        })
        if (onNavigate) onNavigate('graduates')
        break
      case 'requests':
        addNotification({
          type: 'info',
          title: 'Navigation',
          message: 'Viewing all document requests',
          duration: 2000
        })
        if (onNavigate) onNavigate('manageRegistrar')
        break
      case 'pending':
        addNotification({
          type: 'warning',
          title: 'Pending Requests',
          message: `${stats.pendingRequests} pending requests need attention`,
          duration: 3000
        })
        if (onNavigate) onNavigate('manageRegistrar')
        break
      case 'completed':
        addNotification({
          type: 'success',
          title: 'Completed Requests',
          message: `${stats.completedRequests} requests have been completed`,
          duration: 3000
        })
        if (onNavigate) onNavigate('manageRegistrar')
        break
      case 'revenue':
        addNotification({
          type: 'success',
          title: 'Revenue Report',
          message: `Total revenue: ${formatCurrency(stats.revenue)}`,
          duration: 3000
        })
        break
      case 'documents':
        addNotification({
          type: 'info',
          title: 'Documents',
          message: `${stats.totalDocuments} documents in the system`,
          duration: 2000
        })
        break
      case 'registrars':
        addNotification({
          type: 'info',
          title: 'Registrars',
          message: `Managing ${stats.totalRegistrars} registrar accounts`,
          duration: 2000
        })
        if (onNavigate) onNavigate('manageRegistrar')
        break
      default:
        break
    }
  }

  const metricCards = [
    { 
      title: 'Total Students', 
      value: stats.totalStudents, 
      icon: '👨‍🎓', 
      color: 'from-blue-500 to-blue-600',
      clickKey: 'students',
      description: 'Click to view all students'
    },
    { 
      title: 'Graduates', 
      value: stats.totalGraduates, 
      icon: '🎓', 
      color: 'from-purple-500 to-purple-600',
      clickKey: 'graduates',
      description: 'Click to view graduates'
    },
    { 
      title: 'Total Requests', 
      value: stats.totalRequests, 
      icon: '📋', 
      color: 'from-orange-500 to-orange-600',
      clickKey: 'requests',
      description: 'Click to manage requests'
    },
    { 
      title: 'Pending', 
      value: stats.pendingRequests, 
      icon: '⏳', 
      color: 'from-yellow-500 to-yellow-600',
      clickKey: 'pending',
      description: 'Click to view pending requests'
    },
    { 
      title: 'Completed', 
      value: stats.completedRequests, 
      icon: '✅', 
      color: 'from-green-500 to-green-600',
      clickKey: 'completed',
      description: 'Click to view completed'
    },
    { 
      title: 'Revenue', 
      value: formatCurrency(stats.revenue), 
      icon: '💰', 
      color: 'from-emerald-500 to-emerald-600',
      clickKey: 'revenue',
      description: 'Click to view revenue'
    },
    { 
      title: 'Documents', 
      value: stats.totalDocuments, 
      icon: '📄', 
      color: 'from-cyan-500 to-cyan-600',
      clickKey: 'documents',
      description: 'Click to view documents'
    },
    { 
      title: 'Registrars', 
      value: stats.totalRegistrars, 
      icon: '👔', 
      color: 'from-gray-500 to-gray-600',
      clickKey: 'registrars',
      description: 'Click to manage registrars'
    },
  ]

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    }
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || styles.pending}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {metricCards.map((card, index) => (
          <div 
            key={index} 
            onClick={() => handleCardClick(card.clickKey)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 md:p-5 border border-gray-100 dark:border-gray-700 cursor-pointer group transform hover:-translate-y-1 active:scale-95"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium group-hover:text-blue-600 transition-colors">
                  {card.title}
                </p>
                <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {card.value}
                </p>
                <p className="text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {card.description}
                </p>
              </div>
              <div className={`bg-gradient-to-br ${card.color} w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white text-lg md:text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-5">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-4">Request Overview</h2>
          <div className="space-y-4">
            <div 
              onClick={() => handleCardClick('pending')}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-all duration-200"
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Pending Requests</span>
                <span className="text-gray-800 dark:text-white font-medium">{stats.pendingRequests}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.totalRequests ? (stats.pendingRequests / stats.totalRequests) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div 
              onClick={() => handleCardClick('completed')}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-all duration-200"
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Completed Requests</span>
                <span className="text-gray-800 dark:text-white font-medium">{stats.completedRequests}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.totalRequests ? (stats.completedRequests / stats.totalRequests) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div 
              onClick={() => handleCardClick('documents')}
              className="text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 p-3 rounded-lg transition-all duration-200"
            >
              <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalDocuments}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Documents</p>
            </div>
            <div 
              onClick={() => handleCardClick('revenue')}
              className="text-center cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 p-3 rounded-lg transition-all duration-200"
            >
              <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(stats.revenue)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-5">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentRequests.slice(0, 4).map((req, i) => (
              <div 
                key={i} 
                onClick={() => handleCardClick('requests')}
                className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-200"
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm">
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{req.student}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{req.document}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 md:px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">Recently Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 md:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 md:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 md:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Email</th>
                <th className="px-4 md:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 md:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentUsers.map((u, i) => (
                <tr 
                  key={i} 
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      title: 'User Selected',
                      message: `Viewing details for ${u.name}`,
                      duration: 2000
                    })
                  }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 md:px-5 py-3 text-sm text-gray-500">{u.id}</td>
                  <td className="px-4 md:px-5 py-3 text-sm font-medium text-gray-800 dark:text-white">{u.name}</td>
                  <td className="px-4 md:px-5 py-3 text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 md:px-5 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'registrar' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-4 md:px-5 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${u.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {u.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview