import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RegistrarDashboard from './pages/RegistrarDashboard'
import UserDashboard from './pages/UserDashboard'

import Tables from './pages/Tables'
import Students from './pages/Students'
import Images from './pages/Images'
import Charts from './pages/Charts'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import UserOverview from './pages/UserOverview'
import RequestDocuments from './pages/RequestDocuments'
import TrackRequests from './pages/TrackRequests'
import RequestHistory from './pages/RequestHistory'
import Billing from './pages/Billing'
import StudentRecords from './pages/StudentRecords'

import TopNav from './components/TopNav'
import SideNav from './components/SideNav'
import Footer from './components/Footer'

/* ---------- AUTH PROTECTION ---------- */

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

/* ---------- ROLE PROTECTION ---------- */

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth()

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

/* ---------- LAYOUT ---------- */

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [])

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen
    setIsMobileMenuOpen(newState)

    if (newState) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.classList.remove('menu-open')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SideNav isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      <div className="flex-1 flex flex-col w-full lg:ml-64 h-screen overflow-hidden relative">

        {/* Top Navigation */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-30">
          <TopNav onMenuClick={toggleMobileMenu} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-16 pb-20">
          {children}
        </main>

        {/* Footer */}
        <div className="fixed bottom-0 right-0 left-0 lg:left-64 z-30">
          <Footer />
        </div>

      </div>
    </div>
  )
}

/* ---------- APP ---------- */

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Router>

          <Routes>

            {/* Public Routes */}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<Navigate to="/admin-dashboard" replace />} />
            
            {/* Admin Dashboard */}

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
~
            {/* Registrar Dashboard */}

            <Route
              path="/registrar-dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['registrar']}>
                    <Layout>
                      <RegistrarDashboard />
                    </Layout>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* User Dashboard */}

            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['user']}>
                    <Layout>
                      <UserDashboard />
                    </Layout>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* User Specific Pages */}
            <Route
              path="/user-overview"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['user']}>
                    <Layout>
                      <UserOverview />
                    </Layout>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/request-documents"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['user']}>
                    <Layout>
                      <RequestDocuments />
                    </Layout>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/track-requests"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['user']}>
                    <Layout>
                      <TrackRequests />
                    </Layout>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/request-history"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['user']}>
                    <Layout>
                      <RequestHistory />
                    </Layout>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['user']}>
                    <Layout>
                      <Billing />
                    </Layout>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-records"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['user']}>
                    <Layout>
                      <StudentRecords />
                    </Layout>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Shared Pages */}

            <Route
              path="/tables"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Tables />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Students />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/images"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Images />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/charts"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Charts />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default */}

            <Route path="/" element={<Navigate to="/login" replace />} />

          </Routes>

        </Router>
      </AuthProvider>
    </SettingsProvider>
  )
}

export default App