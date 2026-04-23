const path = require('path')
const fs = require('fs')

const uploadsDir = path.join(__dirname, '../uploads')

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' })
  const url = `/uploads/${req.file.filename}`
  res.json({ success: true, url })
}

exports.deleteImage = (req, res) => {
  const { filename } = req.body
  if (!filename) return res.status(400).json({ success: false, error: 'Filename required' })

  const filePath = path.join(uploadsDir, path.basename(filename))
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

  res.json({ success: true })
}
