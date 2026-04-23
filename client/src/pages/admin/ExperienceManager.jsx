import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiBriefcase, FiBook } from 'react-icons/fi'

function EntryForm({ initial = {}, fields, onSave, onCancel, submitLabel }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)

  function set(f) { return (e) => setForm((prev) => ({ ...prev, [f]: e.target.value })) }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(({ name, label, placeholder, required }) => (
          <div key={name} className={name === 'description' ? 'sm:col-span-2' : ''}>
            <label className="text-xs text-gray-400 mb-1 block">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
            {name === 'description' ? (
              <textarea value={form[name] || ''} onChange={set(name)} className="input-field w-full text-sm resize-none" rows={2} placeholder={placeholder} />
            ) : (
              <input value={form[name] || ''} onChange={set(name)} className="input-field w-full text-sm" placeholder={placeholder} required={required} />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition-all disabled:opacity-60">
          {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheck className="w-3.5 h-3.5" />}
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-all">
          <FiX className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </form>
  )
}

function EntryCard({ entry, fields, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const primary = fields[0]
  const secondary = fields[1]

  async function handleSave(form) {
    try {
      await onSave(entry._id, form)
      setEditing(false)
      toast.success('Updated')
    } catch {
      toast.error('Update failed')
    }
  }

  if (editing) {
    return (
      <div className="glass rounded-xl p-4 border border-purple-500/30">
        <EntryForm initial={entry} fields={fields} onSave={handleSave} onCancel={() => setEditing(false)} submitLabel="Update" />
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all flex gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm">{entry[primary.name]}</p>
        <p className="text-purple-400 text-xs mt-0.5">{entry[secondary.name]}</p>
        {entry.period && <p className="text-gray-500 text-xs mt-0.5">{entry.period}</p>}
        {entry.location && <p className="text-gray-500 text-xs">{entry.location}</p>}
        {entry.description && <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{entry.description}</p>}
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <button onClick={() => setEditing(true)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <FiEdit2 className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(entry._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

const expFields = [
  { name: 'company', label: 'Company', placeholder: 'TechVision Labs', required: true },
  { name: 'role', label: 'Role', placeholder: 'Senior Developer', required: true },
  { name: 'period', label: 'Period', placeholder: '2023 – Present' },
  { name: 'location', label: 'Location', placeholder: 'Ho Chi Minh City' },
  { name: 'description', label: 'Description', placeholder: 'What did you accomplish here?' },
]

const eduFields = [
  { name: 'school', label: 'School / University', placeholder: 'Vietnam National University', required: true },
  { name: 'degree', label: 'Degree / Major', placeholder: 'B.Sc. Computer Science', required: true },
  { name: 'period', label: 'Period', placeholder: '2018 – 2022' },
  { name: 'description', label: 'Description', placeholder: 'Notable achievements or focus areas' },
]

export default function ExperienceManager() {
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingExp, setAddingExp] = useState(false)
  const [addingEdu, setAddingEdu] = useState(false)

  useEffect(() => {
    api.get('/api/experience')
      .then((res) => {
        setExperience(res.data.data.experience || [])
        setEducation(res.data.data.education || [])
      })
      .catch(() => toast.error('Failed to load entries'))
      .finally(() => setLoading(false))
  }, [])

  async function addExp(form) {
    try {
      const res = await api.post('/api/experience', form)
      setExperience((e) => [...e, res.data.data])
      setAddingExp(false)
      toast.success('Experience added')
    } catch { toast.error('Failed to add') }
  }

  async function addEdu(form) {
    try {
      const res = await api.post('/api/experience/education', form)
      setEducation((e) => [...e, res.data.data])
      setAddingEdu(false)
      toast.success('Education added')
    } catch { toast.error('Failed to add') }
  }

  async function saveExp(id, form) {
    const res = await api.put(`/api/experience/${id}`, form)
    setExperience((e) => e.map((x) => x._id === id ? res.data.data : x))
  }

  async function saveEdu(id, form) {
    const res = await api.put(`/api/experience/education/${id}`, form)
    setEducation((e) => e.map((x) => x._id === id ? res.data.data : x))
  }

  async function deleteExp(id) {
    if (!confirm('Delete this entry?')) return
    try {
      await api.delete(`/api/experience/${id}`)
      setExperience((e) => e.filter((x) => x._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  async function deleteEdu(id) {
    if (!confirm('Delete this entry?')) return
    try {
      await api.delete(`/api/experience/education/${id}`)
      setEducation((e) => e.filter((x) => x._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Experience & Education</h1>
        <p className="text-gray-400 mt-1">Manage your timeline entries</p>
      </div>

      {/* Work Experience */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <FiBriefcase className="w-4 h-4 text-purple-400" /> Work Experience
          </h2>
          <button onClick={() => setAddingExp(!addingExp)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-all border border-white/5">
            {addingExp ? <FiX className="w-3.5 h-3.5" /> : <FiPlus className="w-3.5 h-3.5" />}
            {addingExp ? 'Cancel' : 'Add'}
          </button>
        </div>

        {addingExp && (
          <div className="glass rounded-xl p-4 border border-purple-500/30">
            <EntryForm fields={expFields} initial={{}} onSave={addExp} onCancel={() => setAddingExp(false)} submitLabel="Add Experience" />
          </div>
        )}

        {experience.length === 0 && !addingExp ? (
          <p className="text-gray-600 text-sm text-center py-6">No experience entries yet.</p>
        ) : (
          <div className="space-y-2">
            {experience.map((e) => (
              <EntryCard key={e._id} entry={e} fields={expFields} onSave={saveExp} onDelete={deleteExp} />
            ))}
          </div>
        )}
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <FiBook className="w-4 h-4 text-cyan-400" /> Education
          </h2>
          <button onClick={() => setAddingEdu(!addingEdu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-all border border-white/5">
            {addingEdu ? <FiX className="w-3.5 h-3.5" /> : <FiPlus className="w-3.5 h-3.5" />}
            {addingEdu ? 'Cancel' : 'Add'}
          </button>
        </div>

        {addingEdu && (
          <div className="glass rounded-xl p-4 border border-cyan-500/30">
            <EntryForm fields={eduFields} initial={{}} onSave={addEdu} onCancel={() => setAddingEdu(false)} submitLabel="Add Education" />
          </div>
        )}

        {education.length === 0 && !addingEdu ? (
          <p className="text-gray-600 text-sm text-center py-6">No education entries yet.</p>
        ) : (
          <div className="space-y-2">
            {education.map((e) => (
              <EntryCard key={e._id} entry={e} fields={eduFields} onSave={saveEdu} onDelete={deleteEdu} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
