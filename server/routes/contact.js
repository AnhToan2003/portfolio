const express = require('express')
const router = express.Router()
const Contact = require('../models/Contact')
const auth = require('../middleware/auth')

// POST /api/contact — public, save new message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' })
    }
    const contact = await Contact.create({ name, email, subject, message })
    res.status(201).json({ success: true, message: 'Message received! I will reply soon.', id: contact._id })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error. Please try again.' })
  }
})

// GET /api/contact — protected, list all messages
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, data: contacts, count: contacts.length })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/contact/:id/read — protected
router.patch('/:id/read', auth, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { read: true })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/contact/:id — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) return res.status(404).json({ success: false, error: 'Message not found' })
    res.json({ success: true, message: 'Message deleted' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
