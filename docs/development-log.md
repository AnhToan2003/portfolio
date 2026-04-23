# Development Log

This file is the long-term memory of the portfolio project.
Every completed task is logged here automatically.

---

## [2026-04-23 — Session 1]

### Task
Initial project scaffold: full-stack portfolio with admin dashboard

### Files Created
- `client/` — React + Vite frontend (full component set)
- `server/` — Express + MongoDB backend
- `server/models/Profile.js`, `Project.js`, `Contact.js`
- `server/routes/profile.js`, `projects.js`, `contact.js`

### Features Implemented
- 3D hero section with React Three Fiber
- Framer Motion animations across all sections
- MongoDB-backed contact form
- Project listing from database

### Notes
- No authentication at this stage
- All portfolio content hardcoded in frontend

---

## [2026-04-23 — Session 2]

### Task
Admin dashboard with JWT authentication and full CRUD

### Files Created
- `server/models/User.js` — Admin user with bcrypt
- `server/middleware/auth.js` — JWT verification middleware
- `server/routes/auth.js` — Login + /me endpoints
- `server/routes/skills.js` — Skills CRUD (sub-docs on Profile)
- `server/routes/experience.js` — Experience + Education CRUD
- `server/routes/upload.js` — Multer image upload
- `client/src/context/AuthContext.jsx`
- `client/src/utils/api.js` — Axios with auth interceptor
- `client/src/components/ProtectedRoute.jsx`
- `client/src/pages/Login.jsx`
- `client/src/pages/admin/AdminLayout.jsx` — Sidebar navigation
- `client/src/pages/admin/Dashboard.jsx`
- `client/src/pages/admin/ProfileEdit.jsx`
- `client/src/pages/admin/SkillsManager.jsx`
- `client/src/pages/admin/ProjectsManager.jsx`
- `client/src/pages/admin/ExperienceManager.jsx`
- `client/src/pages/admin/MessagesView.jsx`

### Files Modified
- `server/routes/profile.js` — Auth-protected PUT
- `server/routes/projects.js` — Auth-protected write operations
- `server/routes/contact.js` — Auth-protected GET/DELETE
- `server/server.js` — New routes, uploads static, admin seed
- `client/src/App.jsx` — React Router v6 with admin routes

### Features Implemented
- JWT login with 7-day token expiry
- Protected admin routes (redirect to /admin/login)
- Profile editing with image upload
- Skills CRUD with inline editing and level slider
- Projects CRUD with modal form and image upload
- Experience/Education CRUD with inline forms
- Contact message inbox with read/delete/reply
- Toast notifications (react-hot-toast)
- Custom cursor disabled in admin panel

### Notes
- Admin credentials set via ADMIN_USERNAME / ADMIN_PASSWORD env vars
- Default: admin / admin123 — CHANGE BEFORE PRODUCTION
- Multer stores to server/uploads/ — ephemeral on cloud hosts; use Cloudinary for production
- Skills/Experience stored as sub-documents on single Profile model

---

## [2026-04-23 — Session 3]

### Task
Professional workflow system: controllers architecture, backend-controlled content, dev logging

### Files Created
- `docs/development-log.md` — This file (long-term project memory)
- `server/config/siteContent.json` — Default content fallback
- `server/models/SiteContent.js` — Mongoose model for editable site content
- `server/controllers/authController.js`
- `server/controllers/profileController.js`
- `server/controllers/projectsController.js`
- `server/controllers/skillsController.js`
- `server/controllers/experienceController.js`
- `server/controllers/contactController.js`
- `server/controllers/contentController.js`
- `server/controllers/uploadController.js`
- `server/routes/content.js` — GET/PUT /api/content
- `client/src/context/ContentContext.jsx`
- `client/src/pages/admin/ContentManager.jsx`

### Files Modified
- All `server/routes/*.js` — Refactored to thin routes using controllers
- `server/server.js` — Added /api/content route + SiteContent seed
- `client/src/App.jsx` — Added ContentProvider wrapper
- `client/src/components/Hero.jsx` — All hardcoded text replaced with ContentContext
- `client/src/components/About.jsx` — All hardcoded text replaced with ContentContext
- `client/src/components/Contact.jsx` — All hardcoded text replaced with ContentContext
- `client/src/components/Footer.jsx` — All hardcoded text replaced with ContentContext
- `client/src/pages/admin/AdminLayout.jsx` — Added Content nav item
- `client/src/pages/admin/Dashboard.jsx` — Added Content quick action

### Features Implemented
- MVC controller pattern — routes are thin, logic lives in controllers
- `/api/content` GET (public) + PUT (protected)
- Fallback: if MongoDB empty → load from siteContent.json
- Zero hardcoded content in React components
- Admin ContentManager page for editing all site-wide text
- Development log auto-appended after each session

### Notes
- siteContent.json is the single source of truth for default values
- Frontend uses ContentContext to share site content across all components
- Loading state shown while content is fetched — no flash of wrong content
