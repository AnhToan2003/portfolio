import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiX } from 'react-icons/fi'
import { useContent } from '../context/ContentContext'
import api from '../utils/api'

const COLORS = ['#7c3aed', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#22d3ee']

function ProjectCard({ project, index, onOpen }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef()
  const color = project.color || COLORS[index % COLORS.length]

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16
    setTilt({ x, y })
  }, [])

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
      className="glass rounded-2xl overflow-hidden group cursor-pointer transition-all duration-200"
    >
      <div className="relative h-48 overflow-hidden">
        {project.image ? (
          <img src={project.image} alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { e.target.style.display = 'none' }} />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }} />
        )}
        <div className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-80"
          style={{ background: `linear-gradient(to bottom, transparent 20%, ${color}66, #05050a)` }} />
        <div className="absolute top-3 left-3">
          <span className="font-inter text-xs px-3 py-1 rounded-full text-white font-medium"
            style={{ background: `${color}33`, border: `1px solid ${color}44` }}>
            {project.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          {project.github && (
            <motion.a href={project.github} target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.1 }} onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
              <FiGithub size={15} />
            </motion.a>
          )}
          {project.demo && (
            <motion.a href={project.demo} target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.1 }} onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
              <FiExternalLink size={15} />
            </motion.a>
          )}
        </div>
      </div>

      <div className="p-5" onClick={() => onOpen({ ...project, color })}>
        <h3 className="font-grotesk font-semibold text-white text-lg mb-2 group-hover:gradient-text transition-all">
          {project.title}
        </h3>
        <p className="font-inter text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(project.tech || []).map(t => (
            <span key={t} className="font-inter text-xs px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </motion.div>
  )
}

function ProjectModal({ project, onClose }) {
  if (!project) return null
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', bounce: 0.25 }}
        className="glass-strong rounded-3xl overflow-hidden max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 overflow-hidden">
          {project.image
            ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${project.color}33, ${project.color}55)` }} />
          }
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(5,5,10,0.9))' }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center text-slate-300 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>
        <div className="p-7">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-grotesk font-bold text-2xl text-white mb-1">{project.title}</h3>
              <span className="font-inter text-sm text-purple-400">{project.category}</span>
            </div>
          </div>
          <p className="font-inter text-slate-400 text-sm leading-relaxed mb-6">
            {project.longDescription || project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {(project.tech || []).map(t => <span key={t} className="tag-badge">{t}</span>)}
          </div>
          <div className="flex gap-3">
            {project.github && (
              <motion.a href={project.github} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full glass text-slate-300 hover:text-white font-inter text-sm font-medium transition-colors border border-white/10">
                <FiGithub size={15} /> Source Code
              </motion.a>
            )}
            {project.demo && (
              <motion.a href={project.demo} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-inter text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                <FiExternalLink size={15} /> Live Demo
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const { content } = useContent()
  const { projects: pc } = content

  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    api.get('/api/projects').then(res => {
      if (res.data?.data?.length) setProjects(res.data.data)
    }).catch(() => {})
  }, [])

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))]
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="relative py-28 overflow-hidden" style={{ background: '#05050a' }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(124,58,237,0.08), transparent)' }} />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-inter text-purple-400 text-sm font-medium tracking-widest uppercase mb-3">
            {pc.sectionLabel}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
            <h2 className="font-grotesk font-bold text-4xl md:text-5xl">
              {pc.heading} <span className="gradient-text">{pc.headingAccent}</span>
            </h2>
            <a href={pc.githubUrl} target="_blank" rel="noreferrer"
              className="font-inter text-sm text-slate-500 hover:text-purple-400 transition-colors flex items-center gap-1 mb-1">
              {pc.githubLabel} <FiExternalLink size={12} />
            </a>
          </div>
          <p className="font-inter text-slate-500 text-base max-w-xl">{pc.description}</p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2"
        >
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-inter text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                filter === cat ? 'text-white' : 'glass text-slate-400 hover:text-slate-200'
              }`}
              style={filter === cat ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' } : {}}>
              {cat}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project._id || i} project={project} index={i} onOpen={setSelectedProject} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
