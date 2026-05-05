import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '../context/ContentContext'

export default function Navbar() {
  const { content } = useContent()
  const { navbar } = content

  const navLinks = (navbar.links || []).map(label => ({
    label,
    href: `#${label.toLowerCase()}`,
  }))

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [active, setActive] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(scrollY > 60)
      setScrollProgress((scrollY / docHeight) * 100)

      const sections = navLinks.map(l => l.href.slice(1))
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && scrollY >= el.offsetTop - 120) {
          setActive(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navLinks.length])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-50" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          className="h-full origin-left"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', scaleX: scrollProgress / 100 }}
        />
      </div>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'glass py-3' : 'py-5 bg-transparent'}`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold font-grotesk text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              &lt;/&gt;
            </div>
            <span className="font-grotesk font-semibold text-white text-sm tracking-wide hidden sm:block">
              Dev<span className="gradient-text">Portfolio</span>
            </span>
          </motion.a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const id = href.slice(1)
              return (
                <li key={label}>
                  <button
                    onClick={() => handleNavClick(href)}
                    className={`relative px-4 py-2 font-inter text-sm font-medium rounded-lg transition-colors duration-200 ${
                      active === id ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {active === id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(124,58,237,0.15)' }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick('#contact')}
              className="px-5 py-2.5 rounded-full text-sm font-medium font-inter text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              {navbar.cta}
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span className="block w-6 h-0.5 bg-white rounded"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }} />
            <motion.span className="block w-6 h-0.5 bg-white rounded"
              animate={{ opacity: menuOpen ? 0 : 1 }} />
            <motion.span className="block w-6 h-0.5 bg-white rounded"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 mobile-menu-overlay flex flex-col items-center justify-center gap-6 md:hidden"
          >
            {navLinks.map(({ label, href }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleNavClick(href)}
                className="font-grotesk font-semibold text-3xl text-white hover:gradient-text transition-colors"
              >
                {label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => handleNavClick('#contact')}
              className="mt-4 px-8 py-3 rounded-full font-inter font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              {navbar.cta}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
