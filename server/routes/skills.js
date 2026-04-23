const express = require('express')
const router = express.Router()
const Profile = require('../models/Profile')
const auth = require('../middleware/auth')

// GET /api/skills
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({}, 'skills')
    res.json({ success: true, data: profile ? profile.skills : [] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/skills
router.post('/', auth, async (req, res) => {
  try {
    const { name, level, category } = req.body
    if (!name) return res.status(400).json({ success: false, error: 'Skill name is required' })

    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    profile.skills.push({ name, level: level ?? 80, category: category || 'Frontend' })
    await profile.save()

    const newSkill = profile.skills[profile.skills.length - 1]
    res.status(201).json({ success: true, data: newSkill })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PUT /api/skills/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    const skill = profile.skills.id(req.params.id)
    if (!skill) return res.status(404).json({ success: false, error: 'Skill not found' })

    const { name, level, category } = req.body
    if (name !== undefined) skill.name = name
    if (level !== undefined) skill.level = level
    if (category !== undefined) skill.category = category

    await profile.save()
    res.json({ success: true, data: skill })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// DELETE /api/skills/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    profile.skills = profile.skills.filter((s) => s._id.toString() !== req.params.id)
    await profile.save()

    res.json({ success: true, message: 'Skill deleted' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
