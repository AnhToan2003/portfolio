const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { sanitizeBody } = require('../middleware/validate')
const {
  getExperience, createExperience, updateExperience, deleteExperience,
  createEducation, updateEducation, deleteEducation,
} = require('../controllers/experienceController')

router.get('/', getExperience)
router.post('/', auth, sanitizeBody, createExperience)
router.put('/:id', auth, sanitizeBody, updateExperience)
router.delete('/:id', auth, deleteExperience)

router.post('/education', auth, sanitizeBody, createEducation)
router.put('/education/:id', auth, sanitizeBody, updateEducation)
router.delete('/education/:id', auth, deleteEducation)

module.exports = router
