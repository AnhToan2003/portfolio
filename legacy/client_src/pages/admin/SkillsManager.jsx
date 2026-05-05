import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'

const CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'Design', 'Other']

const empty = { name: '', level: 80, category: 'Frontend' }

function SkillRow({ skill, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: skill.name, level: skill.level, category: skill.category })
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!form.name.trim()) { toast.error('Skill name required'); return }
    setSaving(true)
    try {
      const res = await api.put(`/api/skills/${skill._id}`, form)
      onSave(res.data.data)
      setEditing(false)
      toast.success('Skill updated')
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  function cancel() {
    setForm({ name: skill.name, level: skill.level, category: skill.category })
    setEditing(false)
  }

  const levelColor = form.level >= 80 ? 'bg-emerald-500' : form.level >= 60 ? 'bg-cyan-500' : 'bg-purple-500'

  if (editing) {
    return (
      <div className="glass rounded-xl p-4 border border-purple-500/30 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Name</label>
            <input
              className="input-field w-full text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="React"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Category</label>
            <select
              className="input-field w-full text-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Level: {form.level}%</label>
            <input
              type="range" min={0} max={100} value={form.level}
              onChange={(e) => setForm({ ...form, level: +e.target.value })}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition-all disabled:opacity-60">
            {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheck className="w-3.5 h-3.5" />}
            Save
          </button>
          <button onClick={cancel} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-all">
            <FiX className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white font-medium text-sm">{skill.name}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">{skill.category}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${levelColor}`} style={{ width: `${skill.level}%` }} />
          </div>
          <span className="text-xs text-gray-400 w-8 text-right">{skill.level}%</span>
        </div>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <button onClick={() => setEditing(true)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <FiEdit2 className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(skill._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function AddForm({ onAdd }) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Skill name required'); return }
    setSaving(true)
    try {
      const res = await api.post('/api/skills', form)
      onAdd(res.data.data)
      setForm(empty)
      toast.success('Skill added')
    } catch {
      toast.error('Failed to add skill')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-5 border border-white/5 space-y-4">
      <h3 className="text-white font-semibold text-sm">Add New Skill</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Name <span className="text-red-400">*</span></label>
          <input
            className="input-field w-full text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. React"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Category</label>
          <select className="input-field w-full text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Level: {form.level}%</label>
          <input type="range" min={0} max={100} value={form.level} onChange={(e) => setForm({ ...form, level: +e.target.value })} className="w-full accent-purple-500 mt-1" />
        </div>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
      >
        {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiPlus className="w-4 h-4" />}
        Add Skill
      </button>
    </form>
  )
}

export default function SkillsManager() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/skills')
      .then((res) => setSkills(res.data.data))
      .catch(() => toast.error('Failed to load skills'))
      .finally(() => setLoading(false))
  }, [])

  function handleAdd(skill) { setSkills((s) => [...s, skill]) }
  function handleSave(updated) { setSkills((s) => s.map((sk) => sk._id === updated._id ? updated : sk)) }

  async function handleDelete(id) {
    if (!confirm('Delete this skill?')) return
    try {
      await api.delete(`/api/skills/${id}`)
      setSkills((s) => s.filter((sk) => sk._id !== id))
      toast.success('Skill deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = skills.filter((s) => s.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <p className="text-gray-400 mt-1">Manage your technical skills and proficiency levels</p>
      </div>

      <AddForm onAdd={handleAdd} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No skills yet. Add your first skill above.</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">{cat}</h3>
              <div className="space-y-2">
                {items.map((skill) => (
                  <SkillRow key={skill._id} skill={skill} onSave={handleSave} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
