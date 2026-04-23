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
  const base = 'w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors'
  return (
    <div>
      <label className="block text-slate-500 text-xs mb-1.5">{label}</label>
      {rows
        ? <textarea name={name} value={value} onChange={onChange} rows={rows} className={base} />
        : <input type={type} name={name} value={value} onChange={onChange} className={base} />
      }
    </div>
  )
}

export default function ContentManager() {
  const { content, setContent } = useContent()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm(JSON.parse(JSON.stringify(content))) }, [content])

  function set(section, field, value) {
    setForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  function setNested(section, parent, field, value) {
    setForm(prev => ({
      ...prev,
      [section]: { ...prev[section], [parent]: { ...prev[section][parent], [field]: value } },
    }))
  }

  function setStat(index, key, value) {
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
          <p className="text-slate-500 text-sm mt-1">Edit all site text — saved to database instantly.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all">
            <FiRefreshCw size={14} /> Reset
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <FiSave size={14} />{saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Navbar */}
      <Section title="Navbar">
        <Field label="Brand name" value={form.navbar?.brand || ''} onChange={e => set('navbar', 'brand', e.target.value)} />
        <Field label="CTA button text" value={form.navbar?.cta || ''} onChange={e => set('navbar', 'cta', e.target.value)} />
        <div>
          <label className="block text-slate-500 text-xs mb-1.5">Nav links (one per line)</label>
          <textarea rows={5}
            value={(form.navbar?.links || []).join('\n')}
            onChange={e => set('navbar', 'links', e.target.value.split('\n').filter(Boolean))}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
      </Section>

      {/* Hero */}
      <Section title="Hero Section">
        <Field label="Badge text" value={form.hero.badge} onChange={e => set('hero', 'badge', e.target.value)} />
        <Field label="Greeting" value={form.hero.greeting} onChange={e => set('hero', 'greeting', e.target.value)} />
        <Field label="Name" value={form.hero.name} onChange={e => set('hero', 'name', e.target.value)} />
        <Field label="Description" value={form.hero.description} onChange={e => set('hero', 'description', e.target.value)} rows={3} />
        <Field label="Primary CTA" value={form.hero.cta?.primary || ''} onChange={e => setNested('hero', 'cta', 'primary', e.target.value)} />
        <Field label="Secondary CTA" value={form.hero.cta?.secondary || ''} onChange={e => setNested('hero', 'cta', 'secondary', e.target.value)} />
        <div>
          <label className="block text-slate-500 text-xs mb-1.5">Typing words (one per line)</label>
          <textarea rows={4}
            value={(form.hero.typingWords || []).join('\n')}
            onChange={e => set('hero', 'typingWords', e.target.value.split('\n').filter(Boolean))}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
      </Section>

      {/* About */}
      <Section title="About Section">
        <Field label="Section label" value={form.about.sectionLabel} onChange={e => set('about', 'sectionLabel', e.target.value)} />
        <Field label="Heading" value={form.about.heading} onChange={e => set('about', 'heading', e.target.value)} />
        <Field label="Heading accent" value={form.about.headingAccent} onChange={e => set('about', 'headingAccent', e.target.value)} />
        <div>
          <label className="block text-slate-500 text-xs mb-1.5">Paragraphs (one per line)</label>
          <textarea rows={5}
            value={(form.about.paragraphs || []).join('\n')}
            onChange={e => set('about', 'paragraphs', e.target.value.split('\n').filter(Boolean))}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <div>
          <label className="block text-slate-500 text-xs mb-2">Stats</label>
          <div className="grid grid-cols-2 gap-3">
            {(form.about.stats || []).map((stat, i) => (
              <div key={i} className="flex gap-2">
                <input value={stat.value} onChange={e => setStat(i, 'value', e.target.value)}
                  placeholder="Value" className="w-1/3 bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50" />
                <input value={stat.label} onChange={e => setStat(i, 'label', e.target.value)}
                  placeholder="Label" className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-slate-500 text-xs mb-1.5">Tech badges (comma-separated)</label>
          <input value={(form.about.techBadges || []).join(', ')}
            onChange={e => set('about', 'techBadges', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <Field label="Resume link" value={form.about.resumeLink || ''} onChange={e => set('about', 'resumeLink', e.target.value)} />
        <Field label="Resume button label" value={form.about.resumeLabel || ''} onChange={e => set('about', 'resumeLabel', e.target.value)} />
      </Section>

      {/* Skills */}
      <Section title="Skills Section">
        <Field label="Section label" value={form.skills?.sectionLabel || ''} onChange={e => set('skills', 'sectionLabel', e.target.value)} />
        <Field label="Heading" value={form.skills?.heading || ''} onChange={e => set('skills', 'heading', e.target.value)} />
        <Field label="Heading accent" value={form.skills?.headingAccent || ''} onChange={e => set('skills', 'headingAccent', e.target.value)} />
        <Field label="Description" value={form.skills?.description || ''} onChange={e => set('skills', 'description', e.target.value)} rows={2} />
        <div>
          <label className="block text-slate-500 text-xs mb-1.5">Filter categories (one per line)</label>
          <textarea rows={4}
            value={(form.skills?.categories || []).join('\n')}
            onChange={e => set('skills', 'categories', e.target.value.split('\n').filter(Boolean))}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors" />
          <p className="text-slate-600 text-xs mt-1">To manage individual skills, go to the Skills page.</p>
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects Section">
        <Field label="Section label" value={form.projects?.sectionLabel || ''} onChange={e => set('projects', 'sectionLabel', e.target.value)} />
        <Field label="Heading" value={form.projects?.heading || ''} onChange={e => set('projects', 'heading', e.target.value)} />
        <Field label="Heading accent" value={form.projects?.headingAccent || ''} onChange={e => set('projects', 'headingAccent', e.target.value)} />
        <Field label="Description" value={form.projects?.description || ''} onChange={e => set('projects', 'description', e.target.value)} rows={2} />
        <Field label="GitHub URL" value={form.projects?.githubUrl || ''} onChange={e => set('projects', 'githubUrl', e.target.value)} />
        <Field label="GitHub link label" value={form.projects?.githubLabel || ''} onChange={e => set('projects', 'githubLabel', e.target.value)} />
        <p className="text-slate-600 text-xs">To manage individual projects, go to the Projects page.</p>
      </Section>

      {/* Experience */}
      <Section title="Experience Section">
        <Field label="Section label" value={form.experience?.sectionLabel || ''} onChange={e => set('experience', 'sectionLabel', e.target.value)} />
        <Field label="Heading" value={form.experience?.heading || ''} onChange={e => set('experience', 'heading', e.target.value)} />
        <Field label="Heading accent" value={form.experience?.headingAccent || ''} onChange={e => set('experience', 'headingAccent', e.target.value)} />
        <Field label="Description" value={form.experience?.description || ''} onChange={e => set('experience', 'description', e.target.value)} rows={2} />
        <p className="text-slate-600 text-xs">To manage individual entries, go to the Experience page.</p>
      </Section>

      {/* Contact */}
      <Section title="Contact Section">
        <Field label="Section label" value={form.contact.sectionLabel || ''} onChange={e => set('contact', 'sectionLabel', e.target.value)} />
        <Field label="Heading" value={form.contact.heading || ''} onChange={e => set('contact', 'heading', e.target.value)} />
        <Field label="Heading accent" value={form.contact.headingAccent || ''} onChange={e => set('contact', 'headingAccent', e.target.value)} />
        <Field label="Email" type="email" value={form.contact.email} onChange={e => set('contact', 'email', e.target.value)} />
        <Field label="Location" value={form.contact.location} onChange={e => set('contact', 'location', e.target.value)} />
        <Field label="Phone" value={form.contact.phone} onChange={e => set('contact', 'phone', e.target.value)} />
      </Section>

      {/* Social */}
      <Section title="Social Links">
        <Field label="GitHub URL" value={form.social.github} onChange={e => set('social', 'github', e.target.value)} />
        <Field label="LinkedIn URL" value={form.social.linkedin} onChange={e => set('social', 'linkedin', e.target.value)} />
        <Field label="Twitter URL" value={form.social.twitter} onChange={e => set('social', 'twitter', e.target.value)} />
      </Section>

      {/* Footer */}
      <Section title="Footer">
        <Field label="Tagline" value={form.footer.tagline} onChange={e => set('footer', 'tagline', e.target.value)} />
        <Field label="Copyright name" value={form.footer.copyright} onChange={e => set('footer', 'copyright', e.target.value)} />
        <Field label="Location" value={form.footer.location} onChange={e => set('footer', 'location', e.target.value)} />
        <Field label="Tech stack text" value={form.footer.techStack} onChange={e => set('footer', 'techStack', e.target.value)} />
      </Section>
    </div>
  )
}
