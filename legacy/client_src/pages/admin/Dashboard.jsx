import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { FiFolder, FiCode, FiBriefcase, FiMail, FiArrowRight } from 'react-icons/fi'

function StatCard({ icon: Icon, label, value, color, to }) {
  return (
    <Link to={to} className="glass rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-all group">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <FiArrowRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
      </div>
      <p className="text-3xl font-bold text-white mt-3">
        {value ?? <span className="w-8 h-7 bg-white/10 rounded animate-pulse inline-block" />}
      </p>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </Link>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: null, skills: null, experience: null, messages: null })

  useEffect(() => {
    Promise.allSettled([
      api.get('/api/projects'),
      api.get('/api/skills'),
      api.get('/api/experience'),
      api.get('/api/contact'),
    ]).then(([p, s, e, m]) => {
      setStats({
        projects: p.status === 'fulfilled' ? p.value.data.data.length : 0,
        skills: s.status === 'fulfilled' ? s.value.data.data.length : 0,
        experience:
          e.status === 'fulfilled'
            ? (e.value.data.data.experience?.length || 0) + (e.value.data.data.education?.length || 0)
            : 0,
        messages: m.status === 'fulfilled' ? m.value.data.count : 0,
      })
    })
  }, [])

  const cards = [
    { icon: FiFolder, label: 'Projects', value: stats.projects, color: 'bg-purple-600', to: '/admin/projects' },
    { icon: FiCode, label: 'Skills', value: stats.skills, color: 'bg-cyan-600', to: '/admin/skills' },
    { icon: FiBriefcase, label: 'Timeline Entries', value: stats.experience, color: 'bg-emerald-600', to: '/admin/experience' },
    { icon: FiMail, label: 'Messages', value: stats.messages, color: 'bg-amber-600', to: '/admin/messages' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Edit Profile', desc: 'Update name, bio, social links', to: '/admin/profile', color: 'from-purple-600/20 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40' },
            { label: 'Add Project', desc: 'Showcase a new project', to: '/admin/projects', color: 'from-cyan-600/20 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-500/40' },
            { label: 'Add Skill', desc: 'Add a skill or update level', to: '/admin/skills', color: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40' },
            { label: 'Add Experience', desc: 'Add work or education entry', to: '/admin/experience', color: 'from-amber-600/20 to-amber-600/5 border-amber-500/20 hover:border-amber-500/40' },
            { label: 'View Messages', desc: 'Read contact form submissions', to: '/admin/messages', color: 'from-pink-600/20 to-pink-600/5 border-pink-500/20 hover:border-pink-500/40' },
          ].map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className={`p-4 rounded-xl bg-gradient-to-br border transition-all ${a.color}`}
            >
              <p className="text-white font-semibold text-sm">{a.label}</p>
              <p className="text-gray-400 text-xs mt-1">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
