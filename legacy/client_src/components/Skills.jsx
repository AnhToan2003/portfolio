import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss,
  SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiGraphql,
  SiDocker, SiGit, SiAmazonaws, SiFigma, SiThreedotjs, SiPython,
  SiRedux, SiVite, SiVuedotjs, SiAngular, SiNuxtdotjs, SiNestjs,
  SiMysql, SiFirebase, SiKubernetes, SiJenkins, SiNginx, SiLinux,
} from 'react-icons/si'
import { FiCode } from 'react-icons/fi'
import { useContent } from '../context/ContentContext'
import api from '../utils/api'

// Presentation-layer only: icon + color per skill name
const SKILL_META = {
  'React': { icon: SiReact, color: '#61dafb' },
  'Next.js': { icon: SiNextdotjs, color: '#ffffff' },
  'TypeScript': { icon: SiTypescript, color: '#3178c6' },
  'JavaScript': { icon: SiJavascript, color: '#f7df1e' },
  'TailwindCSS': { icon: SiTailwindcss, color: '#38bdf8' },
  'Three.js': { icon: SiThreedotjs, color: '#ffffff' },
  'Redux': { icon: SiRedux, color: '#764abc' },
  'Vite': { icon: SiVite, color: '#646cff' },
  'Vue.js': { icon: SiVuedotjs, color: '#42b883' },
  'Angular': { icon: SiAngular, color: '#dd0031' },
  'Nuxt.js': { icon: SiNuxtdotjs, color: '#00c58e' },
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
  'Express': { icon: SiExpress, color: '#ffffff' },
  'NestJS': { icon: SiNestjs, color: '#e0234e' },
  'MongoDB': { icon: SiMongodb, color: '#47a248' },
  'PostgreSQL': { icon: SiPostgresql, color: '#336791' },
  'MySQL': { icon: SiMysql, color: '#4479a1' },
  'GraphQL': { icon: SiGraphql, color: '#e535ab' },
  'Firebase': { icon: SiFirebase, color: '#ffca28' },
  'Python': { icon: SiPython, color: '#3776ab' },
  'Docker': { icon: SiDocker, color: '#2496ed' },
  'Git': { icon: SiGit, color: '#f05032' },
  'AWS': { icon: SiAmazonaws, color: '#ff9900' },
  'Figma': { icon: SiFigma, color: '#f24e1e' },
  'Kubernetes': { icon: SiKubernetes, color: '#326ce5' },
  'Jenkins': { icon: SiJenkins, color: '#d24939' },
  'Nginx': { icon: SiNginx, color: '#009639' },
  'Linux': { icon: SiLinux, color: '#fcc624' },
}

function SkillCard({ skill, index, inView }) {
  const meta = SKILL_META[skill.name] || { icon: FiCode, color: '#7c3aed' }
  const Icon = meta.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ scale: 1.04, y: -4 }}
      className="glass rounded-2xl p-5 flex flex-col gap-4 group cursor-default"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ background: `${meta.color}18` }}>
          <Icon size={20} style={{ color: meta.color }} />
        </div>
        <div>
          <div className="font-grotesk font-semibold text-slate-200 text-sm">{skill.name}</div>
          <div className="font-inter text-slate-600 text-xs">{skill.category}</div>
        </div>
        <span className="ml-auto font-grotesk font-bold text-sm gradient-text">{skill.level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ delay: index * 0.06 + 0.3, duration: 1, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, #7c3aed, ${meta.color})` }}
        />
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const { content } = useContent()
  const { skills: sc } = content

  const [skills, setSkills] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    api.get('/api/skills').then(res => {
      if (res.data?.data?.length) setSkills(res.data.data)
    }).catch(() => {})
  }, [])

  const categories = sc.categories || ['All', 'Frontend', 'Backend', 'Tools & DevOps']
  const filtered = activeCategory === 'All' ? skills : skills.filter(s => s.category === activeCategory)

  return (
    <section id="skills" ref={sectionRef} className="relative py-28 overflow-hidden"
      style={{ background: '#080812' }}>
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-inter text-purple-400 text-sm font-medium tracking-widest uppercase mb-3">
            {sc.sectionLabel}
          </p>
          <h2 className="font-grotesk font-bold text-4xl md:text-5xl mb-4">
            {sc.heading} <span className="gradient-text">{sc.headingAccent}</span>
          </h2>
          <p className="font-inter text-slate-500 text-base max-w-xl">{sc.description}</p>
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
                activeCategory === cat ? 'text-white shadow-lg' : 'glass text-slate-400 hover:text-slate-200'
              }`}
              style={activeCategory === cat ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' } : {}}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

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
              <SkillCard key={skill._id || skill.name} skill={skill} index={i} inView={inView} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
