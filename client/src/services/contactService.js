import api from '../utils/api'

export const sendMessage = (data) => api.post('/api/contact', data).then((r) => r.data)

export const getMessages = () => api.get('/api/contact').then((r) => r.data)

export const markRead = (id) => api.patch(`/api/contact/${id}/read`)

export const deleteMessage = (id) => api.delete(`/api/contact/${id}`)
