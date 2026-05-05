const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String },
    tech: [{ type: String }],
    github: { type: String },
    demo: { type: String },
    category: { type: String, default: 'Full Stack' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Project', projectSchema)
