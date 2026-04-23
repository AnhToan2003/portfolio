import { useState, useEffect } from 'react'
import { useContent } from '../../context/ContentContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiSave, FiRefreshCw } from 'react-icons/fi'

function Section({ title, children }) {
  return (
    <div className="bg-dark-800 rounded-2xl p-6 border border-white/5">
      <h3 className="text-white font-semibold text-base mb-5">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', rows }) {
  const baseClass = 'w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors'
  return (
    <div>
      <label className="block text-slate-500 text-xs mb-1.5">{label}</label>
      {rows ? (
        <textarea name={name} value={value} onChange={onChange} rows={rows} className={baseClass} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} className={baseClass} />
      )}
    </div>
  )
}

export default function ContentManager() {
  const { content, setContent } = useContent()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(JSON.parse(JSON.stringify(content)))
  }, [content])

  function handleChange(section, field, value) {
    setForm(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  function handleArrayChange(section, field, index, value) {
    setForm(prev => {
      const arr = [...(prev[section][field] || [])]
      arr[index] = value
      return { ...prev, [section]: { ...prev[section], [field]: arr } }
    })
  }

  function handleStatChange(index, key, value) {
    setForm(prev => {
      const stats = [...(prev.about.stats || [])]
      stats[index] = { ...stats[index], [key]: value }
      return { ...prev, about: { ...prev.about, stats } }
    })
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await api.put('/api/content', form)
      if (res.data?.data) {
        setContent(res.data.data)
        setForm(JSON.parse(JSON.stringify(res.data.data)))
      }
      toast.success('Content saved successfully')
    } catch {
      toast.error('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setForm(JSON.parse(JSON.stringify(content)))
    toast('Reset to last saved state', { icon: '↩️' })
  }

  if (!form) return <div className="text-slate-500 text-sm p-8">Loading…</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-2xl">Content Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Edit all site content — changes are saved to the database.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all">
            <FiRefreshCw size={14} /> Reset
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <FiSave size={14} />
            {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Hero */}
      <Section title="Hero Section">
        <Field label="Badge text" name="badge" value={form.hero.badge} onChange={e => handleChange('hero', 'badge', e.target.value)} />
        <Field label="Greeting" name="greeting" value={form.hero.greeting} onChange={e => handleChange('hero', 'greeting', e.target.value)} />
        <Field label="Name" name="name" value={form.hero.name} onChange={e => handleChange('hero', 'name', e.target.value)} />
        <Field label="Description" name="description" value={form.hero.description} onChange={e => handleChange('hero', 'description', e.target.value)} rows={3} />
        <Field label="Primary CTA" name="primary" value={form.hero.cta?.primary || ''} onChange={e => handleChange('hero', 'cta', { ...form.hero.cta, primary: e.target.value })} />
        <Field label="Secondary CTA" name="secondary" value={form.hero.cta?.secondary || ''} onChange={e => handleChange('hero', 'cta', { ...form.hero.cta, secondary: e.target.value })} />
        <div>
          <label className="block text-slate-500 text-xs mb-1.5">Typing words (one per line)</label>
          <textarea
            rows={4}
            value={(form.hero.typingWords || []).join('\n')}
            onChange={e => handleChange('hero', 'typingWords', e.target.value.split('\n').filter(Boolean))}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </Section>

      {/* About */}
      <Section title="About Section">
        <Field label="Section label" name="sectionLabel" value={form.about.sectionLabel} onChange={e => handleChange('about', 'sectionLabel', e.target.value)} />
        <Field label="Heading" name="heading" value={form.about.heading} onChange={e => handleChange('about', 'heading', e.target.value)} />
        <Field label="Heading accent" name="headingAccent" value={form.about.headingAccent} onChange={e => handleChange('about', 'headingAccent', e.target.value)} />
        <div>
          <label className="block text-slate-500 text-xs mb-1.5">Paragraphs (one per line)</label>
          <textarea
            rows={5}
            value={(form.about.paragraphs || []).join('\n')}
            onChange={e => handleChange('about', 'paragraphs', e.target.value.split('\n').filter(Boolean))}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-slate-500 text-xs mb-2">Stats</label>
          <div className="grid grid-cols-2 gap-3">
            {(form.about.stats || []).map((stat, i) => (
              <div key={i} className="flex gap-2">
                <input value={stat.value} onChange={e => handleStatChange(i, 'value', e.target.value)}
                  placeholder="Value" className="w-1/3 bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50" />
                <input value={stat.label} onChange={e => handleStatChange(i, 'label', e.target.value)}
                  placeholder="Label" className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-slate-500 text-xs mb-1.5">Tech badges (comma-separated)</label>
          <input value={(form.about.techBadges || []).join(', ')}
            onChange={e => handleChange('about', 'techBadges', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <Field label="Resume link" name="resumeLink" value={form.about.resumeLink || ''} onChange={e => handleChange('about', 'resumeLink', e.target.value)} />
        <Field label="Resume button label" name="resumeLabel" value={form.about.resumeLabel || ''} onChange={e => handleChange('about', 'resumeLabel', e.target.value)} />
      </Section>

      {/* Contact */}
      <Section title="Contact Info">
        <Field label="Email" name="email" type="email" value={form.contact.email} onChange={e => handleChange('contact', 'email', e.target.value)} />
        <Field label="Location" name="location" value={form.contact.location} onChange={e => handleChange('contact', 'location', e.target.value)} />
        <Field label="Phone" name="phone" value={form.contact.phone} onChange={e => handleChange('contact', 'phone', e.target.value)} />
      </Section>

      {/* Social */}
      <Section title="Social Links">
        <Field label="GitHub URL" name="github" value={form.social.github} onChange={e => handleChange('social', 'github', e.target.value)} />
        <Field label="LinkedIn URL" name="linkedin" value={form.social.linkedin} onChange={e => handleChange('social', 'linkedin', e.target.value)} />
        <Field label="Twitter URL" name="twitter" value={form.social.twitter} onChange={e => handleChange('social', 'twitter', e.target.value)} />
      </Section>

      {/* Footer */}
      <Section title="Footer">
        <Field label="Tagline" name="tagline" value={form.footer.tagline} onChange={e => handleChange('footer', 'tagline', e.target.value)} />
        <Field label="Copyright name" name="copyright" value={form.footer.copyright} onChange={e => handleChange('footer', 'copyright', e.target.value)} />
        <Field label="Location" name="location" value={form.footer.location} onChange={e => handleChange('footer', 'location', e.target.value)} />
        <Field label="Tech stack text" name="techStack" value={form.footer.techStack} onChange={e => handleChange('footer', 'techStack', e.target.value)} />
      </Section>
    </div>
  )
}
