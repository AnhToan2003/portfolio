import { useEffect, useState, useRef } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiUpload, FiGithub, FiExternalLink, FiStar, FiFolder } from 'react-icons/fi'

const BASE = import.meta.env.VITE_API_URL || ''
const CATEGORIES = ['Full Stack', 'Frontend', 'Backend', 'Mobile', 'AI/ML', 'DevOps', 'Other']

const emptyForm = { title: '', description: '', tech: '', github: '', demo: '', category: 'Full Stack', featured: false, image: '' }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  )
}

function ProjectForm({ initial = emptyForm, onSubmit, onClose, submitLabel = 'Save' }) {
  const [form, setForm] = useState({ ...initial, tech: Array.isArray(initial.tech) ? initial.tech.join(', ') : initial.tech })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  function set(field) { return (e) => setForm((f) => ({ ...f, [field]: e.target.value })) }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const data = new FormData()
    data.append('image', file)
    setUploading(true)
    try {
      const res = await api.post('/api/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      setForm((f) => ({ ...f, image: res.data.url }))
      toast.success('Image uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      const payload = { ...form, tech: form.tech.split(',').map((t) => t.trim()).filter(Boolean) }
      await onSubmit(payload)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">Project Image</label>
        <div className="flex items-start gap-4">
          {form.image ? (
            <img
              src={form.image.startsWith('http') ? form.image : `${BASE}${form.image}`}
              alt="preview"
              className="w-24 h-16 rounded-lg object-cover border border-white/10"
            />
          ) : (
            <div className="w-24 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 text-xs">No image</div>
          )}
          <div className="flex-1 space-y-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 transition-all disabled:opacity-60">
              {uploading ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiUpload className="w-3.5 h-3.5" />}
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
            <input type="text" value={form.image} onChange={set('image')} className="input-field w-full text-sm" placeholder="Or paste image URL" />
          </div>
        </div>
      </div>

      {/* Title + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Title <span className="text-red-400">*</span></label>
          <input value={form.title} onChange={set('title')} className="input-field w-full" placeholder="My Awesome Project" required />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Category</label>
          <select value={form.category} onChange={set('category')} className="input-field w-full">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm text-gray-400 mb-1 block">Description</label>
        <textarea value={form.description} onChange={set('description')} rows={3} className="input-field w-full resize-none" placeholder="What does this project do?" />
      </div>

      {/* Tech */}
      <div>
        <label className="text-sm text-gray-400 mb-1 block">Technologies <span className="text-gray-600 text-xs">(comma-separated)</span></label>
        <input value={form.tech} onChange={set('tech')} className="input-field w-full" placeholder="React, Node.js, MongoDB" />
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-1.5"><FiGithub className="w-3.5 h-3.5" /> GitHub URL</label>
          <input type="url" value={form.github} onChange={set('github')} className="input-field w-full" placeholder="https://github.com/…" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-1.5"><FiExternalLink className="w-3.5 h-3.5" /> Live Demo URL</label>
          <input type="url" value={form.demo} onChange={set('demo')} className="input-field w-full" placeholder="https://myproject.com" />
        </div>
      </div>

      {/* Featured */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className={`w-10 h-5 rounded-full transition-colors relative ${form.featured ? 'bg-purple-600' : 'bg-white/10'}`}
          onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-sm text-gray-300 flex items-center gap-1.5">
          <FiStar className="w-3.5 h-3.5 text-amber-400" /> Featured project
        </span>
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
          {saving ? 'Saving…' : submitLabel}
        </button>
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition-all">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    api.get('/api/projects')
      .then((res) => setProjects(res.data.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(payload) {
    const res = await api.post('/api/projects', payload)
    setProjects((p) => [res.data.data, ...p])
    toast.success('Project added!')
  }

  async function handleEdit(payload) {
    const res = await api.put(`/api/projects/${editing._id}`, payload)
    setProjects((p) => p.map((pr) => pr._id === editing._id ? res.data.data : pr))
    toast.success('Project updated!')
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/api/projects/${id}`)
      setProjects((p) => p.filter((pr) => pr._id !== id))
      toast.success('Project deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-all">
          <FiPlus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl border border-white/5">
          <p className="text-gray-500">No projects yet.</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-purple-400 hover:text-purple-300 text-sm">Add your first project →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="glass rounded-2xl border border-white/5 hover:border-white/10 transition-all overflow-hidden flex flex-col">
              {/* Image */}
              <div className="h-40 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 relative overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image.startsWith('http') ? project.image : `${BASE}${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700">
                    <FiFolder className="w-8 h-8" />
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs">
                    <FiStar className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm leading-tight">{project.title}</h3>
                  <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-white/5 flex-shrink-0">{project.category}</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">{project.description}</p>

                {/* Tech tags */}
                {project.tech?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tech.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-purple-600/15 text-purple-300 border border-purple-500/20">{t}</span>
                    ))}
                    {project.tech.length > 4 && <span className="text-xs text-gray-600">+{project.tech.length - 4}</span>}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                  <button onClick={() => setEditing(project)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 text-xs transition-all flex-1 justify-center">
                    <FiEdit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(project._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-xs transition-all flex-1 justify-center">
                    <FiTrash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Add New Project" onClose={() => setShowAdd(false)}>
          <ProjectForm onSubmit={handleAdd} onClose={() => setShowAdd(false)} submitLabel="Add Project" />
        </Modal>
      )}

      {/* Edit Modal */}
      {editing && (
        <Modal title="Edit Project" onClose={() => setEditing(null)}>
          <ProjectForm initial={editing} onSubmit={handleEdit} onClose={() => setEditing(null)} submitLabel="Update Project" />
        </Modal>
      )}
    </div>
  )
}
