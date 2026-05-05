const Contact = require('../models/Contact')

exports.createMessage = (data) => Contact.create(data)

exports.getMessages = () => Contact.find().sort({ createdAt: -1 })

exports.markRead = (id) => Contact.findByIdAndUpdate(id, { read: true })

exports.deleteMessage = (id) => Contact.findByIdAndDelete(id)
