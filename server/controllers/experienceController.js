const experienceService = require('../services/experienceService')

exports.getExperience = async (req, res) => {
  try {
    const data = await experienceService.getExperience()
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.createExperience = async (req, res) => {
  try {
    const { company, role, period, location, description } = req.body
    if (!company || !role)
      return res.status(400).json({ success: false, error: 'Company and role are required' })
    const entry = await experienceService.addExperience({ company, role, period, location, description })
    res.status(201).json({ success: true, data: entry })
  } catch (err) {
    res.status(err.status || 400).json({ success: false, error: err.message })
  }
}

exports.updateExperience = async (req, res) => {
  try {
    const entry = await experienceService.updateExperience(req.params.id, req.body)
    res.json({ success: true, data: entry })
  } catch (err) {
    res.status(err.status || 400).json({ success: false, error: err.message })
  }
}

exports.deleteExperience = async (req, res) => {
  try {
    await experienceService.deleteExperience(req.params.id)
    res.json({ success: true, message: 'Experience deleted' })
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message })
  }
}

exports.createEducation = async (req, res) => {
  try {
    const { school, degree, period, description } = req.body
    if (!school || !degree)
      return res.status(400).json({ success: false, error: 'School and degree are required' })
    const entry = await experienceService.addEducation({ school, degree, period, description })
    res.status(201).json({ success: true, data: entry })
  } catch (err) {
    res.status(err.status || 400).json({ success: false, error: err.message })
  }
}

exports.updateEducation = async (req, res) => {
  try {
    const entry = await experienceService.updateEducation(req.params.id, req.body)
    res.json({ success: true, data: entry })
  } catch (err) {
    res.status(err.status || 400).json({ success: false, error: err.message })
  }
}

exports.deleteEducation = async (req, res) => {
  try {
    await experienceService.deleteEducation(req.params.id)
    res.json({ success: true, message: 'Education deleted' })
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message })
  }
}
