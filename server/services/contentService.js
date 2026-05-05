const SiteContent = require('../models/SiteContent')
const defaultContent = require('../config/siteContent.json')

exports.getContent = async () => {
  const content = await SiteContent.findOne()
  return content || defaultContent
}

exports.updateContent = (data) =>
  SiteContent.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: false })
