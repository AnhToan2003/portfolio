const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' })
    }

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const match = await user.comparePassword(password)
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'changeme_secret',
      { expiresIn: '7d' }
    )

    res.json({ success: true, token, user: { id: user._id, username: user.username, role: user.role } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/auth/me — verify token & return current user
router.get('/me', require('../middleware/auth'), (req, res) => {
  res.json({ success: true, user: req.user })
})

module.exports = router
