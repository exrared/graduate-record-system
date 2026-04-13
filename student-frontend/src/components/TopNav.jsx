import { Bell, Search, User, LogOut, Menu, Settings, X, Check, AlertCircle, Info } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { useNotification } from '../contexts/NotificationContext'

const TopNav = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { settings } = useSettings()
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotification()
  const navigate = useNavigate()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isBellRinging, setIsBellRinging] = useState(false)
  const notificationRef = useRef(null)
  const userMenuRef = useRef(null)
  const searchRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsMobileSearchOpen(false)
      }
    }

    if (isNotificationOpen || isUserMenuOpen || isMobileSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationOpen, isUserMenuOpen, isMobileSearchOpen])

  // Bell ringing animation when new notification arrives
  useEffect(() => {
    if (unreadCount > 0) {
      setIsBellRinging(true)
      const timer = setTimeout(() => setIsBellRinging(false), 500)
      return () => clearTimeout(timer)
    }
  }, [unreadCount])

  const handleProfile = () => {
    navigate('/profile')
    setIsUserMenuOpen(false)
  }

  const handleSettings = () => {
    navigate('/settings')
    setIsUserMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/login', { replace: true })
  }

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    if (notification.link) {
      navigate(notification.link)
    }
    setIsNotificationOpen(false)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getNotificationBg = (type, isRead) => {
    if (isRead) return 'bg-gray-50 dark:bg-gray-800'
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20'
      default:
        return 'bg-blue-50 dark:bg-blue-900/20'
    }
  }

  const formatTime = (date) => {
    if (!date) return 'Just now'
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  // Add bell ringing animation to head
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes bellRing {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(15deg); }
        50% { transform: rotate(-15deg); }
        75% { transform: rotate(5deg); }
        100% { transform: rotate(0deg); }
      }
      .animate-bellRing {
        animation: bellRing 0.5s ease-in-out;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  // If dark mode is enabled, use dark colors for top nav
  const topNavBgColor = settings.darkMode ? '#1f2937' : settings.topNavColor
  
  const topNavFontColor = settings.darkMode 
    ? '#ffffff' 
    : (settings.topNavFontColor || (() => {
        const hex = settings.topNavColor?.replace('#', '') || 'ffffff'
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness > 128 ? '#1f2937' : '#ffffff'
      })())

  return (
    <>
      <nav 
        className="h-16 px-4 md:px-6 flex items-center justify-between shadow-md transition-colors duration-300 relative z-20"
        style={{ backgroundColor: topNavBgColor, color: topNavFontColor }}
      >
        <div className="flex items-center gap-3 md:gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-20"
            style={{ color: topNavFontColor }}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">📚</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block" style={{ color: topNavFontColor }}>
              GradTrack
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students, requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          {/* Search Icon for Mobile */}
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-20"
            style={{ color: topNavFontColor }}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={`relative p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-20 ${
                isNotificationOpen ? 'bg-white bg-opacity-20' : ''
              }`}
              style={{ color: topNavFontColor }}
              aria-label="Notifications"
            >
              <Bell className={`w-5 h-5 ${isBellRinging ? 'animate-bellRing' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        When you receive notifications, they'll appear here
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${getNotificationBg(notification.type, notification.isRead)}`}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'font-semibold text-gray-900 dark:text-white'}`}>
                                  {notification.title}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeNotification(notification.id)
                                  }}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                          {!notification.isRead && (
                            <div className="mt-2">
                              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button 
                      onClick={() => {
                        setIsNotificationOpen(false)
                        navigate('/notifications')
                      }}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium py-1.5"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors hover:bg-white hover:bg-opacity-20 ${
                isUserMenuOpen ? 'bg-white bg-opacity-20' : ''
              }`}
              style={{ color: topNavFontColor }}
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
            </button>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        {user?.role === 'admin' ? 'Administrator' : user?.role === 'registrar' ? 'Registrar' : 'Student'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                  
                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Modal */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={() => setIsMobileSearchOpen(false)}>
          <div 
            ref={searchRef}
            className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students, requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-2 bg-transparent text-gray-900 dark:text-white focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TopNav