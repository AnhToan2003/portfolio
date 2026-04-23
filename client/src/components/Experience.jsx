import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiBriefcase, FiBook, FiCalendar, FiMapPin } from 'react-icons/fi'

const experiences = [
  {
    type: 'work',
    role: 'Senior Full Stack Developer',
    company: 'TechVision Labs',
    period: '2023 – Present',
    location: 'Ho Chi Minh City, Vietnam',
    description: 'Lead development of AI-powered SaaS platform serving 50K+ users. Architected microservices, improved performance by 60%, and mentored a team of 5 junior developers.',
    tech: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
    color: '#7c3aed',
  },
  {
    type: 'work',
    role: 'Frontend Developer',
    company: 'DigitalCraft Studio',
    period: '2022 – 2023',
    location: 'Remote',
    description: 'Built pixel-perfect UIs for 15+ client projects. Specialized in 3D web experiences with Three.js and interactive animations with GSAP and Framer Motion.',
    tech: ['React', 'Three.js', 'GSAP', 'TypeScript', 'TailwindCSS'],
    color: '#06b6d4',
  },
  {
    type: 'work',
    role: 'Backend Developer',
    company: 'DataStream Inc.',
    period: '2021 – 2022',
    location: 'Hanoi, Vietnam',
    description: 'Developed RESTful APIs and GraphQL services for a real-time data analytics platform. Optimized MongoDB queries and implemented Redis caching layer.',
    tech: ['Node.js', 'Express', 'MongoDB', 'Redis', 'GraphQL'],
    color: '#8b5cf6',
  },
  {
    type: 'education',
    role: 'B.Sc. Computer Science',
    company: 'Vietnam National University',
    period: '2018 – 2022',
    location: 'Hanoi, Vietnam',
    description: 'Graduated with honors. Specialized in Software Engineering with thesis on "Real-time Distributed Systems using WebSockets and Event-Driven Architecture".',
    tech: ['Algorithms', 'Data Structures', 'Distributed Systems', 'ML'],
    color: '#22d3ee',
  },
]

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
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-12 bottom-0 w-px timeline-line" />
      )}

      {/* Icon */}
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
            : <FiBook size={16} style={{ color: item.color }} />
          }
        </motion.div>
      </div>

      {/* Content card */}
      <motion.div
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className="glass rounded-2xl p-6 flex-1 group"
      >
        {/* Type badge */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-inter text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30` }}>
            {isWork ? 'Work' : 'Education'}
          </span>
          <div className="flex items-center gap-1 text-slate-600 text-xs font-inter">
            <FiCalendar size={11} />
            <span>{item.period}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600 text-xs font-inter">
            <FiMapPin size={11} />
            <span>{item.location}</span>
          </div>
        </div>

        {/* Role & company */}
        <h3 className="font-grotesk font-semibold text-white text-lg mb-0.5">
          {item.role}
        </h3>
        <p className="font-inter font-medium text-sm mb-3"
          style={{ color: item.color }}>
          @ {item.company}
        </p>

        {/* Description */}
        <p className="font-inter text-slate-500 text-sm leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.tech.map(t => (
            <span key={t}
              className="font-inter text-xs px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }}>
              {t}
            </span>
          ))}
        </div>

        {/* Hover accent */}
        <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(180deg, transparent, ${item.color}, transparent)` }} />
      </motion.div>
    </motion.div>
  )
}

export default function Experience() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

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
            04 — Experience
          </p>
          <h2 className="font-grotesk font-bold text-4xl md:text-5xl mb-4">
            My <span className="gradient-text">Journey</span>
          </h2>
          <p className="font-inter text-slate-500 text-base max-w-xl">
            The path that shaped my skills and perspective as a developer.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl">
          {experiences.map((item, i) => (
            <TimelineItem
              key={i}
              item={item}
              index={i}
              isLast={i === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
