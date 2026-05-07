const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const rateLimiter = require('../middleware/rateLimiter')
const { sanitizeBody } = require('../middleware/validate')
const { createMessage, getMessages, markRead, deleteMessage } = require('../controllers/contactController')

router.post('/', rateLimiter({ windowMs: 60_000, max: 5 }), sanitizeBody, createMessage)
router.get('/', auth, getMessages)
router.patch('/:id/read', auth, markRead)
router.delete('/:id', auth, deleteMessage)

module.exports = router
