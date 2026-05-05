const contentService = require('../services/contentService')
const defaultContent = require('../config/siteContent.json')

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
