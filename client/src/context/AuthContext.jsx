import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user')) || null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(username, password) {
    const res = await api.post('/api/auth/login', { username, password })
    const { token, user: u } = res.data
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_user', JSON.stringify(u))
    setUser(u)
    return u
  }

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
