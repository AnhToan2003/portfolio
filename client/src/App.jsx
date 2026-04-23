import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import ProtectedRoute from './components/ProtectedRoute'

// Portfolio
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Admin
import Login from './pages/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ProfileEdit from './pages/admin/ProfileEdit'
import SkillsManager from './pages/admin/SkillsManager'
import ProjectsManager from './pages/admin/ProjectsManager'
import ExperienceManager from './pages/admin/ExperienceManager'
import MessagesView from './pages/admin/MessagesView'
import ContentManager from './pages/admin/ContentManager'

function Portfolio() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Cursor />
      {loading && <Loader />}
      <div className={`transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a0a14',
              color: '#f1f5f9',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#7c3aed', secondary: '#f1f5f9' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
          }}
        />
        <Routes>
          {/* Portfolio */}
          <Route path="/" element={<Portfolio />} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin dashboard — protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfileEdit />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="experience" element={<ExperienceManager />} />
            <Route path="messages" element={<MessagesView />} />
            <Route path="content" element={<ContentManager />} />
          </Route>
        </Routes>
      </AuthProvider>
      </ContentProvider>
    </BrowserRouter>
  )
}
