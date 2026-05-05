const contactService = require('../services/contactService')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

exports.createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message)
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' })

    if (!EMAIL_RE.test(email))
      return res.status(400).json({ success: false, error: 'Invalid email address.' })

    const contact = await contactService.createMessage({ name, email, subject, message })
    res.status(201).json({ success: true, message: 'Message received! I will reply soon.', id: contact._id })
  } catch {
    res.status(500).json({ success: false, error: 'Server error. Please try again.' })
  }
}

exports.getMessages = async (req, res) => {
  try {
    const contacts = await contactService.getMessages()
    res.json({ success: true, data: contacts, count: contacts.length })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.markRead = async (req, res) => {
  try {
    await contactService.markRead(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.deleteMessage = async (req, res) => {
  try {
    const contact = await contactService.deleteMessage(req.params.id)
    if (!contact) return res.status(404).json({ success: false, error: 'Message not found' })
    res.json({ success: true, message: 'Message deleted' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
