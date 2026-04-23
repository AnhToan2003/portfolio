const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String },
    bio: { type: String },
    email: { type: String },
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    avatar: { type: String },
    skills: [
      {
        name: String,
        level: { type: Number, min: 0, max: 100 },
        category: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        period: String,
        location: String,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        period: String,
        description: String,
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Profile', profileSchema)
