const Profile = require('../models/Profile')

exports.getProfile = () => Profile.findOne()

exports.updateProfile = (data) =>
  Profile.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: true })
