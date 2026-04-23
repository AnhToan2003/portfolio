import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiArrowUp, FiHeart } from 'react-icons/fi'

const navLinks = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

const socials = [
  { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
]

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative py-12 overflow-hidden"
      style={{ background: '#030308', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }} />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-grotesk text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                &lt;/&gt;
              </div>
              <span className="font-grotesk font-semibold text-white">
                Dev<span className="gradient-text">Portfolio</span>
              </span>
            </div>
            <p className="font-inter text-slate-600 text-xs max-w-xs">
              Building beautiful digital experiences with passion and precision.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="font-inter text-slate-500 text-sm hover:text-white transition-colors"
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.15, y: -3 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Icon size={15} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-6" style={{ background: 'rgba(255,255,255,0.04)' }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-inter text-slate-600 text-xs flex items-center gap-1.5">
            © 2024 Anh Toan. Made with <FiHeart size={11} className="text-purple-500" /> in Vietnam.
          </p>
          <p className="font-inter text-slate-700 text-xs">
            React · Node.js · MongoDB · Three.js
          </p>
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-colors"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
            aria-label="Back to top"
          >
            <FiArrowUp size={15} />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
