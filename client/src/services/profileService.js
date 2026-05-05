import api from '../utils/api'

export const getProfile = () => api.get('/api/profile').then((r) => r.data.data)

export const updateProfile = (data) => api.put('/api/profile', data).then((r) => r.data.data)

export const uploadAvatar = (file) => {
  const form = new FormData()
  form.append('image', file)
  return api.post('/api/upload', form).then((r) => r.data.url)
}
