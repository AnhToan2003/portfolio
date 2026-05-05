import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiBriefcase, FiBook, FiCalendar, FiMapPin } from 'react-icons/fi'
import { useContent } from '../context/ContentContext'
import api from '../utils/api'

const WORK_COLORS = ['#7c3aed', '#06b6d4', '#8b5cf6', '#22d3ee']
const EDU_COLORS  = ['#22d3ee', '#f59e0b']

function TimelineItem({ item, index, isLast }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isWork = item.type === 'work'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: 'easeOut' }}
      className="relative flex gap-6 pb-12 last:pb-0"
    >
      {!isLast && <div className="absolute left-5 top-12 bottom-0 w-px timeline-line" />}

      <div className="relative z-10 flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.2, type: 'spring', bounce: 0.4 }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: `${item.color}20`, border: `2px solid ${item.color}50` }}
        >
          {isWork
            ? <FiBriefcase size={16} style={{ color: item.color }} />
            : <FiBook size={16} style={{ color: item.color }} />}
        </motion.div>
      </div>

      <motion.div
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className="glass rounded-2xl p-6 flex-1 group"
      >
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-inter text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30` }}>
            {isWork ? 'Work' : 'Education'}
          </span>
          {item.period && (
            <div className="flex items-center gap-1 text-slate-600 text-xs font-inter">
              <FiCalendar size={11} /><span>{item.period}</span>
            </div>
          )}
          {item.location && (
            <div className="flex items-center gap-1 text-slate-600 text-xs font-inter">
              <FiMapPin size={11} /><span>{item.location}</span>
            </div>
          )}
        </div>

        <h3 className="font-grotesk font-semibold text-white text-lg mb-0.5">{item.role}</h3>
        <p className="font-inter font-medium text-sm mb-3" style={{ color: item.color }}>
          @ {item.company}
        </p>
        {item.description && (
          <p className="font-inter text-slate-500 text-sm leading-relaxed mb-4">{item.description}</p>
        )}
        {item.tech?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tech.map(t => (
              <span key={t} className="font-inter text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }}>
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(180deg, transparent, ${item.color}, transparent)` }} />
      </motion.div>
    </motion.div>
  )
}

export default function Experience() {
  const { content } = useContent()
  const { experience: ec } = content

  const [timeline, setTimeline] = useState([])
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    api.get('/api/experience').then(res => {
      if (res.data?.data) {
        const { experience = [], education = [] } = res.data.data
        const combined = [
          ...experience.map((e, i) => ({
            ...e, type: 'work', color: WORK_COLORS[i % WORK_COLORS.length],
          })),
          ...education.map((e, i) => ({
            ...e, type: 'education',
            role: e.degree, company: e.school,
            color: EDU_COLORS[i % EDU_COLORS.length],
          })),
        ]
        setTimeline(combined)
      }
    }).catch(() => {})
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="relative py-28 overflow-hidden"
      style={{ background: '#080812' }}>
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-6 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-inter text-purple-400 text-sm font-medium tracking-widest uppercase mb-3">
            {ec.sectionLabel}
          </p>
          <h2 className="font-grotesk font-bold text-4xl md:text-5xl mb-4">
            {ec.heading} <span className="gradient-text">{ec.headingAccent}</span>
          </h2>
          <p className="font-inter text-slate-500 text-base max-w-xl">{ec.description}</p>
        </motion.div>

        <div className="max-w-3xl">
          {timeline.map((item, i) => (
            <TimelineItem key={item._id || i} item={item} index={i} isLast={i === timeline.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
