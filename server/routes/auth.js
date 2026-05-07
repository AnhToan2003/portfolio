const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const rateLimiter = require('../middleware/rateLimiter')
const {
  login, refresh, logout, me,
  forgotPassword, resetPassword, changePassword,
} = require('../controllers/authController')

router.post('/login', rateLimiter({ windowMs: 15 * 60_000, max: 10 }), login)
router.post('/refresh', refresh)
router.post('/logout', auth, logout)
router.get('/me', auth, me)

router.post('/forgot-password', rateLimiter({ windowMs: 60 * 60_000, max: 3 }), forgotPassword)
router.post('/reset-password', resetPassword)
router.put('/change-password', auth, changePassword)

module.exports = router
