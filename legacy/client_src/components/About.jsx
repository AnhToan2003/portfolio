import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiCode, FiLayers, FiZap, FiAward } from 'react-icons/fi'
import { useContent } from '../context/ContentContext'

const statIcons = [FiZap, FiLayers, FiCode, FiAward]

const highlights = [
  { color: '#7c3aed', label: 'React & Next.js' },
  { color: '#06b6d4', label: 'Node.js & Express' },
  { color: '#8b5cf6', label: 'MongoDB & PostgreSQL' },
  { color: '#22d3ee', label: '3D Web & Three.js' },
]

function StatCard({ stat, index }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  const Icon = statIcons[index % statIcons.length]
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }} whileHover={{ scale: 1.05, y: -4 }}
      className="glass rounded-2xl p-5 flex flex-col items-center gap-2 text-center">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
        <Icon size={18} className="text-purple-400" />
      </div>
      <span className="font-grotesk font-bold text-3xl gradient-text">{stat.value}</span>
      <span className="font-inter text-slate-500 text-xs">{stat.label}</span>
    </motion.div>
  )
}

export default function About() {
  const { content } = useContent()
  const { about } = content
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={sectionRef} className="relative py-28 overflow-hidden" style={{ background: '#05050a' }}>
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="max-w-6xl mx-auto px-6">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="font-inter text-purple-400 text-sm font-medium tracking-widest uppercase mb-3">
          {about.sectionLabel}
        </motion.p>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Avatar */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }} className="relative flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full p-0.5"
                style={{ background: 'conic-gradient(from 0deg, #7c3aed, #06b6d4, transparent, #7c3aed)' }}>
                <div className="w-full h-full rounded-full" style={{ background: '#05050a' }} />
              </motion.div>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-3 rounded-full p-0.5 opacity-40"
                style={{ background: 'conic-gradient(from 90deg, #06b6d4, #7c3aed, transparent)' }}>
                <div className="w-full h-full rounded-full" style={{ background: '#05050a' }} />
              </motion.div>
              <div className="absolute inset-4 rounded-full overflow-hidden flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))' }}>
                <div className="text-center">
                  <div className="text-7xl mb-2 select-none">👨‍💻</div>
                  <div className="font-grotesk font-bold text-slate-300 text-lg">AT</div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #7c3aed 0%, #06b6d4 50%, transparent 70%)' }} />
            </div>
            {highlights.map(({ color, label }, i) => {
              const positions = [{ top: '5%', right: '-15%' }, { bottom: '20%', right: '-20%' }, { bottom: '5%', left: '5%' }, { top: '20%', left: '-15%' }]
              return (
                <motion.div key={label} style={positions[i]}
                  animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                  className="absolute glass rounded-xl px-3 py-2 flex items-center gap-2 whitespace-nowrap shadow-lg">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="font-inter text-slate-300 text-xs">{label}</span>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Right — Text */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}>
            <h2 className="font-grotesk font-bold text-4xl md:text-5xl leading-tight mb-6">
              {about.heading}<br />
              <span className="gradient-text">{about.headingAccent}</span>
            </h2>
            <div className="space-y-4 font-inter text-slate-400 text-base leading-relaxed mb-8">
              {(about.paragraphs || []).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="flex flex-wrap gap-2 mb-10">
              {(about.techBadges || []).map((tag) => <span key={tag} className="tag-badge">{tag}</span>)}
            </div>
            <motion.a href={about.resumeLink || '/cv.pdf'} download
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(124,58,237,0.35)' }} whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-grotesk font-medium text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              <span>{about.resumeLabel}</span><span>↓</span>
            </motion.a>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {(about.stats || []).map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
        </div>
      </div>
    </section>
  )
}
