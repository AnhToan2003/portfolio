const Profile = require('../models/Profile')

const notFound = (msg, status = 404) => Object.assign(new Error(msg), { status })

exports.getExperience = () =>
  Profile.findOne({}, 'experience education').then((p) => ({
    experience: p ? p.experience : [],
    education: p ? p.education : [],
  }))

exports.addExperience = async (data) => {
  const profile = await Profile.findOne()
  if (!profile) throw notFound('Profile not found')
  profile.experience.push(data)
  await profile.save()
  return profile.experience[profile.experience.length - 1]
}

exports.updateExperience = async (id, data) => {
  const profile = await Profile.findOne()
  if (!profile) throw notFound('Profile not found')
  const entry = profile.experience.id(id)
  if (!entry) throw notFound('Entry not found')
  Object.assign(entry, data)
  await profile.save()
  return entry
}

exports.deleteExperience = async (id) => {
  const profile = await Profile.findOne()
  if (!profile) throw notFound('Profile not found')
  profile.experience = profile.experience.filter((e) => e._id.toString() !== id)
  await profile.save()
}

exports.addEducation = async (data) => {
  const profile = await Profile.findOne()
  if (!profile) throw notFound('Profile not found')
  profile.education.push(data)
  await profile.save()
  return profile.education[profile.education.length - 1]
}

exports.updateEducation = async (id, data) => {
  const profile = await Profile.findOne()
  if (!profile) throw notFound('Profile not found')
  const entry = profile.education.id(id)
  if (!entry) throw notFound('Entry not found')
  Object.assign(entry, data)
  await profile.save()
  return entry
}

exports.deleteEducation = async (id) => {
  const profile = await Profile.findOne()
  if (!profile) throw notFound('Profile not found')
  profile.education = profile.education.filter((e) => e._id.toString() !== id)
  await profile.save()
}
