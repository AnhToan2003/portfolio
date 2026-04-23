const express = require('express')
const router = express.Router()
const Profile = require('../models/Profile')
const auth = require('../middleware/auth')

// GET /api/profile — public
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })
    res.json({ success: true, data: profile })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/profile — protected
router.put('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    })
    res.json({ success: true, data: profile })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

module.exports = router
