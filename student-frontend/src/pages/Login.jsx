import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { LogIn } from 'lucide-react'
import { api } from '../api'

const Login = () => {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('') // Can be email OR username
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Determine if identifier is email or username
      const isEmail = identifier.includes('@') && identifier.includes('.')
      
      // Prepare login data
      const loginData = {
        email: isEmail ? identifier.trim() : '',
        username: !isEmail ? identifier.trim() : '',
        password: password
      }

      const res = await api.post('/login', loginData)

      const { user, token, token_type = 'Bearer' } = res.data

      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('token_type', token_type)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Set default authorization header for all future requests
      api.defaults.headers.common['Authorization'] = `${token_type} ${token}`

      // Store login timestamp
      localStorage.setItem('last_login', new Date().toISOString())

      // Redirect based on role (no complete-profile redirect)
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard', { replace: true })
          break
        case 'registrar':
          navigate('/registrar-dashboard', { replace: true })
          break
        case 'user':
        case 'graduate':
          // Direct to user dashboard - no profile completion check
          navigate('/user-dashboard', { replace: true })
          break
        default:
          setError('Unknown user role')
          // Clear stored data if role is invalid
          localStorage.removeItem('token')
          localStorage.removeItem('user')
      }

    } catch (err) {
      // Handle different error scenarios
      if (err.response) {
        const { status, data } = err.response
        
        switch (status) {
          case 401:
            setError(data.message || 'Invalid email/username or password')
            break
          case 403:
            setError(data.message || 'Account is deactivated. Please contact administrator.')
            break
          case 422:
            setError('Please enter valid email/username and password')
            break
          case 429:
            setError('Too many login attempts. Please try again later.')
            break
          default:
            setError(data.message || 'Login failed. Please try again.')
        }
      } else if (err.request) {
        setError('Unable to connect to server. Please check your internet connection.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      
      console.error('Login error:', err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md bg-white">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-full mb-4">
            <LogIn className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm md:text-base text-gray-600">Sign in with your email or username</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="email@example.com or username"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              required
              disabled={loading}
              autoComplete="username"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your email address or username
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Test Credentials</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-semibold">Admin</p>
              <p>Email: admin@example.com</p>
              <p>Username: admin</p>
              <p>Password: admin123</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-semibold">User</p>
              <p>Email: jvayunan@example.com</p>
              <p>Username: jvayunan</p>
              <p>Password: 1234567</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-center mt-6">
          Don't have an account?
          <span
            className="text-blue-600 cursor-pointer ml-1 hover:underline"
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login