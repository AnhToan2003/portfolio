const User = require('../models/User')
const { signAccessToken, signRefreshToken, verifyRefreshToken, generateResetToken, hashToken } = require('../utils/tokens')
const { sendPasswordReset, sendPasswordChanged } = require('../utils/email')

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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email)
      return res.status(400).json({ success: false, error: 'Email is required' })

    // Always return success to prevent email enumeration
    const user = await User.findOne({ email })
    if (user) {
      const rawToken = generateResetToken()
      user.resetPasswordToken = hashToken(rawToken)
      user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15min
      await user.save()

      const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password?token=${rawToken}`
      await sendPasswordReset(email, resetUrl)
    }

    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body
    if (!token || !password)
      return res.status(400).json({ success: false, error: 'Token and new password are required' })

    if (password.length < 8)
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' })

    const hashed = hashToken(token)
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpiry: { $gt: Date.now() },
    })

    if (!user)
      return res.status(400).json({ success: false, error: 'Reset token is invalid or has expired' })

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    user.refreshTokens = [] // invalidate all sessions
    user.mustChangePassword = false
    await user.save()

    await sendPasswordChanged(user.email)

    res.json({ success: true, message: 'Password reset successfully. Please log in.' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, error: 'Current and new password are required' })

    if (newPassword.length < 8)
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters' })

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })

    const match = await user.comparePassword(currentPassword)
    if (!match) return res.status(401).json({ success: false, error: 'Current password is incorrect' })

    const currentRefreshToken = req.cookies?.[REFRESH_COOKIE]
    user.password = newPassword
    user.mustChangePassword = false
    // Keep only the current session's refresh token, revoke all others
    user.refreshTokens = currentRefreshToken
      ? user.refreshTokens.filter((t) => t.token === currentRefreshToken)
      : []
    await user.save()

    await sendPasswordChanged(user.email)

    res.json({ success: true, message: 'Password changed successfully.' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
