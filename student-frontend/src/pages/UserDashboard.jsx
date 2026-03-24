import { useNavigate } from 'react-router-dom'
import { FilePlus, Clock, History, User, FileText, CreditCard, LayoutDashboard } from "lucide-react"

const UserDashboard = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const cards = [
    {
      icon: LayoutDashboard,
      title: 'Dashboard',
      description: 'Overview of your account',
      color: 'text-indigo-500',
      path: '/user-overview'
    },
    {
      icon: User,
      title: 'My Profile',
      description: 'View and update your information',
      color: 'text-purple-500',
      path: '/profile'
    },
    {
      icon: FileText,
      title: 'Student Records',
      description: 'View your academic records',
      color: 'text-blue-500',
      path: '/student-records'
    },
    {
      icon: FilePlus,
      title: 'Request Documents',
      description: 'Request transcript or certificates',
      color: 'text-green-500',
      path: '/request-documents'
    },
    {
      icon: Clock,
      title: 'Track Request',
      description: 'Monitor request status',
      color: 'text-yellow-500',
      path: '/track-requests'
    },
    {
      icon: History,
      title: 'Request History',
      description: 'View your previous requests',
      color: 'text-teal-500',
      path: '/request-history'
    },
    {
      icon: CreditCard,
      title: 'Billing & Payment',
      description: 'Manage payments for requests',
      color: 'text-red-500',
      path: '/billing'
    }
  ]

  const handleCardClick = (path) => {
    navigate(path)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Graduate Dashboard</h1>

      <p className="mb-6 text-gray-600">
        Welcome, {user?.name}. Manage your student records and document requests.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:ring-4 hover:ring-indigo-100 dark:hover:ring-indigo-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handleCardClick(card.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCardClick(card.path)
                }
              }}
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 from-indigo-500 to-purple-600 transition-opacity duration-300"></div>
              
              {/* Icon */}
              <div className="relative z-10 mb-4">
                <Icon className={`w-12 h-12 ${card.color} drop-shadow-lg group-hover:scale-110 transition-transform duration-300`} />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
              
              {/* Arrow indicator */}
              <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <svg className="w-5 h-5 text-indigo-500 rotate-[-45deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserDashboard
