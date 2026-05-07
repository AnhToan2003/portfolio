import axios from 'axios'

// Access token lives in module memory — never in localStorage
let accessToken = null
let isRefreshing = false
let refreshQueue = []

export const setAccessToken = (token) => { accessToken = token }
export const getAccessToken = () => accessToken

const BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  withCredentials: true, // send httpOnly refresh cookie on every request
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config

    // Don't intercept auth endpoints or already-retried requests
    if (
      err.response?.status !== 401 ||
      original._retry ||
      original.url?.includes('/api/auth/')
    ) {
      return Promise.reject(err)
    }

    original._retry = true

    // If refresh already in flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    isRefreshing = true
    try {
      const res = await axios.post(`${BASE}/api/auth/refresh`, {}, { withCredentials: true })
      const newToken = res.data.token
      setAccessToken(newToken)
      refreshQueue.forEach(({ resolve }) => resolve(newToken))
      refreshQueue = []
      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch (refreshErr) {
      refreshQueue.forEach(({ reject }) => reject(refreshErr))
      refreshQueue = []
      setAccessToken(null)
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      }
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
