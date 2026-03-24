import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import axios from "axios"
import { API_URL } from '../api'

const Register = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // ✅ FIXED: Use API_URL instead of hardcoded URL with space
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role
      })

      alert("Registered Successfully!")

      localStorage.setItem('user', JSON.stringify(response.data.user))

      if(response.data.user.role === 'admin') navigate('/dashboard')
      else if(response.data.user.role === 'registrar') navigate('/dashboard')
      else navigate('/login')

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Full Name"
            className="w-full border px-4 py-3 rounded-lg"
            value={name} onChange={(e) => setName(e.target.value)} required
          />

          <input
            type="email" placeholder="Email"
            className="w-full border px-4 py-3 rounded-lg"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />

          <input
            type="password" placeholder="Password"
            className="w-full border px-4 py-3 rounded-lg"
            value={password} onChange={(e) => setPassword(e.target.value)} required
          />

          <select
            className="w-full border px-4 py-3 rounded-lg"
            value={role} onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="user">User (Graduates)</option>
            <option value="registrar">Registrar</option>
          </select>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account? 
          <span className="text-blue-600 cursor-pointer ml-1" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>

      </div>
    </div>
  )
}

export default Register