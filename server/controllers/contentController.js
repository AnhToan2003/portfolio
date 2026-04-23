const path = require('path')
const SiteContent = require('../models/SiteContent')

const defaultContent = require('../config/siteContent.json')

exports.getContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne()

    // Fallback: if no content in DB, use siteContent.json defaults
    if (!content) {
      content = defaultContent
    }

    res.json({ success: true, data: content })
  } catch (err) {
    // Always return something — fall back to JSON file on any error
    res.json({ success: true, data: defaultContent })
  }
}

exports.updateContent = async (req, res) => {
  try {
    const content = await SiteContent.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: false,
    })
    res.json({ success: true, data: content })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
}
