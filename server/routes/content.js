const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { sanitizeBody } = require('../middleware/validate')
const { getContent, updateContent, getSection, updateSection } = require('../controllers/contentController')

// Full content doc — used by frontend ContentContext
router.get('/', getContent)
router.put('/', auth, sanitizeBody, updateContent)

// Section-specific routes — GET public, PUT admin-only
// e.g. GET /api/content/about, PUT /api/content/contact
router.get('/:section', getSection)
router.put('/:section', auth, sanitizeBody, updateSection)

module.exports = router
