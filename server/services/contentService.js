const SiteContent = require('../models/SiteContent')
const defaultContent = require('../config/siteContent.json')

exports.getContent = async () => {
  const content = await SiteContent.findOne()
  return content || defaultContent
}

exports.updateContent = (data) =>
  SiteContent.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: false })

exports.getSection = async (section) => {
  const content = await SiteContent.findOne({}, section)
  if (!content || !content[section]) return defaultContent[section] ?? null
  return content[section]
}

exports.updateSection = async (section, data) => {
  const update = { [section]: data }
  const doc = await SiteContent.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true, runValidators: false })
  return doc[section]
}
