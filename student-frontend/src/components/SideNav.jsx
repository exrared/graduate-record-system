import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3,
  Users,
  Shield,
  Database,
  LogOut,
  X
} from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { useAuth } from '../contexts/AuthContext'

const SideNav = ({ isOpen, onClose, onNavigate }) => {
  const location = useLocation()
  const { settings } = useSettings()
  const { user } = useAuth()

  const getDashboardPath = () => {
    const userRole = user?.role
    if (userRole === 'admin') return '/admin-dashboard'
    if (userRole === 'registrar') return '/registrar-dashboard'
    return '/user-dashboard'
  }

  const dashboardPath = getDashboardPath()

  const handleNavigation = (path, section) => {
    if (onNavigate && section) {
      onNavigate(section)
    }
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  // Fixed: Use different paths for different sections to avoid duplicate keys
  const adminNavItems = [
    { path: dashboardPath, icon: LayoutDashboard, label: 'Dashboard Overview', section: 'overview', id: 'dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management', section: 'manageRegistrar', id: 'users' },
    { path: '/admin/security', icon: Shield, label: 'System Security', section: 'security', id: 'security' },
    { path: '/admin/backup', icon: Database, label: 'Backup & Data', section: 'backup', id: 'backup' },
    { path: '/settings', icon: Settings, label: 'Settings', section: null, id: 'settings' },
  ]

  const navItems = user?.role === 'admin' ? adminNavItems : [
    { path: dashboardPath, icon: LayoutDashboard, label: 'Dashboard', section: null, id: 'dashboard' },
    { path: '/settings', icon: Settings, label: 'Settings', section: null, id: 'settings' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('sanctum_token')
    window.location.href = '/login'
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  const sideNavBgColor = settings.darkMode ? '#0f172a' : '#1e1b4b'
  const defaultFontColor = settings.sideNavFontColor || '#e2e8f0'
  const hoverColor = settings.sideNavHoverColor || '#ffffff'
  const activeColor = settings.sideNavActiveColor || '#ffffff'

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 transition-all duration-300 transform flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: sideNavBgColor }}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white border-opacity-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📚</span>
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: defaultFontColor }}>GradTrack</h1>
                <p className="text-xs opacity-75" style={{ color: defaultFontColor }}>
                  {user?.role === 'admin' ? 'Administrator Panel' : user?.role === 'registrar' ? 'Registrar Panel' : 'Student Portal'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              style={{ color: defaultFontColor }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu - Flat structure */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            // Use different logic to determine active state
            const isActive = (() => {
              if (item.path === '/admin-dashboard') {
                return location.pathname === '/admin-dashboard'
              }
              if (item.path === '/admin/users') {
                return location.pathname === '/admin/users' || location.pathname === '/admin-dashboard'
              }
              if (item.path === '/admin/security') {
                return location.pathname === '/admin/security'
              }
              if (item.path === '/admin/backup') {
                return location.pathname === '/admin/backup'
              }
              return location.pathname === item.path
            })()
            
            return (
              <Link
                key={item.id}  // Use unique id instead of path
                to={item.path}
                onClick={() => handleNavigation(item.path, item.section)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
                style={{
                  color: isActive ? '#ffffff' : defaultFontColor,
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white border-opacity-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full hover:bg-red-500 hover:bg-opacity-20"
            style={{ color: '#f87171' }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default SideNav