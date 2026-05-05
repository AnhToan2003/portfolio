const Profile = require('../models/Profile')

const notFound = (msg, status = 404) => Object.assign(new Error(msg), { status })

exports.getSkills = () =>
  Profile.findOne({}, 'skills').then((p) => (p ? p.skills : []))

exports.addSkill = async ({ name, level = 80, category = 'Frontend' }) => {
  const profile = await Profile.findOne()
  if (!profile) throw notFound('Profile not found')
  profile.skills.push({ name, level, category })
  await profile.save()
  return profile.skills[profile.skills.length - 1]
}

exports.updateSkill = async (id, data) => {
  const profile = await Profile.findOne()
  if (!profile) throw notFound('Profile not found')
  const skill = profile.skills.id(id)
  if (!skill) throw notFound('Skill not found')
  Object.assign(skill, data)
  await profile.save()
  return skill
}

exports.deleteSkill = async (id) => {
  const profile = await Profile.findOne()
  if (!profile) throw notFound('Profile not found')
  profile.skills = profile.skills.filter((s) => s._id.toString() !== id)
  await profile.save()
}
