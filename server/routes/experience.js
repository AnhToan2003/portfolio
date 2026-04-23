const express = require('express')
const router = express.Router()
const Profile = require('../models/Profile')
const auth = require('../middleware/auth')

// ─── EXPERIENCE ─────────────────────────────────────────────────────────────

// GET /api/experience
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({}, 'experience education')
    res.json({
      success: true,
      data: {
        experience: profile ? profile.experience : [],
        education: profile ? profile.education : [],
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/experience
router.post('/', auth, async (req, res) => {
  try {
    const { company, role, period, location, description } = req.body
    if (!company || !role) {
      return res.status(400).json({ success: false, error: 'Company and role are required' })
    }

    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    profile.experience.push({ company, role, period, location, description })
    await profile.save()

    const entry = profile.experience[profile.experience.length - 1]
    res.status(201).json({ success: true, data: entry })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PUT /api/experience/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    const entry = profile.experience.id(req.params.id)
    if (!entry) return res.status(404).json({ success: false, error: 'Entry not found' })

    Object.assign(entry, req.body)
    await profile.save()
    res.json({ success: true, data: entry })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// DELETE /api/experience/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    profile.experience = profile.experience.filter((e) => e._id.toString() !== req.params.id)
    await profile.save()
    res.json({ success: true, message: 'Experience deleted' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ─── EDUCATION ───────────────────────────────────────────────────────────────

// POST /api/experience/education
router.post('/education', auth, async (req, res) => {
  try {
    const { school, degree, period, description } = req.body
    if (!school || !degree) {
      return res.status(400).json({ success: false, error: 'School and degree are required' })
    }

    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    profile.education.push({ school, degree, period, description })
    await profile.save()

    const entry = profile.education[profile.education.length - 1]
    res.status(201).json({ success: true, data: entry })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PUT /api/experience/education/:id
router.put('/education/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    const entry = profile.education.id(req.params.id)
    if (!entry) return res.status(404).json({ success: false, error: 'Entry not found' })

    Object.assign(entry, req.body)
    await profile.save()
    res.json({ success: true, data: entry })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// DELETE /api/experience/education/:id
router.delete('/education/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    profile.education = profile.education.filter((e) => e._id.toString() !== req.params.id)
    await profile.save()
    res.json({ success: true, message: 'Education deleted' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
