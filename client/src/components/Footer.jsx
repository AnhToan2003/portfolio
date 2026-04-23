import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiArrowUp, FiHeart } from 'react-icons/fi'
import { useContent } from '../context/ContentContext'

const navLinks = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

export default function Footer() {
  const { content } = useContent()
  const { footer, social } = content

  const socials = [
    { icon: FiGithub, href: social.github, label: 'GitHub' },
    { icon: FiLinkedin, href: social.linkedin, label: 'LinkedIn' },
    { icon: FiTwitter, href: social.twitter, label: 'Twitter' },
  ]

  const year = new Date().getFullYear()

  return (
    <footer className="relative py-12 overflow-hidden"
      style={{ background: '#030308', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }} />
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-grotesk text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>&lt;/&gt;</div>
              <span className="font-grotesk font-semibold text-white">Dev<span className="gradient-text">Portfolio</span></span>
            </div>
            <p className="font-inter text-slate-600 text-xs max-w-xs">{footer.tagline}</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <button key={link} onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="font-inter text-slate-500 text-sm hover:text-white transition-colors">{link}</button>
            ))}
          </nav>
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                whileHover={{ scale: 1.15, y: -3 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Icon size={15} />
              </motion.a>
            ))}
          </div>
        </div>
        <div className="h-px w-full mb-6" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-inter text-slate-600 text-xs flex items-center gap-1.5">
            © {year} {footer.copyright}. Made with <FiHeart size={11} className="text-purple-500" /> in {footer.location}.
          </p>
          <p className="font-inter text-slate-700 text-xs">{footer.techStack}</p>
          <motion.button whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-colors"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }} aria-label="Back to top">
            <FiArrowUp size={15} />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
