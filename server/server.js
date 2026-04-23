const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── STATIC UPLOADS ──────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
app.use('/uploads', express.static(uploadsDir))

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'))
app.use('/api/profile', require('./routes/profile'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/skills', require('./routes/skills'))
app.use('/api/experience', require('./routes/experience'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/upload', require('./routes/upload'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ─── MONGODB + SEED ──────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')
  .then(async () => {
    console.log('✅ MongoDB connected')
    await seedDatabase()
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })

async function seedDatabase() {
  const User = require('./models/User')
  const Profile = require('./models/Profile')
  const Project = require('./models/Project')

  // Seed admin user
  const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME || 'admin' })
  if (!adminExists) {
    await User.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    })
    console.log(`✅ Admin user created — login: ${process.env.ADMIN_USERNAME || 'admin'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`)
  }

  // Seed profile
  const profileCount = await Profile.countDocuments()
  if (profileCount === 0) {
    await Profile.create({
      name: 'Nguyen Anh Toan',
      title: 'Full Stack Developer',
      bio: 'Passionate Full Stack Developer with 3+ years building modern web applications. Specialized in React, Node.js, and MongoDB with a love for 3D web experiences.',
      email: 'mranhtoandt@gmail.com',
      github: 'https://github.com/anhtoandt',
      linkedin: 'https://linkedin.com/in/anhtoandt',
      twitter: 'https://twitter.com/anhtoandt',
      skills: [
        { name: 'React', level: 92, category: 'Frontend' },
        { name: 'Node.js', level: 88, category: 'Backend' },
        { name: 'MongoDB', level: 82, category: 'Backend' },
        { name: 'TypeScript', level: 80, category: 'Frontend' },
        { name: 'Three.js', level: 72, category: 'Frontend' },
        { name: 'Docker', level: 72, category: 'DevOps' },
      ],
      experience: [
        {
          company: 'TechVision Labs',
          role: 'Senior Full Stack Developer',
          period: '2023 – Present',
          description: 'Lead development of AI-powered SaaS platform serving 50K+ users.',
        },
        {
          company: 'DigitalCraft Studio',
          role: 'Frontend Developer',
          period: '2022 – 2023',
          description: 'Built 3D web experiences for 15+ client projects.',
        },
      ],
      education: [
        {
          school: 'Vietnam National University',
          degree: 'B.Sc. Computer Science',
          period: '2018 – 2022',
        },
      ],
    })
    console.log('✅ Profile seeded')
  }

  // Seed projects
  const projectCount = await Project.countDocuments()
  if (projectCount === 0) {
    await Project.insertMany([
      {
        title: 'NeuroChat AI',
        description: 'Real-time AI chat platform with GPT-4 integration, streaming responses, and conversation history.',
        tech: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
        github: 'https://github.com',
        demo: 'https://example.com',
        featured: true,
        category: 'Full Stack',
      },
      {
        title: '3D Portfolio Studio',
        description: 'Interactive 3D portfolio builder with drag-and-drop editor and real-time preview.',
        tech: ['React', 'Three.js', 'Node.js'],
        github: 'https://github.com',
        demo: 'https://example.com',
        featured: true,
        category: 'Frontend',
      },
    ])
    console.log('✅ Projects seeded')
  }
}
