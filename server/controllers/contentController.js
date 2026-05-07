const contentService = require('../services/contentService')
const defaultContent = require('../config/siteContent.json')

const SECTIONS = ['site', 'navbar', 'hero', 'about', 'skills', 'projects', 'experience', 'contact', 'social', 'footer']

exports.getContent = async (req, res) => {
  try {
    const content = await contentService.getContent()
    res.json({ success: true, data: content })
  } catch {
    res.json({ success: true, data: defaultContent })
  }
}

exports.updateContent = async (req, res) => {
  try {
    const content = await contentService.updateContent(req.body)
    res.json({ success: true, data: content })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
}

exports.getSection = async (req, res) => {
  const { section } = req.params
  if (!SECTIONS.includes(section))
    return res.status(404).json({ success: false, error: 'Section not found' })
  try {
    const data = await contentService.getSection(section)
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.updateSection = async (req, res) => {
  const { section } = req.params
  if (!SECTIONS.includes(section))
    return res.status(404).json({ success: false, error: 'Section not found' })
  try {
    const data = await contentService.updateSection(section, req.body)
    res.json({ success: true, data })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
}
