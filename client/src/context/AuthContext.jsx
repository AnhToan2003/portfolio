import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import api, { setAccessToken, getAccessToken } from '../utils/api'

const AuthContext = createContext(null)

const IDLE_MS = 30 * 60 * 1000
const IDLE_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const idleTimer = useRef(null)

  const clearSession = useCallback(() => {
    setAccessToken(null)
    setUser(null)
    clearTimeout(idleTimer.current)
  }, [])

  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current)
    if (!getAccessToken()) return
    idleTimer.current = setTimeout(() => {
      clearSession()
      api.post('/api/auth/logout').catch(() => {})
      window.location.href = '/admin/login'
    }, IDLE_MS)
  }, [clearSession])

  // Restore session on mount via httpOnly refresh cookie
  useEffect(() => {
    api
      .post('/api/auth/refresh')
      .then((res) => {
        setAccessToken(res.data.token)
        return api.get('/api/auth/me')
      })
      .then((res) => {
        setUser(res.data.user)
        resetIdleTimer()
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Idle logout listeners
  useEffect(() => {
    IDLE_EVENTS.forEach((e) => window.addEventListener(e, resetIdleTimer, { passive: true }))
    return () => {
      IDLE_EVENTS.forEach((e) => window.removeEventListener(e, resetIdleTimer))
      clearTimeout(idleTimer.current)
    }
  }, [resetIdleTimer])

  async function login(email, password) {
    const res = await api.post('/api/auth/login', { email, password })
    const { token, user: u } = res.data
    setAccessToken(token)
    setUser(u)
    resetIdleTimer()
    return u
  }

  async function logout() {
    try { await api.post('/api/auth/logout') } catch {}
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
