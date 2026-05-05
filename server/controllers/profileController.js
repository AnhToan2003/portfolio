const profileService = require('../services/profileService')

exports.getProfile = async (req, res) => {
  try {
    const profile = await profileService.getProfile()
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })
    res.json({ success: true, data: profile })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const profile = await profileService.updateProfile(req.body)
    res.json({ success: true, data: profile })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
}
