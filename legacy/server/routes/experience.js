const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getExperience, createExperience, updateExperience, deleteExperience,
  createEducation, updateEducation, deleteEducation,
} = require('../controllers/experienceController')

router.get('/', getExperience)
router.post('/', auth, createExperience)
router.put('/:id', auth, updateExperience)
router.delete('/:id', auth, deleteExperience)

router.post('/education', auth, createEducation)
router.put('/education/:id', auth, updateEducation)
router.delete('/education/:id', auth, deleteEducation)

module.exports = router
