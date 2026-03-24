import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Table, 
  Settings, 
  Image as ImageIcon,
  BarChart3,
  GraduationCap,
  X
} from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { useAuth } from '../contexts/AuthContext'

const SideNav = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { settings } = useSettings()
  const { user } = useAuth()

  const getDashboardPath = () => {
    const userRole = user?.role
    if (userRole === 'admin') return '/admin-dashboard'
    if (userRole === 'registrar') return '/registrar-dashboard'
    return '/user-dashboard' // default for user or unknown
  }

  const dashboardPath = getDashboardPath()

  const navItems = [
    { path: dashboardPath, icon: LayoutDashboard, label: 'Dashboard' },
    //{ path: '/tables', icon: Table, label: 'Tables' },
    //{ path: '/students', icon: GraduationCap, label: 'Students' },
    //{ path: '/images', icon: ImageIcon, label: 'Images' },
    //{ path: '/charts', icon: BarChart3, label: 'Charts' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  // If dark mode is enabled, use dark color for side nav
  const sideNavBgColor = settings.darkMode ? '#1e293b' : settings.sideNavColor
  
  // Font colors - use defaults if not set
  const defaultFontColor = settings.sideNavFontColor || '#e2e8f0'
  const hoverColor = settings.sideNavHoverColor || '#ffffff'
  const activeColor = settings.sideNavActiveColor || '#ffffff'

  const handleLinkClick = () => {
    // Close mobile menu when link is clicked
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

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
        className={`fixed inset-y-0 left-0 z-40 w-64 p-4 transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: sideNavBgColor }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: defaultFontColor }}>Dashboard</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            style={{ color: defaultFontColor }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white bg-opacity-20 font-semibold'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
                style={{
                  color: isActive ? activeColor : defaultFontColor,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = hoverColor
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = defaultFontColor
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default SideNav
