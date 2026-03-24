import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../api'  // your Laravel API base URL

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
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post(`${API_URL}/login`, { email, password })

      const userData = response.data.user
      const token = response.data.token || null

      // Save user & token
      localStorage.setItem('user', JSON.stringify(userData))
      if (token) localStorage.setItem('token', token)

      setUser(userData)
      setLoading(false)

      return { success: true, user: userData }

    } catch (err) {
      setLoading(false)
      return { success: false, error: err.response?.data?.message || 'Login failed' }
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}