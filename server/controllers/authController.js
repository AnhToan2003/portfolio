const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password)
      return res.status(400).json({ success: false, error: 'Username and password required' })

    const user = await User.findOne({ username })
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' })

    const match = await user.comparePassword(password)
    if (!match) return res.status(401).json({ success: false, error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'changeme_secret',
      { expiresIn: '7d' }
    )

    res.json({ success: true, token, user: { id: user._id, username: user.username, role: user.role } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.me = (req, res) => {
  res.json({ success: true, user: req.user })
}
