import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import axios from 'axios'

const AdminSecurity = () => {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [alerts, setAlerts] = useState([])
  const [activity, setActivity] = useState([])
  const [unauthorizedAttempts, setUnauthorizedAttempts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState(null)

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

  const fetchSecurityData = async () => {
    setLoading(true)
    try {
      const alertsRes = await api.get('/admin/security/alerts').catch(() => ({ data: [] }))
      const activityRes = await api.get('/admin/activity/logs').catch(() => ({ data: [] }))
      const unauthorizedRes = await api.get('/admin/security/unauthorized').catch(() => ({ data: [] }))
      
      if (alertsRes.data.length > 0) {
        setAlerts(alertsRes.data)
      } else {
        setAlerts([
          { id: 1, severity: 'high', message: 'Multiple failed login attempts detected', time: new Date().toLocaleString(), source: '192.168.1.100', status: 'active' },
          { id: 2, severity: 'medium', message: 'Suspicious activity from new device', time: new Date().toLocaleString(), source: '10.0.0.5', status: 'active' },
        ])
      }
      
      if (activityRes.data.length > 0) {
        setActivity(activityRes.data)
      } else {
        setActivity([
          { id: 1, user: 'Admin User', action: 'Logged in', time: new Date().toLocaleString(), ip: '192.168.1.1' },
          { id: 2, user: 'Registrar', action: 'Updated student record', time: new Date().toLocaleString(), ip: '192.168.1.2' },
        ])
      }
      
      if (unauthorizedRes.data.length > 0) {
        setUnauthorizedAttempts(unauthorizedRes.data)
      } else {
        setUnauthorizedAttempts([
          { id: 1, ip: '45.33.22.11', attempt_time: new Date().toLocaleString(), status: 'blocked' },
        ])
      }
      
      if (alertsRes.data.length > 0) {
        addNotification({
          type: 'warning',
          title: 'Security Alert',
          message: `${alertsRes.data.length} new security alert(s) detected!`,
          duration: 5000
        })
      }
    } catch (err) {
      console.error('Error fetching security data:', err)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load security data',
        duration: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSecurityData()
    const interval = setInterval(fetchSecurityData, 30000)
    return () => clearInterval(interval)
  }, [])

  const resolveAlert = (id, message) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'resolved' } : alert
    ))
    addNotification({
      type: 'success',
      title: 'Alert Resolved',
      message: `Security alert "${message}" has been marked as resolved`,
      duration: 3000
    })
  }

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert)
    addNotification({
      type: 'warning',
      title: 'Alert Details',
      message: `${alert.message} - Source: ${alert.source}`,
      duration: 4000
    })
  }

  const StatusBadge = ({ severity }) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800'
    }
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[severity] || styles.low}`}>
        {severity?.toUpperCase() || 'INFO'}
      </span>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div 
        className="mb-6 md:mb-8 cursor-pointer hover:opacity-80 transition"
        onClick={() => addNotification({ type: 'info', title: 'System Security', message: 'Monitoring security alerts and system activity', duration: 2000 })}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">🔒 System Security</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor security alerts, unauthorized access, and system activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        <div 
          onClick={() => addNotification({ type: 'warning', title: 'High Severity', message: `${alerts.filter(a => a.severity === 'high').length} high severity alerts`, duration: 3000 })}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl"
        >
          <div className="text-2xl mb-1">⚠️</div>
          <div className="text-2xl font-bold">{alerts.filter(a => a.severity === 'high').length}</div>
          <div className="text-sm opacity-90">High Severity Alerts</div>
        </div>
        <div 
          onClick={() => addNotification({ type: 'warning', title: 'Active Alerts', message: `${alerts.filter(a => a.status === 'active').length} active alerts need attention`, duration: 3000 })}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl"
        >
          <div className="text-2xl mb-1">🔔</div>
          <div className="text-2xl font-bold">{alerts.filter(a => a.status === 'active').length}</div>
          <div className="text-sm opacity-90">Active Alerts</div>
        </div>
        <div 
          onClick={() => addNotification({ type: 'error', title: 'Blocked Attempts', message: `${unauthorizedAttempts.length} unauthorized access attempts blocked`, duration: 3000 })}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl"
        >
          <div className="text-2xl mb-1">🚫</div>
          <div className="text-2xl font-bold">{unauthorizedAttempts.length}</div>
          <div className="text-sm opacity-90">Blocked Attempts</div>
        </div>
        <div 
          onClick={() => addNotification({ type: 'success', title: 'Total Activities', message: `${activity.length} system activities recorded`, duration: 3000 })}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl"
        >
          <div className="text-2xl mb-1">✅</div>
          <div className="text-2xl font-bold">{activity.length}</div>
          <div className="text-sm opacity-90">Total Activities</div>
        </div>
      </div>

      <div className="mb-8">
        <div 
          className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition"
          onClick={() => addNotification({ type: 'info', title: 'Security Alerts', message: 'Monitor and resolve security alerts', duration: 2000 })}
        >
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">🔔</div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Monitor Security Alerts</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500 animate-pulse">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center cursor-pointer hover:bg-green-100 transition" onClick={() => addNotification({ type: 'success', title: 'System Secure', message: 'No security threats detected', duration: 2000 })}>
            <p className="text-green-700">✓ No security alerts at this time. Your system is secure.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                onClick={() => handleAlertClick(alert)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-200 hover:bg-red-100' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' :
                  'bg-blue-50 border-blue-200 hover:bg-blue-100'
                } ${alert.status === 'resolved' ? 'opacity-75' : ''}`}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge severity={alert.severity} />
                      <span className="font-medium text-gray-800">{alert.message}</span>
                      {alert.status === 'resolved' && (
                        <span className="text-xs text-green-600">✓ Resolved</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Source IP: {alert.source}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{alert.time}</p>
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          resolveAlert(alert.id, alert.message)
                        }}
                        className="mt-1 text-xs text-green-600 hover:text-green-800 transition-colors cursor-pointer hover:scale-105"
                      >
                        ✓ Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div 
          className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition"
          onClick={() => addNotification({ type: 'warning', title: 'Unauthorized Access', message: 'View blocked access attempts', duration: 2000 })}
        >
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">🚫</div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">View Unauthorized Access Attempts</h2>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">IP Address</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Attempt Time</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {unauthorizedAttempts.map((attempt) => (
                  <tr 
                    key={attempt.id} 
                    onClick={() => addNotification({ type: 'error', title: 'Blocked IP', message: `Blocked access from ${attempt.ip} at ${attempt.attempt_time}`, duration: 3000 })}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <td className="px-5 py-3 text-sm font-mono group-hover:text-blue-600">{attempt.ip}</td>
                    <td className="px-5 py-3 text-sm">{attempt.attempt_time}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 transition">
                        {attempt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div 
          className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition"
          onClick={() => addNotification({ type: 'info', title: 'System Activity', message: 'View all system activity logs', duration: 2000 })}
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">📋</div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">View System Activity</h2>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">User</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Action</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Time</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activity.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => addNotification({ type: 'info', title: 'Activity Detail', message: `${log.user} performed: ${log.action}`, duration: 3000 })}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <td className="px-5 py-3 text-sm font-medium text-gray-800 group-hover:text-blue-600">{log.user}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{log.action}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{log.time}</td>
                    <td className="px-5 py-3 text-sm font-mono text-gray-500">{log.ip || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSecurity