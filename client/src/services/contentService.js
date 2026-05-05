import api from '../utils/api'

export const getContent = () => api.get('/api/content').then((r) => r.data.data)

export const updateContent = (data) => api.put('/api/content', data).then((r) => r.data.data)
