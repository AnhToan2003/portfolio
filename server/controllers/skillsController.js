const skillService = require('../services/skillService')

exports.getSkills = async (req, res) => {
  try {
    const skills = await skillService.getSkills()
    res.json({ success: true, data: skills })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.createSkill = async (req, res) => {
  try {
    const { name, level, category } = req.body
    if (!name) return res.status(400).json({ success: false, error: 'Skill name is required' })
    const skill = await skillService.addSkill({ name, level: level ?? 80, category: category || 'Frontend' })
    res.status(201).json({ success: true, data: skill })
  } catch (err) {
    res.status(err.status || 400).json({ success: false, error: err.message })
  }
}

exports.updateSkill = async (req, res) => {
  try {
    const skill = await skillService.updateSkill(req.params.id, req.body)
    res.json({ success: true, data: skill })
  } catch (err) {
    res.status(err.status || 400).json({ success: false, error: err.message })
  }
}

exports.deleteSkill = async (req, res) => {
  try {
    await skillService.deleteSkill(req.params.id)
    res.json({ success: true, message: 'Skill deleted' })
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message })
  }
}
