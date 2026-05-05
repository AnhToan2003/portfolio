# Personal Portfolio — React + Node.js + MongoDB

A cinematic, 3D-powered personal portfolio with a full-stack admin dashboard for managing all content.

## Tech Stack

| Layer      | Tech                                                  |
|------------|-------------------------------------------------------|
| Frontend   | React 18, Vite, TailwindCSS, Framer Motion            |
| 3D / Anim  | Three.js, React Three Fiber, GSAP                     |
| Backend    | Node.js, Express, JWT Auth                            |
| Database   | MongoDB + Mongoose                                    |
| Deployment | Vercel (frontend) · Render (backend)                  |

## Project Structure

```
portfolio/
├── client/                  # React SPA (Vite)
│   └── src/
│       ├── components/      # Reusable UI components (Hero, About, Skills…)
│       ├── context/         # AuthContext, ContentContext
│       ├── hooks/           # useAsync — shared loading/error hook
│       ├── pages/
│       │   ├── Login.jsx
│       │   └── admin/       # Dashboard, ProfileEdit, SkillsManager…
│       ├── services/        # API call functions (one file per domain)
│       └── utils/
│           └── api.js       # Axios instance with JWT interceptor
│
├── server/                  # Express REST API
│   ├── config/
│   │   └── siteContent.json # Default seed data
│   ├── controllers/         # HTTP request handlers
│   ├── middleware/          # auth.js · rateLimiter.js · validate.js
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── services/            # Business logic / DB queries
│   └── server.js            # Entry point
│
└── legacy/                  # Pre-refactor snapshot (rollback reference)
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### Install & Run (all-in-one)

```bash
npm run install:all   # install root + server + client deps
npm run dev           # starts both backend (5000) and frontend (5173)
```

### Run services individually

```bash
# Backend only
npm run dev --prefix server   # http://localhost:5000

# Frontend only
npm run dev --prefix client   # http://localhost:5173
```

### Default Admin Credentials

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

Admin panel: `http://localhost:5173/admin`

## Environment Variables

**`server/.env`**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000
```

> For production, update `client/.env.production` with the deployed backend URL.

## API Reference

| Method | Route                       | Auth | Description               |
|--------|-----------------------------|------|---------------------------|
| POST   | `/api/auth/login`           | No   | Admin login → JWT         |
| GET    | `/api/auth/me`              | Yes  | Get current user          |
| GET    | `/api/content`              | No   | All site text/config      |
| PUT    | `/api/content`              | Yes  | Update site content       |
| GET    | `/api/profile`              | No   | Public profile data       |
| PUT    | `/api/profile`              | Yes  | Update profile            |
| GET    | `/api/projects`             | No   | List projects             |
| POST   | `/api/projects`             | Yes  | Create project            |
| PUT    | `/api/projects/:id`         | Yes  | Update project            |
| DELETE | `/api/projects/:id`         | Yes  | Delete project            |
| GET    | `/api/skills`               | No   | List skills               |
| POST   | `/api/skills`               | Yes  | Add skill                 |
| PUT    | `/api/skills/:id`           | Yes  | Update skill              |
| DELETE | `/api/skills/:id`           | Yes  | Delete skill              |
| GET    | `/api/experience`           | No   | Work + education entries  |
| POST   | `/api/experience`           | Yes  | Add work experience       |
| POST   | `/api/experience/education` | Yes  | Add education entry       |
| PUT    | `/api/experience/:id`       | Yes  | Update work entry         |
| DELETE | `/api/experience/:id`       | Yes  | Delete work entry         |
| POST   | `/api/contact`              | No   | Submit contact form       |
| GET    | `/api/contact`              | Yes  | List messages             |
| PATCH  | `/api/contact/:id/read`     | Yes  | Mark message as read      |
| DELETE | `/api/contact/:id`          | Yes  | Delete message            |
| POST   | `/api/upload`               | Yes  | Upload image (multer)     |
| DELETE | `/api/upload`               | Yes  | Delete uploaded image     |
| GET    | `/api/health`               | No   | Server health check       |

## Architecture Notes

- **Backend services layer** — All DB queries live in `server/services/`. Controllers only handle HTTP (status codes, req/res). This makes business logic reusable and easy to test independently.
- **Frontend services layer** — All Axios calls are centralized in `client/src/services/`. Components import named functions (`getProjects`, `createSkill`) instead of constructing API calls inline.
- **Content editing** — All visible portfolio text is stored in MongoDB (`SiteContent` model). Edit via `/admin/content`. The `ContentContext` fetches once on load and deep-merges with hardcoded defaults, so the site always renders even if the API is unavailable.
- **Rate limiting** — Contact form submissions are rate-limited to 5 per minute per IP (in-memory, no extra packages).
- **File uploads** — Images are stored in `server/uploads/` and served as static files. The frontend references them by relative path.

## Features

- Cinematic 3D hero with React Three Fiber
- Custom magnetic cursor (GSAP)
- Scroll-triggered animations (Framer Motion)
- 3D tilt on project cards
- Typing animation in hero
- Glassmorphism UI
- Full admin dashboard (JWT-protected)
- Contact form → MongoDB persistence + rate limiting
- Dynamic content — all text editable via admin
- Fully responsive (mobile-first)
