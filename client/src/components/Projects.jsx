import { useRef, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiX } from 'react-icons/fi'

const projects = [
  {
    id: 1,
    title: 'NeuroChat AI',
    description: 'Real-time AI chat platform with GPT-4 integration, streaming responses, conversation history, and multi-model support.',
    longDescription: 'A full-stack AI chat application featuring real-time streaming, persistent conversation history stored in MongoDB, user authentication with JWT, and support for multiple AI models. Built with React, Node.js, Socket.io, and OpenAI API.',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&auto=format&fit=crop&q=60',
    tech: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'OpenAI'],
    github: 'https://github.com',
    demo: 'https://example.com',
    category: 'AI / Full Stack',
    featured: true,
    color: '#7c3aed',
  },
  {
    id: 2,
    title: '3D Portfolio Studio',
    description: 'Interactive 3D portfolio builder with drag-and-drop editor, real-time preview, and one-click deployment.',
    longDescription: 'A creative tool that allows users to build stunning 3D portfolio websites without coding. Features include a drag-and-drop interface, real-time 3D preview powered by Three.js, template library, and Vercel deployment integration.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60',
    tech: ['React', 'Three.js', 'WebGL', 'Node.js', 'PostgreSQL'],
    github: 'https://github.com',
    demo: 'https://example.com',
    category: '3D / Creative',
    featured: true,
    color: '#06b6d4',
  },
  {
    id: 3,
    title: 'TaskFlow Pro',
    description: 'Kanban-style project management tool with real-time collaboration, AI task prioritization, and analytics dashboard.',
    longDescription: 'A full-featured project management platform inspired by Trello and Linear. Features real-time collaboration via WebSockets, AI-powered task prioritization, burndown charts, and Slack/GitHub integrations.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&auto=format&fit=crop&q=60',
    tech: ['Next.js', 'TypeScript', 'MongoDB', 'Redis', 'AWS'],
    github: 'https://github.com',
    demo: 'https://example.com',
    category: 'SaaS / Productivity',
    featured: true,
    color: '#8b5cf6',
  },
  {
    id: 4,
    title: 'CryptoVault',
    description: 'Decentralized portfolio tracker with real-time price alerts, DeFi protocol support, and multi-wallet management.',
    longDescription: 'A comprehensive crypto portfolio tracker supporting 500+ tokens across 20+ blockchain networks. Features real-time price feeds via WebSocket, DeFi yield calculations, tax reporting, and hardware wallet integration.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=60',
    tech: ['React', 'Node.js', 'Web3.js', 'MongoDB', 'GraphQL'],
    github: 'https://github.com',
    demo: 'https://example.com',
    category: 'Web3 / Finance',
    featured: false,
    color: '#f59e0b',
  },
  {
    id: 5,
    title: 'SnapCommerce',
    description: 'AI-powered e-commerce platform with visual search, personalized recommendations, and AR try-on feature.',
    longDescription: 'Modern e-commerce solution featuring computer vision-based visual product search, personalized AI recommendations, WebAR try-on experience, and comprehensive admin dashboard with analytics.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=60',
    tech: ['Next.js', 'Python', 'TensorFlow', 'MongoDB', 'Stripe'],
    github: 'https://github.com',
    demo: 'https://example.com',
    category: 'E-Commerce / AI',
    featured: false,
    color: '#ec4899',
  },
  {
    id: 6,
    title: 'DevMetrics',
    description: 'Developer analytics platform that tracks coding habits, visualizes git activity, and provides productivity insights.',
    longDescription: 'A comprehensive developer productivity tracker that integrates with GitHub, GitLab, and Jira. Provides beautiful data visualizations of coding patterns, commit history, PR review times, and team productivity metrics.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60',
    tech: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'Docker'],
    github: 'https://github.com',
    demo: 'https://example.com',
    category: 'Analytics / DevTools',
    featured: false,
    color: '#22d3ee',
  },
]

function ProjectCard({ project, index, onOpen }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef()

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
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-80"
          style={{ background: `linear-gradient(to bottom, transparent 20%, ${project.color}66, #05050a)` }} />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="font-inter text-xs px-3 py-1 rounded-full text-white font-medium"
            style={{ background: `${project.color}33`, border: `1px solid ${project.color}44` }}>
            {project.category}
          </span>
        </div>

        {/* Quick links */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <motion.a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          >
            <FiGithub size={15} />
          </motion.a>
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          >
            <FiExternalLink size={15} />
          </motion.a>
        </div>
      </div>

      {/* Content */}
      <div className="p-5" onClick={() => onOpen(project)}>
        <h3 className="font-grotesk font-semibold text-white text-lg mb-2 group-hover:gradient-text transition-all">
          {project.title}
        </h3>
        <p className="font-inter text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map(t => (
            <span key={t} className="font-inter text-xs px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }} />
    </motion.div>
  )
}

function ProjectModal({ project, onClose }) {
  if (!project) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.25 }}
        className="glass-strong rounded-3xl overflow-hidden max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 overflow-hidden">
          <img src={project.image} alt={project.title}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(5,5,10,0.9))' }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
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
          <p className="font-inter text-slate-400 text-sm leading-relaxed mb-6">{project.longDescription}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map(t => (
              <span key={t} className="tag-badge">{t}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <motion.a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass text-slate-300 hover:text-white font-inter text-sm font-medium transition-colors border border-white/10"
            >
              <FiGithub size={15} /> Source Code
            </motion.a>
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-inter text-sm font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              <FiExternalLink size={15} /> Live Demo
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [filter, setFilter] = useState('All')
  const sectionRef = useRef()

  const categories = ['All', 'AI / Full Stack', '3D / Creative', 'SaaS / Productivity', 'Web3 / Finance']
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" ref={sectionRef} className="relative py-28 overflow-hidden"
      style={{ background: '#05050a' }}>
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
            03 — Projects
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
            <h2 className="font-grotesk font-bold text-4xl md:text-5xl">
              Featured <span className="gradient-text">Work</span>
            </h2>
            <a href="https://github.com" target="_blank" rel="noreferrer"
              className="font-inter text-sm text-slate-500 hover:text-purple-400 transition-colors flex items-center gap-1 mb-1">
              View all on GitHub <FiExternalLink size={12} />
            </a>
          </div>
          <p className="font-inter text-slate-500 text-base max-w-xl">
            A selection of projects that showcase my skills across different domains.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-inter text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                filter === cat
                  ? 'text-white'
                  : 'glass text-slate-400 hover:text-slate-200'
              }`}
              style={filter === cat ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' } : {}}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onOpen={setSelectedProject} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
