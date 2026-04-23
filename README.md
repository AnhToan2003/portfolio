# 🚀 Personal Portfolio — React + Node.js + MongoDB

A cinematic, 3D-powered personal portfolio built with modern web technologies.

## Tech Stack

| Layer      | Tech                                      |
|------------|-------------------------------------------|
| Frontend   | React 18, Vite, TailwindCSS, Framer Motion |
| 3D / Anim  | Three.js, React Three Fiber, GSAP          |
| Backend    | Node.js, Express                           |
| Database   | MongoDB (localhost:27017)                  |

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running on localhost:27017

### 2. Install & Run Backend
```bash
cd server
npm install
npm run dev
# API → http://localhost:5000
```

### 3. Install & Run Frontend
```bash
cd client
npm install
npm run dev
# App → http://localhost:5173
```

## API Endpoints

| Method | Route                | Description          |
|--------|----------------------|----------------------|
| GET    | /api/health          | Health check         |
| GET    | /api/profile         | Get profile data     |
| PUT    | /api/profile         | Update profile       |
| GET    | /api/projects        | List all projects    |
| POST   | /api/projects        | Add new project      |
| GET    | /api/projects/:id    | Get single project   |
| DELETE | /api/projects/:id    | Delete project       |
| POST   | /api/contact         | Submit contact form  |
| GET    | /api/contact         | List messages        |

## Features

- ✅ Cinematic 3D hero with React Three Fiber
- ✅ Custom magnetic cursor with GSAP
- ✅ Scroll-triggered animations (Framer Motion)
- ✅ 3D tilt effect on project cards
- ✅ Typing animation with multiple titles
- ✅ Glassmorphism UI throughout
- ✅ Contact form → MongoDB persistence
- ✅ Fully responsive (mobile-first)
- ✅ Parallax + camera pan on mouse move
- ✅ Scroll progress indicator
- ✅ Page loading animation
- ✅ Skills filter with animated bars
- ✅ Project modal with details
- ✅ Experience timeline
