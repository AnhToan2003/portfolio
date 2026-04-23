import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss,
  SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiGraphql,
  SiDocker, SiGit, SiAmazonaws, SiFigma, SiThreedotjs, SiPython,
  SiRedux, SiVite
} from 'react-icons/si'

const categories = ['All', 'Frontend', 'Backend', 'Tools & DevOps']

const skills = [
  // Frontend
  { name: 'React', icon: SiReact, level: 92, color: '#61dafb', category: 'Frontend' },
  { name: 'Next.js', icon: SiNextdotjs, level: 85, color: '#ffffff', category: 'Frontend' },
  { name: 'TypeScript', icon: SiTypescript, level: 80, color: '#3178c6', category: 'Frontend' },
  { name: 'JavaScript', icon: SiJavascript, level: 95, color: '#f7df1e', category: 'Frontend' },
  { name: 'TailwindCSS', icon: SiTailwindcss, level: 90, color: '#38bdf8', category: 'Frontend' },
  { name: 'Three.js', icon: SiThreedotjs, level: 72, color: '#ffffff', category: 'Frontend' },
  { name: 'Redux', icon: SiRedux, level: 78, color: '#764abc', category: 'Frontend' },
  { name: 'Vite', icon: SiVite, level: 88, color: '#646cff', category: 'Frontend' },
  // Backend
  { name: 'Node.js', icon: SiNodedotjs, level: 88, color: '#339933', category: 'Backend' },
  { name: 'Express', icon: SiExpress, level: 85, color: '#ffffff', category: 'Backend' },
  { name: 'MongoDB', icon: SiMongodb, level: 82, color: '#47a248', category: 'Backend' },
  { name: 'PostgreSQL', icon: SiPostgresql, level: 75, color: '#336791', category: 'Backend' },
  { name: 'GraphQL', icon: SiGraphql, level: 68, color: '#e535ab', category: 'Backend' },
  { name: 'Python', icon: SiPython, level: 70, color: '#3776ab', category: 'Backend' },
  // Tools
  { name: 'Docker', icon: SiDocker, level: 72, color: '#2496ed', category: 'Tools & DevOps' },
  { name: 'Git', icon: SiGit, level: 90, color: '#f05032', category: 'Tools & DevOps' },
  { name: 'AWS', icon: SiAmazonaws, level: 65, color: '#ff9900', category: 'Tools & DevOps' },
  { name: 'Figma', icon: SiFigma, level: 78, color: '#f24e1e', category: 'Tools & DevOps' },
]

function SkillCard({ skill, index, inView }) {
  const Icon = skill.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ scale: 1.04, y: -4 }}
      className="glass rounded-2xl p-5 flex flex-col gap-4 group cursor-default"
    >
      {/* Icon + name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ background: `${skill.color}18` }}>
          <Icon size={20} style={{ color: skill.color }} />
        </div>
        <div>
          <div className="font-grotesk font-semibold text-slate-200 text-sm">{skill.name}</div>
          <div className="font-inter text-slate-600 text-xs">{skill.category}</div>
        </div>
        <span className="ml-auto font-grotesk font-bold text-sm gradient-text">{skill.level}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ delay: index * 0.06 + 0.3, duration: 1, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, #7c3aed, ${skill.color})` }}
        />
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory)

  return (
    <section id="skills" ref={sectionRef} className="relative py-28 overflow-hidden"
      style={{ background: '#080812' }}>
      {/* Glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-inter text-purple-400 text-sm font-medium tracking-widest uppercase mb-3">
            02 — Skills
          </p>
          <h2 className="font-grotesk font-bold text-4xl md:text-5xl mb-4">
            Tech <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="font-inter text-slate-500 text-base max-w-xl">
            A curated set of tools and technologies I use to build exceptional digital products.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-inter text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'text-white shadow-lg'
                  : 'glass text-slate-400 hover:text-slate-200'
              }`}
              style={activeCategory === cat
                ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }
                : {}
              }
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((skill, i) => (
              <SkillCard key={skill.name} skill={skill} index={i} inView={inView} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
