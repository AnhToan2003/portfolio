import api from '../utils/api'

export const getExperience = () => api.get('/api/experience').then((r) => r.data.data)

export const createExperience = (data) =>
  api.post('/api/experience', data).then((r) => r.data.data)

export const updateExperience = (id, data) =>
  api.put(`/api/experience/${id}`, data).then((r) => r.data.data)

export const deleteExperience = (id) => api.delete(`/api/experience/${id}`)

export const createEducation = (data) =>
  api.post('/api/experience/education', data).then((r) => r.data.data)

export const updateEducation = (id, data) =>
  api.put(`/api/experience/education/${id}`, data).then((r) => r.data.data)

export const deleteEducation = (id) => api.delete(`/api/experience/education/${id}`)
