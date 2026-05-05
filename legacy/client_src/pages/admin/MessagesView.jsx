import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiMail, FiTrash2, FiCheck, FiInbox } from 'react-icons/fi'

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function MessagesView() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('/api/contact')
      .then((res) => setMessages(res.data.data))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false))
  }, [])

  async function markRead(id) {
    try {
      await api.patch(`/api/contact/${id}/read`)
      setMessages((m) => m.map((msg) => msg._id === id ? { ...msg, read: true } : msg))
      if (selected?._id === id) setSelected((s) => ({ ...s, read: true }))
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this message?')) return
    try {
      await api.delete(`/api/contact/${id}`)
      setMessages((m) => m.filter((msg) => msg._id !== id))
      if (selected?._id === id) setSelected(null)
      toast.success('Message deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  function openMessage(msg) {
    setSelected(msg)
    if (!msg.read) markRead(msg._id)
  }

  const unread = messages.filter((m) => !m.read).length

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 mt-1">
            {unread > 0 ? <span className="text-purple-400 font-medium">{unread} unread</span> : 'All read'} · {messages.length} total
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 glass rounded-2xl border border-white/5">
          <FiInbox className="w-10 h-10 text-gray-600 mb-3" />
          <p className="text-gray-500">No messages yet</p>
        </div>
      ) : (
        <div className="flex gap-4 h-[calc(100vh-16rem)]">
          {/* Message list */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col gap-1 overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?._id === msg._id
                    ? 'bg-purple-600/15 border-purple-500/30'
                    : 'glass border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-2">
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                  )}
                  <div className={`flex-1 min-w-0 ${msg.read ? 'pl-4' : ''}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${msg.read ? 'text-gray-300' : 'text-white font-semibold'}`}>
                        {msg.name}
                      </span>
                      <span className="text-xs text-gray-600 flex-shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs truncate mt-0.5">{msg.subject || msg.email}</p>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{msg.message}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Message detail */}
          <div className="flex-1 hidden lg:flex">
            {selected ? (
              <div className="glass rounded-2xl border border-white/5 p-6 flex flex-col w-full overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-white font-bold text-lg">{selected.subject || '(No subject)'}</h2>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {selected.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium">{selected.name}</p>
                        <a href={`mailto:${selected.email}`} className="text-purple-400 hover:text-purple-300 text-xs transition-colors">
                          {selected.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!selected.read && (
                      <button onClick={() => markRead(selected._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 text-xs transition-all">
                        <FiCheck className="w-3.5 h-3.5" /> Mark read
                      </button>
                    )}
                    <button onClick={() => handleDelete(selected._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-xs transition-all">
                      <FiTrash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>

                <p className="text-gray-500 text-xs mb-4">{formatDate(selected.createdAt)}</p>

                <div className="flex-1 bg-white/3 rounded-xl p-4 border border-white/5">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <div className="mt-4">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || '')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-all"
                  >
                    <FiMail className="w-4 h-4" /> Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full glass rounded-2xl border border-white/5">
                <FiMail className="w-10 h-10 text-gray-600 mb-3" />
                <p className="text-gray-500 text-sm">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile message detail */}
      {selected && (
        <div className="lg:hidden glass rounded-2xl border border-white/5 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-white font-bold">{selected.subject || '(No subject)'}</h3>
              <p className="text-gray-400 text-sm">{selected.name} · {selected.email}</p>
              <p className="text-gray-600 text-xs">{formatDate(selected.createdAt)}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-500 p-1">
              <FiCheck className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
          <div className="flex gap-2">
            <a href={`mailto:${selected.email}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium">
              <FiMail className="w-3.5 h-3.5" /> Reply
            </a>
            <button onClick={() => handleDelete(selected._id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium">
              <FiTrash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
