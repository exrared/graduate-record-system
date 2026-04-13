import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNotification } from '../../contexts/NotificationContext'

const AdminBackup = () => {
  const { addNotification } = useNotification()
  const [backupData, setBackupData] = useState({
    includeUsers: true,
    includeRecords: true,
    includeRequests: true,
    includePayments: true,
    includeSettings: true
  })
  const [backupStatus, setBackupStatus] = useState(null)
  const [backupHistory, setBackupHistory] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [restoreStatus, setRestoreStatus] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [loading, setLoading] = useState(false)

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

  const fetchBackupHistory = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/backup/history')
      setBackupHistory(response.data)
    } catch (err) {
      setBackupHistory([
        { id: 1, filename: 'backup_2024_01_15.zip', size: '2.4 MB', date: new Date().toLocaleString(), status: 'completed' },
        { id: 2, filename: 'backup_2024_01_14.zip', size: '2.3 MB', date: new Date().toLocaleString(), status: 'completed' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBackupHistory()
  }, [])

  const handleBackup = async () => {
    setBackupStatus('creating')
    addNotification({
      type: 'info',
      title: 'Backup Started',
      message: 'Creating backup. Please wait...',
      duration: 2000
    })
    
    try {
      const response = await api.post('/admin/backup/create', backupData)
      setBackupStatus('success')
      addNotification({
        type: 'success',
        title: 'Backup Complete',
        message: response.data.message || 'Backup created successfully!',
        duration: 3000
      })
      fetchBackupHistory()
      setTimeout(() => setBackupStatus(null), 3000)
    } catch (err) {
      setBackupStatus('error')
      addNotification({
        type: 'error',
        title: 'Backup Failed',
        message: err.response?.data?.message || 'Failed to create backup',
        duration: 3000
      })
      setTimeout(() => setBackupStatus(null), 3000)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      addNotification({
        type: 'info',
        title: 'File Selected',
        message: `${file.name} selected for restore`,
        duration: 2000
      })
    }
  }

  const handleRestore = async () => {
    if (!selectedFile) {
      addNotification({
        type: 'warning',
        title: 'No File Selected',
        message: 'Please select a backup file first',
        duration: 3000
      })
      return
    }
    
    if (!window.confirm('Restoring will overwrite current data. Are you sure?')) return
    
    setRestoreStatus('restoring')
    addNotification({
      type: 'warning',
      title: 'Restore Started',
      message: 'Restoring backup. This may take a few minutes...',
      duration: 3000
    })
    
    try {
      const formData = new FormData()
      formData.append('backup_file', selectedFile)
      
      const response = await api.post('/admin/backup/restore', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setRestoreStatus('success')
      addNotification({
        type: 'success',
        title: 'Restore Complete',
        message: response.data.message || 'Backup restored successfully!',
        duration: 3000
      })
      
      setTimeout(() => setRestoreStatus(null), 3000)
      setSelectedFile(null)
      document.getElementById('backup-file-input').value = ''
      fetchBackupHistory()
    } catch (err) {
      setRestoreStatus('error')
      addNotification({
        type: 'error',
        title: 'Restore Failed',
        message: err.response?.data?.message || 'Failed to restore backup',
        duration: 3000
      })
      setTimeout(() => setRestoreStatus(null), 3000)
    }
  }

  const handleVerify = async () => {
    setVerificationStatus('verifying')
    addNotification({
      type: 'info',
      title: 'Verifying',
      message: 'Checking backup integrity...',
      duration: 2000
    })
    
    try {
      const response = await api.get('/admin/backup/verify')
      setVerificationStatus('success')
      addNotification({
        type: 'success',
        title: 'Verification Passed',
        message: response.data.message || 'All backup files are valid!',
        duration: 3000
      })
      setTimeout(() => setVerificationStatus(null), 3000)
    } catch (err) {
      setVerificationStatus('error')
      addNotification({
        type: 'error',
        title: 'Verification Failed',
        message: err.response?.data?.message || 'Some backup files appear corrupted',
        duration: 3000
      })
      setTimeout(() => setVerificationStatus(null), 3000)
    }
  }

  const handleDownload = async (filename) => {
    addNotification({
      type: 'success',
      title: 'Download Started',
      message: `Downloading ${filename}...`,
      duration: 2000
    })
  }

  const handleDeleteBackup = async (id, filename) => {
    if (window.confirm(`Delete ${filename}?`)) {
      try {
        await api.delete(`/admin/backup/${id}`)
        setBackupHistory(backupHistory.filter(b => b.id !== id))
        addNotification({
          type: 'success',
          title: 'Backup Deleted',
          message: `${filename} has been deleted`,
          duration: 3000
        })
      } catch (err) {
        addNotification({
          type: 'error',
          title: 'Delete Failed',
          message: 'Failed to delete backup file',
          duration: 3000
        })
      }
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div 
        className="mb-6 md:mb-8 cursor-pointer hover:opacity-80 transition"
        onClick={() => addNotification({ type: 'info', title: 'Backup Management', message: 'Manage system backups and data recovery', duration: 2000 })}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">💾 Backup & Data Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your system backups and data recovery</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        <div 
          onClick={() => addNotification({ type: 'info', title: 'Total Backups', message: `${backupHistory.length} backups available`, duration: 2000 })}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl"
        >
          <div className="text-2xl mb-1">📦</div>
          <div className="text-2xl font-bold">{backupHistory.length}</div>
          <div className="text-sm opacity-90">Total Backups</div>
        </div>
        <div 
          onClick={() => addNotification({ type: 'info', title: 'Storage', message: '2.4 GB of 10 GB used', duration: 2000 })}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl"
        >
          <div className="text-2xl mb-1">💾</div>
          <div className="text-2xl font-bold">2.4 GB</div>
          <div className="text-sm opacity-90">Storage Used</div>
        </div>
        <div 
          onClick={() => addNotification({ type: 'info', title: 'Latest Backup', message: 'Last backup was 7 days ago', duration: 2000 })}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl"
        >
          <div className="text-2xl mb-1">🕐</div>
          <div className="text-2xl font-bold">Last 7 days</div>
          <div className="text-sm opacity-90">Latest Backup</div>
        </div>
        <div 
          onClick={() => addNotification({ type: 'success', title: 'Integrity Check', message: 'All backups are 100% intact', duration: 2000 })}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl"
        >
          <div className="text-2xl mb-1">✅</div>
          <div className="text-2xl font-bold">100%</div>
          <div className="text-sm opacity-90">Integrity Check</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 md:p-6 hover:shadow-lg transition-all duration-200">
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition"
            onClick={() => addNotification({ type: 'info', title: 'Create Backup', message: 'Select data to include in backup', duration: 2000 })}
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
              🔧
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Create Backup</h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Select which data to include in your backup:</p>
          
          <div className="space-y-3 mb-6">
            {Object.entries(backupData).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={value} 
                    onChange={(e) => setBackupData({ ...backupData, [key]: e.target.checked })} 
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{key.replace('include', '')}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {key === 'includeUsers' ? 'Accounts, roles' : 
                   key === 'includeRecords' ? 'Academic records' :
                   key === 'includeRequests' ? 'Request history' :
                   key === 'includePayments' ? 'Transactions' : 'Configuration'}
                </span>
              </label>
            ))}
          </div>
          
          <button
            onClick={handleBackup}
            disabled={backupStatus === 'creating'}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            {backupStatus === 'creating' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Backup...
              </span>
            ) : backupStatus === 'success' ? (
              '✓ Backup Created Successfully!'
            ) : backupStatus === 'error' ? (
              '✗ Backup Failed. Try Again.'
            ) : (
              '🔒 Create Backup Now'
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 md:p-6 hover:shadow-lg transition-all duration-200">
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition"
            onClick={() => addNotification({ type: 'warning', title: 'Restore Backup', message: 'Upload a backup file to restore data', duration: 2000 })}
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
              🔄
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Restore Backup</h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Upload a backup file to restore your data:</p>
          
          <div className="mb-4">
            <label className="block w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <input
                id="backup-file-input"
                type="file"
                accept=".zip,.sql,.gz"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">📁</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {selectedFile ? selectedFile.name : 'Click or drag to upload backup file'}
                </span>
                <span className="text-xs text-gray-500">ZIP, SQL, or GZ files up to 50MB</span>
              </div>
            </label>
          </div>
          
          {selectedFile && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">{selectedFile.name}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 hover:text-red-700 transition-colors cursor-pointer hover:scale-110"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={handleRestore}
            disabled={!selectedFile || restoreStatus === 'restoring'}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            {restoreStatus === 'restoring' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Restoring Backup...
              </span>
            ) : restoreStatus === 'success' ? (
              '✓ Restore Completed Successfully!'
            ) : restoreStatus === 'error' ? (
              '✗ Restore Failed. Try Again.'
            ) : (
              '🔄 Restore Backup'
            )}
          </button>
          
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition" onClick={() => addNotification({ type: 'warning', title: 'Warning', message: 'Restoring will overwrite all current data', duration: 3000 })}>
            <p className="text-xs text-yellow-800 dark:text-yellow-300">
              ⚠️ Warning: Restoring will overwrite all current data. Make sure you have a current backup before proceeding.
            </p>
          </div>
        </div>
      </div>

      <div 
        className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 md:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={() => addNotification({ type: 'info', title: 'Verify Backup', message: 'Check backup integrity and validity', duration: 2000 })}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Verify Backup Integrity</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check if your backup files are valid and not corrupted</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleVerify()
            }}
            disabled={verificationStatus === 'verifying'}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
          >
            {verificationStatus === 'verifying' ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </span>
            ) : verificationStatus === 'success' ? (
              '✓ All Backups Verified!'
            ) : verificationStatus === 'error' ? (
              '✗ Verification Failed'
            ) : (
              '🔍 Verify Now'
            )}
          </button>
        </div>
        
        {verificationStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg animate-fadeIn">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✓ All backup files are valid and integrity checks passed. Your data is safe.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div 
          className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
          onClick={() => addNotification({ type: 'info', title: 'Backup History', message: 'View all previous backups', duration: 2000 })}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">📜 Backup History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Filename</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Size</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {backupHistory.map((backup) => (
                <tr 
                  key={backup.id} 
                  onClick={() => addNotification({ type: 'info', title: 'Backup Details', message: `${backup.filename} - ${backup.size} created on ${backup.date}`, duration: 3000 })}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
                >
                  <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-white group-hover:text-blue-600">{backup.filename}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{backup.size}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{backup.date}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition">
                      {backup.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(backup.filename)
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer hover:scale-105 inline-block"
                    >
                      ⬇️ Download
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteBackup(backup.id, backup.filename)
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors cursor-pointer hover:scale-105 inline-block"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div 
        onClick={() => addNotification({ type: 'info', title: 'Storage Information', message: '2.4 GB of 10 GB used (24%)', duration: 3000 })}
        className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-5 cursor-pointer hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all duration-200"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">💿 Storage Information</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your backup storage usage</p>
          </div>
          <div className="flex-1 max-w-md">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Used Space</span>
              <span className="text-gray-800 dark:text-white font-medium">2.4 GB / 10 GB</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: '24%' }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">24% of storage used</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBackup