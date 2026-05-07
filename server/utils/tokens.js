const jwt = require('jsonwebtoken')
const crypto = require('crypto')

exports.signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' })

exports.signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })

exports.verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET)

exports.verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET)

exports.generateResetToken = () => crypto.randomBytes(32).toString('hex')

exports.hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex')
