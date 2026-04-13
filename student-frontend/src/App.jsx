import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminBackup from './pages/admin/AdminBackup';
import RoleManagement from './pages/admin/RoleManagement';

// Registrar Pages (MATCH YOUR EXACT FILE NAMES)
import RegistrarDashboard from './pages/registrar/RegistrarDashboard';
import RequestQueue from './pages/registrar/RequestQueue';
import ApproveRequests from './pages/registrar/ApproveRequests';
import ScheduleManager from './pages/registrar/ScheduleManager';
import UploadDocuments from './pages/registrar/UploadDocuments';
import VerifyPayments from './pages/registrar/VerifyPayments';
import GraduateList from './pages/registrar/GraduateList';
import Reports from './pages/registrar/Reports';
import RegistrarSettings from './pages/registrar/Settings';

// Graduate (User) Pages
import GraduateDashboard from './pages/graduate/GraduateDashboard';
import UserOverview from './pages/graduate/UserOverview';
import RequestDocuments from './pages/graduate/RequestDocuments';
import TrackRequests from './pages/graduate/TrackRequests';
import RequestHistory from './pages/graduate/RequestHistory';
import Billing from './pages/graduate/Billing';
import StudentRecords from './pages/graduate/StudentRecords';
import Profile from './pages/graduate/Profile';

// Shared Pages
import Tables from './pages/shared/Tables';
import Students from './pages/shared/Students';
import Images from './pages/shared/Images';
import Charts from './pages/shared/Charts';
import SharedSettings from './pages/shared/Settings';
import Notifications from './pages/shared/Notifications';

import TopNav from './components/TopNav';
import SideNav from './components/SideNav';
import Footer from './components/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminSection, setAdminSection] = useState('overview');

  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    if (newState) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  const handleSideNavNavigate = (section) => {
    if (section) {
      setAdminSection(section);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SideNav 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu}
        onNavigate={handleSideNavNavigate}
      />

      <div className="flex-1 flex flex-col w-full lg:ml-72 h-screen overflow-hidden relative">
        <div className="fixed top-0 right-0 left-0 lg:left-72 z-30">
          <TopNav onMenuClick={toggleMobileMenu} />
        </div>

        <main className="flex-1 overflow-y-auto pt-20 pb-8 px-4 md:px-6 lg:px-8">
          {React.cloneElement(children, { sidebarSection: adminSection })}
        </main>

        <div className="fixed bottom-0 right-0 left-0 lg:left-72 z-30">
          <Footer />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={<Navigate to="/admin-dashboard" replace />} />
                
                {/* Admin Dashboard Routes */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                          <AdminDashboard />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/overview"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                          <AdminOverview />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                          <AdminUserManagement />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/security"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                          <AdminSecurity />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/backup"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                          <AdminBackup />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/roles"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                          <RoleManagement />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />

                {/* Registrar Dashboard Routes */}
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
                <Route
                  path="/registrar/requests"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['registrar']}>
                        <Layout>
                          <RequestQueue />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/registrar/approve"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['registrar']}>
                        <Layout>
                          <ApproveRequests />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/registrar/schedules"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['registrar']}>
                        <Layout>
                          <ScheduleManager />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/registrar/upload"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['registrar']}>
                        <Layout>
                          <UploadDocuments />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/registrar/payments"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['registrar']}>
                        <Layout>
                          <VerifyPayments />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/registrar/graduates"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['registrar']}>
                        <Layout>
                          <GraduateList />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/registrar/reports"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['registrar']}>
                        <Layout>
                          <Reports />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/registrar/settings"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['registrar']}>
                        <Layout>
                          <RegistrarSettings />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />

                {/* Graduate (User) Routes */}
                <Route
                  path="/graduate-dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['user', 'graduate']}>
                        <Layout>
                          <GraduateDashboard />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                
                {/* Legacy route for user-dashboard */}
                <Route
                  path="/user-dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['user', 'graduate']}>
                        <Layout>
                          <GraduateDashboard />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user-overview"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['user', 'graduate']}>
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
                      <RoleRoute allowedRoles={['user', 'graduate']}>
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
                      <RoleRoute allowedRoles={['user', 'graduate']}>
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
                      <RoleRoute allowedRoles={['user', 'graduate']}>
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
                      <RoleRoute allowedRoles={['user', 'graduate']}>
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
                      <RoleRoute allowedRoles={['user', 'graduate']}>
                        <Layout>
                          <StudentRecords />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <RoleRoute allowedRoles={['user', 'graduate']}>
                        <Layout>
                          <Profile />
                        </Layout>
                      </RoleRoute>
                    </ProtectedRoute>
                  }
                />

                {/* ========== REDIRECTS FOR /graduate/* PATHS ========== */}
                <Route path="/graduate/request-documents" element={<Navigate to="/request-documents" replace />} />
                <Route path="/graduate/track-requests" element={<Navigate to="/track-requests" replace />} />
                <Route path="/graduate/request-history" element={<Navigate to="/request-history" replace />} />
                <Route path="/graduate/billing" element={<Navigate to="/billing" replace />} />
                <Route path="/graduate/student-records" element={<Navigate to="/student-records" replace />} />
                <Route path="/graduate/profile" element={<Navigate to="/profile" replace />} />

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
                        <SharedSettings />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Notifications />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Default */}
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;