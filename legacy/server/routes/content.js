const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { getContent, updateContent } = require('../controllers/contentController')

// GET /api/content — public (used by frontend to load all site text)
router.get('/', getContent)

// PUT /api/content — protected (admin only)
router.put('/', auth, updateContent)

module.exports = router
