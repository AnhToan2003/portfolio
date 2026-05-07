const User = require('../models/User')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokens')

const REFRESH_COOKIE = 'refreshToken'

const cookieOpts = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' })

    if (user.isLocked)
      return res.status(423).json({ success: false, error: 'Account locked. Try again in 30 minutes.' })

    const match = await user.comparePassword(password)
    if (!match) {
      await user.incrementFailedLogin()
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    await user.resetFailedLogin()
    user.lastLogin = new Date()
    user.lastLoginIp = req.ip || req.headers['x-forwarded-for']

    const payload = { id: user._id, email: user.email, role: user.role }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    user.refreshTokens.push({ token: refreshToken, userAgent: req.headers['user-agent'] || '' })
    if (user.refreshTokens.length > 5) user.refreshTokens = user.refreshTokens.slice(-5)
    await user.save()

    res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts())
    res.json({
      success: true,
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE]
    if (!token) return res.status(401).json({ success: false, error: 'No refresh token' })

    let payload
    try {
      payload = verifyRefreshToken(token)
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' })
    }

    const user = await User.findById(payload.id)
    if (!user) return res.status(401).json({ success: false, error: 'User not found' })

    const stored = user.refreshTokens.find((t) => t.token === token)
    if (!stored) return res.status(401).json({ success: false, error: 'Refresh token revoked' })

    const newAccessToken = signAccessToken({ id: user._id, email: user.email, role: user.role })
    res.json({ success: true, token: newAccessToken })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE]
    if (token && req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, { $pull: { refreshTokens: { token } } })
    }
    res.clearCookie(REFRESH_COOKIE, cookieOpts())
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.me = (req, res) => {
  res.json({ success: true, user: req.user })
}
