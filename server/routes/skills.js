const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { sanitizeBody } = require('../middleware/validate')
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillsController')

router.get('/', getSkills)
router.post('/', auth, sanitizeBody, createSkill)
router.put('/:id', auth, sanitizeBody, updateSkill)
router.delete('/:id', auth, deleteSkill)

module.exports = router
