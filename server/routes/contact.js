const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { createMessage, getMessages, markRead, deleteMessage } = require('../controllers/contactController')

router.post('/', createMessage)
router.get('/', auth, getMessages)
router.patch('/:id/read', auth, markRead)
router.delete('/:id', auth, deleteMessage)

module.exports = router
