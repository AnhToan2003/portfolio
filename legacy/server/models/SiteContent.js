const mongoose = require('mongoose')

const siteContentSchema = new mongoose.Schema(
  {
    site: {
      name: { type: String, default: 'DevPortfolio' },
      tagline: { type: String },
    },
    hero: {
      badge: { type: String },
      greeting: { type: String },
      name: { type: String },
      subtitle: { type: String },
      typingWords: [{ type: String }],
      description: { type: String },
      cta: {
        primary: { type: String },
        secondary: { type: String },
      },
    },
    about: {
      sectionLabel: { type: String },
      heading: { type: String },
      headingAccent: { type: String },
      paragraphs: [{ type: String }],
      stats: [{ value: String, label: String }],
      techBadges: [{ type: String }],
      resumeLink: { type: String },
      resumeLabel: { type: String },
    },
    contact: {
      sectionLabel: { type: String },
      heading: { type: String },
      headingAccent: { type: String },
      description: { type: String },
      email: { type: String },
      location: { type: String },
      phone: { type: String },
    },
    social: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
    },
    navbar: {
      brand: { type: String },
      cta: { type: String },
      links: [{ type: String }],
    },
    skills: {
      sectionLabel: { type: String },
      heading: { type: String },
      headingAccent: { type: String },
      description: { type: String },
      categories: [{ type: String }],
    },
    projects: {
      sectionLabel: { type: String },
      heading: { type: String },
      headingAccent: { type: String },
      description: { type: String },
      githubUrl: { type: String },
      githubLabel: { type: String },
    },
    experience: {
      sectionLabel: { type: String },
      heading: { type: String },
      headingAccent: { type: String },
      description: { type: String },
    },
    footer: {
      brand: { type: String },
      tagline: { type: String },
      copyright: { type: String },
      techStack: { type: String },
      location: { type: String },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('SiteContent', siteContentSchema)
