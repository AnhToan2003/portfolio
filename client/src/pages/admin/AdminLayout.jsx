import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FiHome, FiUser, FiCode, FiFolder, FiBriefcase,
  FiMail, FiLogOut, FiMenu, FiX, FiExternalLink,
} from 'react-icons/fi'

const navItems = [
  { to: '/admin', icon: FiHome, label: 'Dashboard', end: true },
  { to: '/admin/profile', icon: FiUser, label: 'Profile' },
  { to: '/admin/skills', icon: FiCode, label: 'Skills' },
  { to: '/admin/projects', icon: FiFolder, label: 'Projects' },
  { to: '/admin/experience', icon: FiBriefcase, label: 'Experience' },
  { to: '/admin/messages', icon: FiMail, label: 'Messages' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Restore normal cursor inside admin (portfolio sets cursor:none on body)
  useEffect(() => {
    document.body.style.cursor = 'auto'
    return () => { document.body.style.cursor = '' }
  }, [])

  function handleLogout() {
    logout()
    toast.success('Logged out')
    navigate('/admin/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex-shrink-0" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Portfolio</p>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <FiExternalLink className="w-4 h-4" />
          View Portfolio
        </a>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.username}</p>
            <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-400 transition-colors p-1"
            title="Logout"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-dark-800 border-r border-white/5 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 h-full bg-dark-800 border-r border-white/5 flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 bg-dark-900/80 backdrop-blur border-b border-white/5 flex items-center px-4 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <span className="text-gray-500 text-sm hidden sm:block">
            Logged in as <span className="text-gray-300">{user?.username}</span>
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
