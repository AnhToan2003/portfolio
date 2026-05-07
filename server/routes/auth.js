const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const rateLimiter = require('../middleware/rateLimiter')
const { login, refresh, logout, me } = require('../controllers/authController')

router.post('/login', rateLimiter({ windowMs: 15 * 60_000, max: 10 }), login)
router.post('/refresh', refresh)
router.post('/logout', auth, logout)
router.get('/me', auth, me)

module.exports = router
