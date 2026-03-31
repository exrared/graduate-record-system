import { createContext, useContext, useState, useEffect } from 'react'
import { api, API_URL } from '../api'  // Import both api and API_URL

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Set auth header helper
  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    const savedTokenType = localStorage.getItem('token_type') || 'Bearer'

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setToken(savedToken)
      setAuthHeader(savedToken)
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true)
      
      const response = await api.post('/login', { 
        email: email.trim(), 
        password 
      })

      const userData = response.data.user
      const authToken = response.data.token
      const tokenType = response.data.token_type || 'Bearer'

      if (!authToken) {
        throw new Error('No token received from server')
      }

      // Save user & token
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', authToken)
      localStorage.setItem('token_type', tokenType)
      
      // Set authorization header
      setAuthHeader(authToken)
      
      setUser(userData)
      setToken(authToken)

      return { 
        success: true, 
        user: userData,
        token: authToken
      }

    } catch (err) {
      console.error('Login error:', err.response?.data || err.message)
      
      let errorMessage = 'Login failed. Please try again.'
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Invalid email or password'
            break
          case 403:
            errorMessage = err.response.data?.message || 'Account is deactivated'
            break
          case 422:
            errorMessage = 'Please enter valid email and password'
            break
          default:
            errorMessage = err.response.data?.message || errorMessage
        }
      } else if (err.request) {
        errorMessage = 'Unable to connect to server. Please check your connection.'
      }
      
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await api.post('/logout')
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('token_type')
      setAuthHeader(null)
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role
  }

  // Check if user has any of the given roles
  const hasAnyRole = (roles) => {
    if (!user) return false
    return roles.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login, 
      logout, 
      loading,
      hasRole,
      hasAnyRole,
      isAuthenticated: !!user && !!token
    }}>
      {children}
    </AuthContext.Provider>
  )
}