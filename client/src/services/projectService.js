import api from '../utils/api'

export const getProjects = () => api.get('/api/projects').then((r) => r.data.data)

export const createProject = (data) => api.post('/api/projects', data).then((r) => r.data.data)

export const updateProject = (id, data) =>
  api.put(`/api/projects/${id}`, data).then((r) => r.data.data)

export const deleteProject = (id) => api.delete(`/api/projects/${id}`)

export const uploadProjectImage = (file) => {
  const form = new FormData()
  form.append('image', file)
  return api.post('/api/upload', form).then((r) => r.data.url)
}
