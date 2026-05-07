const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { sanitizeBody } = require('../middleware/validate')
const { getProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectsController')

router.get('/', getProjects)
router.get('/:id', getProjectById)
router.post('/', auth, sanitizeBody, createProject)
router.put('/:id', auth, sanitizeBody, updateProject)
router.delete('/:id', auth, deleteProject)

module.exports = router
