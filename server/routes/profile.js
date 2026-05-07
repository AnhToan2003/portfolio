const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { sanitizeBody } = require('../middleware/validate')
const { getProfile, updateProfile } = require('../controllers/profileController')

router.get('/', getProfile)
router.put('/', auth, sanitizeBody, updateProfile)

module.exports = router
