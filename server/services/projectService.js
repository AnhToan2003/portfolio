const Project = require('../models/Project')

exports.getProjects = (filter = {}) =>
  Project.find(filter).sort({ order: 1, createdAt: -1 })

exports.getProjectById = (id) => Project.findById(id)

exports.createProject = (data) => Project.create(data)

exports.updateProject = (id, data) =>
  Project.findByIdAndUpdate(id, data, { new: true, runValidators: true })

exports.deleteProject = (id) => Project.findByIdAndDelete(id)
