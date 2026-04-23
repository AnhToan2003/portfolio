import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

// Default fallback so components never render empty strings
const DEFAULT = {
  site: { name: 'DevPortfolio', tagline: 'Building beautiful digital experiences.' },
  navbar: {
    brand: 'DevPortfolio',
    cta: 'Hire Me',
    links: ['About', 'Skills', 'Projects', 'Experience', 'Contact'],
  },
  hero: {
    badge: 'Available for opportunities',
    greeting: "Hi, I'm",
    name: 'Anh Toan',
    subtitle: 'Developer & Creator',
    typingWords: ['Full Stack Developer', 'React & Node.js Expert', 'UI/UX Enthusiast', '3D Web Creator'],
    description: 'I craft beautiful, high-performance web experiences using modern technologies.',
    cta: { primary: 'View My Work', secondary: 'Contact Me' },
  },
  about: {
    sectionLabel: '01 — About Me',
    heading: 'Crafting Digital',
    headingAccent: 'Experiences',
    paragraphs: [
      "I'm a passionate Full Stack Developer with a love for building things that live on the internet.",
      'With expertise in React, Node.js, and MongoDB, I build scalable applications.',
      "When I'm not coding, you'll find me exploring the latest in web tech.",
    ],
    stats: [
      { value: '3+', label: 'Years Experience' },
      { value: '40+', label: 'Projects Completed' },
      { value: '15+', label: 'Technologies' },
      { value: '99%', label: 'Client Satisfaction' },
    ],
    techBadges: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Three.js', 'TailwindCSS', 'Docker', 'AWS'],
    resumeLink: '/cv.pdf',
    resumeLabel: 'Download Resume',
  },
  skills: {
    sectionLabel: '02 — Skills',
    heading: 'Tech',
    headingAccent: 'Arsenal',
    description: 'A curated set of tools and technologies I use to build exceptional digital products.',
    categories: ['All', 'Frontend', 'Backend', 'Tools & DevOps'],
  },
  projects: {
    sectionLabel: '03 — Projects',
    heading: 'Featured',
    headingAccent: 'Work',
    description: 'A selection of projects that showcase my skills across different domains.',
    githubUrl: 'https://github.com',
    githubLabel: 'View all on GitHub',
  },
  experience: {
    sectionLabel: '04 — Experience',
    heading: 'My',
    headingAccent: 'Journey',
    description: 'The path that shaped my skills and perspective as a developer.',
  },
  contact: {
    sectionLabel: '05 — Contact',
    heading: "Let's Work",
    headingAccent: 'Together',
    description: 'Have a project in mind or want to collaborate?',
    email: 'mranhtoandt@gmail.com',
    location: 'Ho Chi Minh City, Vietnam',
    phone: '+84 xxx xxx xxx',
  },
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
  footer: {
    brand: 'DevPortfolio',
    tagline: 'Building beautiful digital experiences with passion and precision.',
    copyright: 'Anh Toan',
    techStack: 'React · Node.js · MongoDB · Three.js',
    location: 'Vietnam',
  },
}

const ContentContext = createContext(DEFAULT)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/content')
      .then((res) => {
        if (res.data?.data) {
          // Deep merge with DEFAULT so missing fields never break components
          setContent((prev) => deepMerge(prev, res.data.data))
        }
      })
      .catch(() => {
        // Silently fall back to DEFAULT — site always works
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <ContentContext.Provider value={{ content, setContent, loading }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}

// Recursively merge b into a, keeping a's values when b is missing/null
function deepMerge(a, b) {
  if (!b || typeof b !== 'object') return a
  const result = { ...a }
  for (const key of Object.keys(b)) {
    if (b[key] && typeof b[key] === 'object' && !Array.isArray(b[key])) {
      result[key] = deepMerge(a[key] || {}, b[key])
    } else if (b[key] !== null && b[key] !== undefined && b[key] !== '') {
      result[key] = b[key]
    }
  }
  return result
}
