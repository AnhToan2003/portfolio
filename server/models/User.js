const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userAgent: { type: String },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, default: 'Admin' },
    role: { type: String, default: 'admin' },
    mustChangePassword: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
    refreshTokens: [refreshTokenSchema],
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLogin: { type: Date },
    lastLoginIp: { type: String },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordChangedAt = new Date()
  next()
})

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.methods.incrementFailedLogin = async function () {
  this.failedLoginAttempts += 1
  if (this.failedLoginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000)
  }
  await this.save()
}

userSchema.methods.resetFailedLogin = async function () {
  this.failedLoginAttempts = 0
  this.lockUntil = undefined
  await this.save()
}

module.exports = mongoose.model('User', userSchema)
