import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem('user'))
  
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return children ? children : <Outlet />
}

export default ProtectedRoute