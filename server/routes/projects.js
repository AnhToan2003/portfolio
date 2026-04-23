const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const auth = require('../middleware/auth')

// GET /api/projects — public
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query
    const filter = featured ? { featured: true } : {}
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: projects })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/projects/:id — public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' })
    res.json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/projects — protected
router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json({ success: true, data: project })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PUT /api/projects/:id — protected
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' })
    res.json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/projects/:id — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' })
    res.json({ success: true, message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
