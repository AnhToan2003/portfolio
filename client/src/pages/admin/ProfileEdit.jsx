import { useEffect, useState, useRef } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiSave, FiUpload, FiUser, FiGithub, FiLinkedin, FiMail, FiTwitter, FiLink } from 'react-icons/fi'

const BASE = import.meta.env.VITE_API_URL || ''

export default function ProfileEdit() {
  const [form, setForm] = useState({
    name: '', title: '', bio: '', email: '',
    github: '', linkedin: '', twitter: '', resume: '', avatar: '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileRef = useRef()

  useEffect(() => {
    api.get('/api/profile').then((res) => {
      const d = res.data.data
      setForm({
        name: d.name || '', title: d.title || '', bio: d.bio || '',
        email: d.email || '', github: d.github || '', linkedin: d.linkedin || '',
        twitter: d.twitter || '', resume: d.resume || '', avatar: d.avatar || '',
      })
    }).catch(() => toast.error('Failed to load profile')).finally(() => setLoading(false))
  }, [])

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const data = new FormData()
    data.append('image', file)
    setUploading(true)
    try {
      const res = await api.post('/api/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      setForm((f) => ({ ...f, avatar: res.data.url }))
      toast.success('Image uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      await api.put('/api/profile', form)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Edit your public profile information</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar */}
        <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <FiUser className="w-4 h-4 text-purple-400" /> Profile Photo
          </h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              {form.avatar ? (
                <img
                  src={form.avatar.startsWith('http') ? form.avatar : `${BASE}${form.avatar}`}
                  alt="avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-purple-600/20 border-2 border-purple-500/20 flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-purple-400" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 transition-all disabled:opacity-60"
              >
                {uploading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiUpload className="w-4 h-4" />
                )}
                {uploading ? 'Uploading…' : 'Upload Photo'}
              </button>
              <p className="text-gray-500 text-xs">JPG, PNG, WebP · max 5MB</p>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Or paste image URL</label>
            <input type="text" value={form.avatar} onChange={set('avatar')} className="input-field w-full" placeholder="https://example.com/photo.jpg" />
          </div>
        </div>

        {/* Basic info */}
        <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
          <h2 className="text-white font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name <span className="text-red-400">*</span></label>
              <input type="text" value={form.name} onChange={set('name')} className="input-field w-full" placeholder="Nguyen Anh Toan" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title / Role</label>
              <input type="text" value={form.title} onChange={set('title')} className="input-field w-full" placeholder="Full Stack Developer" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={set('bio')}
              rows={4}
              className="input-field w-full resize-none"
              placeholder="Tell visitors about yourself…"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Resume / CV Link</label>
            <div className="relative">
              <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input type="url" value={form.resume} onChange={set('resume')} className="input-field pl-10 w-full" placeholder="https://drive.google.com/…" />
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
          <h2 className="text-white font-semibold">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { field: 'email', icon: FiMail, placeholder: 'you@example.com', label: 'Email' },
              { field: 'github', icon: FiGithub, placeholder: 'https://github.com/…', label: 'GitHub' },
              { field: 'linkedin', icon: FiLinkedin, placeholder: 'https://linkedin.com/in/…', label: 'LinkedIn' },
              { field: 'twitter', icon: FiTwitter, placeholder: 'https://twitter.com/…', label: 'Twitter / X' },
            ].map(({ field, icon: Icon, placeholder, label }) => (
              <div key={field}>
                <label className="block text-sm text-gray-400 mb-1">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={form[field]}
                    onChange={set(field)}
                    className="input-field pl-10 w-full"
                    placeholder={placeholder}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSave className="w-4 h-4" />
            )}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
