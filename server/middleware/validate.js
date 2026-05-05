exports.required = (...fields) => (req, res, next) => {
  const missing = fields.filter((f) => !req.body[f]?.toString().trim())
  if (missing.length) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missing.join(', ')}`,
    })
  }
  next()
}

exports.sanitizeBody = (req, _res, next) => {
  for (const key of Object.keys(req.body)) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim()
    }
  }
  next()
}
