const path = require('path')
const fs = require('fs')

const uploadsDir = path.join(__dirname, '../uploads')
const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'])

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' })
  const url = `/uploads/${req.file.filename}`
  res.json({ success: true, url })
}

exports.deleteImage = (req, res) => {
  const { filename } = req.body
  if (!filename) return res.status(400).json({ success: false, error: 'Filename required' })

  const base = path.basename(filename)
  const ext = path.extname(base).toLowerCase()
  if (!ALLOWED_EXTS.has(ext))
    return res.status(400).json({ success: false, error: 'Invalid file type' })

  const filePath = path.join(uploadsDir, base)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

  res.json({ success: true })
}
