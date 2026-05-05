const store = new Map()

module.exports = function rateLimiter({ windowMs = 60_000, max = 5 } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown'
    const now = Date.now()
    const record = store.get(key)

    if (!record || now - record.start > windowMs) {
      store.set(key, { start: now, count: 1 })
      return next()
    }

    if (record.count >= max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait before trying again.',
      })
    }

    record.count++
    next()
  }
}
