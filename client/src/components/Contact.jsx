import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiSend, FiMail, FiMapPin, FiPhone, FiGithub, FiLinkedin, FiTwitter, FiCheck } from 'react-icons/fi'
import axios from 'axios'
import { useContent } from '../context/ContentContext'

const inputClass = 'input-field'

export default function Contact() {
  const { content } = useContent()
  const { contact, social } = content

  const contactInfo = [
    { icon: FiMail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: FiMapPin, label: 'Location', value: contact.location, href: '#' },
    { icon: FiPhone, label: 'Phone', value: contact.phone, href: `tel:${contact.phone}` },
  ]

  const socials = [
    { icon: FiGithub, href: social.github, label: 'GitHub' },
    { icon: FiLinkedin, href: social.linkedin, label: 'LinkedIn' },
    { icon: FiTwitter, href: social.twitter, label: 'Twitter' },
  ]

  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')
    try {
      await axios.post('/api/contact', form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="relative py-28 overflow-hidden"
      style={{ background: '#05050a' }}>
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.12), transparent 70%)' }} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="font-inter text-purple-400 text-sm font-medium tracking-widest uppercase mb-3">
            05 — Contact
          </p>
          <h2 className="font-grotesk font-bold text-4xl md:text-5xl mb-4">
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p className="font-inter text-slate-500 text-base max-w-lg mx-auto">
            Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Contact info */}
            <div className="glass rounded-2xl p-6 space-y-5">
              <h3 className="font-grotesk font-semibold text-white text-lg mb-5">Get in touch</h3>
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                    style={{ background: 'rgba(124,58,237,0.12)' }}>
                    <Icon size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="font-inter text-slate-600 text-xs mb-0.5">{label}</div>
                    <div className="font-inter text-slate-300 text-sm group-hover:text-white transition-colors">
                      {value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social links */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-grotesk font-semibold text-white text-sm mb-4">Find me online</h3>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability card */}
            <div className="glass rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-grotesk font-semibold text-green-400 text-sm">Available for Work</span>
              </div>
              <p className="font-inter text-slate-500 text-xs leading-relaxed">
                I'm currently open to freelance projects, full-time roles, and exciting collaborations. Response time: 24–48h.
              </p>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 space-y-5">
              <h3 className="font-grotesk font-semibold text-white text-lg mb-2">Send a Message</h3>

              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-slate-500 text-xs mb-1.5 block">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nguyen Van A"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="font-inter text-slate-500 text-xs mb-1.5 block">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="font-inter text-slate-500 text-xs mb-1.5 block">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Project collaboration, job offer..."
                  className={inputClass}
                />
              </div>

              {/* Message */}
              <div>
                <label className="font-inter text-slate-500 text-xs mb-1.5 block">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, timeline, budget..."
                  rows={6}
                  className={inputClass}
                  style={{ resize: 'vertical', minHeight: '140px' }}
                  required
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                whileHover={status === 'idle' ? { scale: 1.02, boxShadow: '0 0 30px rgba(124,58,237,0.4)' } : {}}
                whileTap={status === 'idle' ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-xl font-grotesk font-medium text-white flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60"
                style={{ background: status === 'success'
                  ? 'linear-gradient(135deg, #059669, #10b981)'
                  : 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                }}
              >
                {status === 'loading' && (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                )}
                {status === 'success' && <FiCheck size={18} />}
                {status === 'idle' && <FiSend size={16} />}
                <span>
                  {status === 'loading' ? 'Sending...'
                    : status === 'success' ? 'Message Sent!'
                    : status === 'error' ? 'Failed — Try Again'
                    : 'Send Message'}
                </span>
              </motion.button>

              {/* Error */}
              {status === 'error' && (
                <p className="text-red-400 text-xs font-inter text-center">
                  Something went wrong. Please try again or email directly.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
