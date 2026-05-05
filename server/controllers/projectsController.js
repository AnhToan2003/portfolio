const projectService = require('../services/projectService')

exports.getProjects = async (req, res) => {
  try {
    const filter = req.query.featured ? { featured: true } : {}
    const projects = await projectService.getProjects(filter)
    res.json({ success: true, data: projects })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id)
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' })
    res.json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body)
    res.status(201).json({ success: true, data: project })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
}

exports.updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body)
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' })
    res.json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.deleteProject = async (req, res) => {
  try {
    const project = await projectService.deleteProject(req.params.id)
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' })
    res.json({ success: true, message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
