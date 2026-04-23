const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const auth = require('../middleware/auth')

const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, unique + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg/
  const ext = allowed.test(path.extname(file.originalname).toLowerCase())
  const mime = allowed.test(file.mimetype)
  if (ext && mime) return cb(null, true)
  cb(new Error('Only image files are allowed'))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

// POST /api/upload — single image upload
router.post('/', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' })
  const url = `/uploads/${req.file.filename}`
  res.json({ success: true, url })
})

// DELETE /api/upload — remove a previously uploaded file
router.delete('/', auth, (req, res) => {
  const { filename } = req.body
  if (!filename) return res.status(400).json({ success: false, error: 'Filename required' })

  const filePath = path.join(uploadsDir, path.basename(filename))
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

  res.json({ success: true })
})

module.exports = router
