import api from '../utils/api'

export const getSkills = () => api.get('/api/skills').then((r) => r.data.data)

export const createSkill = (data) => api.post('/api/skills', data).then((r) => r.data.data)

export const updateSkill = (id, data) =>
  api.put(`/api/skills/${id}`, data).then((r) => r.data.data)

export const deleteSkill = (id) => api.delete(`/api/skills/${id}`)
