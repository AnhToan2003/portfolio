# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Run both frontend and backend concurrently (recommended)
npm run dev

# Install all dependencies (root + server + client)
npm run install:all
```

### Individual Services
```bash
# Backend only (Express on port 5000)
npm run dev --prefix server

# Frontend only (Vite on port 5173)
npm run dev --prefix client
```

### Production Build
```bash
npm run build        # builds client only
npm start            # serves built client + backend
```

### No test suite — none is configured.

## Architecture

This is a **full-stack portfolio app** with a monorepo layout:

```
portfolio/
├── client/      # React 18 SPA (Vite, Tailwind, Three.js, GSAP, Framer Motion)
└── server/      # Express + Mongoose REST API
```

### Frontend (`client/`)

- Entry: `src/main.jsx` → `src/App.jsx`
- Routes: `/` renders the portfolio page; `/admin/*` renders the admin dashboard (protected by JWT)
- Context providers wrap the app: `AuthContext` (JWT + localStorage) and `ContentContext` (fetches all site content from the API)
- All HTTP calls go through `src/utils/api.js` — an Axios instance that reads `VITE_API_URL` and auto-attaches the JWT token from localStorage. 401 responses clear the token and redirect to `/login`.
- In dev, Vite proxies `/api` and `/uploads` to `http://localhost:5000` (see `vite.config.js`).

### Backend (`server/`)

- Entry: `server.js` — registers routes, connects MongoDB, seeds default data on first run, serves `/uploads` as static files.
- Auth: JWT issued on login, verified by `middleware/auth.js` for protected routes.
- API surface: `/api/auth`, `/api/content`, `/api/profile`, `/api/projects`, `/api/skills`, `/api/experience`, `/api/contact`, `/api/upload`
- Default content seeded from `config/siteContent.json`.

### Environment Variables

**server/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
CLIENT_URL=http://localhost:5173
JWT_SECRET=...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**client/.env**
```
VITE_API_URL=http://localhost:5000
```

`client/.env.production` must be updated with the deployed backend URL before building for production.

## Key Patterns

- **Content editing**: All visible text on the portfolio is stored in MongoDB (`SiteContent` model) and fetched via `ContentContext`. Edit content through the admin dashboard at `/admin`, not by hardcoding strings in components.
- **File uploads**: Images are uploaded via `POST /api/upload`, stored in `server/uploads/`, and served as static assets. The frontend references them by path.
- **Admin auth flow**: `POST /api/auth/login` returns a JWT stored in localStorage. `AuthContext.login()` / `logout()` manage this. Protected admin routes check `AuthContext.isAuthenticated`.
