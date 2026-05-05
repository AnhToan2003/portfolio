const Profile = require('../models/Profile')

exports.getExperience = async (req, res) => {
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
}

exports.createExperience = async (req, res) => {
  try {
    const { company, role, period, location, description } = req.body
    if (!company || !role)
      return res.status(400).json({ success: false, error: 'Company and role are required' })

    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    profile.experience.push({ company, role, period, location, description })
    await profile.save()
    res.status(201).json({ success: true, data: profile.experience[profile.experience.length - 1] })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
}

exports.updateExperience = async (req, res) => {
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
}

exports.deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    profile.experience = profile.experience.filter((e) => e._id.toString() !== req.params.id)
    await profile.save()
    res.json({ success: true, message: 'Experience deleted' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.createEducation = async (req, res) => {
  try {
    const { school, degree, period, description } = req.body
    if (!school || !degree)
      return res.status(400).json({ success: false, error: 'School and degree are required' })

    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    profile.education.push({ school, degree, period, description })
    await profile.save()
    res.status(201).json({ success: true, data: profile.education[profile.education.length - 1] })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
}

exports.updateEducation = async (req, res) => {
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
}

exports.deleteEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    profile.education = profile.education.filter((e) => e._id.toString() !== req.params.id)
    await profile.save()
    res.json({ success: true, message: 'Education deleted' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
