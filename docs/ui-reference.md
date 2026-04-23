# UI Reference — Portfolio Frontend

> Tài liệu này mô tả giao diện hiện tại của portfolio để dễ dàng cập nhật và chỉnh sửa trong tương lai.

---

## Màu sắc (Color Palette)

| Tên | Hex | Dùng cho |
|-----|-----|----------|
| Purple primary | `#7c3aed` | Gradient, accent, active states |
| Cyan accent | `#06b6d4` | Gradient end, hover, highlights |
| Purple mid | `#8b5cf6` | Secondary purple variant |
| Cyan mid | `#22d3ee` | Secondary cyan variant |
| Background dark | `#05050a` | Hero, About, Contact, Projects |
| Background darker | `#080812` | Skills, Experience sections |
| Glass bg | `rgba(255,255,255,0.03)` | Card surfaces (`.glass` class) |
| Text primary | `#f1f5f9` (slate-100) | Headings, active text |
| Text secondary | `#94a3b8` (slate-400) | Body text, descriptions |
| Text muted | `#64748b` (slate-500) | Labels, metadata |
| Text faint | `#475569` (slate-600) | Placeholders, timestamps |

### Gradient chính
```css
background: linear-gradient(135deg, #7c3aed, #06b6d4);
```

---

## Typography

| Class | Font | Weight | Dùng cho |
|-------|------|--------|----------|
| `font-grotesk` | Space Grotesk | 600–800 | Headings, brand, buttons |
| `font-inter` | Inter | 400–500 | Body text, labels, metadata |

### Kích thước heading section
```css
font-size: clamp(2.5rem, 6vw, 5rem); /* Hero h1 */
font-size: text-4xl md:text-5xl;     /* Section h2 */
```

---

## Bố cục (Layout)

- Max width content: `max-w-6xl mx-auto px-6`
- Section padding: `py-28`
- Grid 2 cột: `grid lg:grid-cols-2 gap-16`
- Grid cards: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`

---

## Components

### Glass Card
```css
.glass {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
}
```

### Tag Badge
```css
.tag-badge {
  background: rgba(124,58,237,0.12);
  color: #a78bfa;
  border: 1px solid rgba(124,58,237,0.2);
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 0.75rem;
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Sections (thứ tự trên trang)

| # | ID | Component | Background | Nội dung chính |
|---|----|-----------|------------|----------------|
| 1 | `#home` | `Hero.jsx` | `#05050a` | 3D canvas, tên, typing text, CTA buttons |
| 2 | `#about` | `About.jsx` | `#05050a` | Avatar, bio, stats, tech badges, CV download |
| 3 | `#skills` | `Skills.jsx` | `#080812` | Skill cards với icon + level bar + category filter |
| 4 | `#projects` | `Projects.jsx` | `#05050a` | Project cards, modal detail, filter by category |
| 5 | `#experience` | `Experience.jsx` | `#080812` | Timeline work + education |
| 6 | `#contact` | `Contact.jsx` | `#05050a` | Contact info, social links, form gửi message |
| - | - | `Footer.jsx` | `#030308` | Nav links, social icons, copyright |

---

## Animations

| Effect | Thư viện | Cách dùng |
|--------|----------|-----------|
| Scroll reveal | Framer Motion `useInView` | `once: true, margin: '-100px'` |
| Hover scale | Framer Motion `whileHover` | `{ scale: 1.05, y: -4 }` |
| Typing effect | Custom hook `useTyping` | `Hero.jsx` — speed 100ms, pause 1800ms |
| 3D tilt | Mouse event + perspective | `Projects.jsx` card hover |
| Page scroll parallax | `useScroll + useTransform` | `Hero.jsx` — y 0→30%, opacity 1→0 |
| 3D scene | React Three Fiber | `Hero.jsx` — DistortSphere, WireframeTorus, Stars |
| Rotate rings | `framer-motion animate` | `About.jsx` avatar border — 20s infinite |
| Float badge | `framer-motion animate` | `About.jsx` skill badges — y[0,-8,0] loop |

---

## Navbar

- Scroll progress bar: gradient `#7c3aed → #06b6d4` ở top
- Logo: `</>` icon + "Dev**Portfolio**" text
- Nav links: pill highlight animation với `layoutId="nav-pill"`
- CTA button: gradient pill "Hire Me" → scroll to `#contact`
- Mobile: fullscreen overlay menu với stagger animation
- Active section: detect dùng `offsetTop - 120`

---

## Admin Panel (`/admin/*`)

| Route | Page | Chức năng |
|-------|------|-----------|
| `/admin` | Dashboard | Tổng quan stats |
| `/admin/profile` | ProfileEdit | Tên, bio, avatar, social |
| `/admin/skills` | SkillsManager | CRUD skills (name, level, category) |
| `/admin/projects` | ProjectsManager | CRUD projects (title, desc, tech, links, image) |
| `/admin/experience` | ExperienceManager | CRUD work + education |
| `/admin/messages` | MessagesView | Xem contact messages |
| `/admin/content` | ContentManager | Chỉnh tất cả text frontend qua backend |

---

## Content System

Tất cả text trên frontend được lấy từ `GET /api/content`.

**Flow:**
```
MongoDB (SiteContent) → GET /api/content → ContentContext (React) → tất cả components
```

**Fallback:** nếu MongoDB trống → dùng `server/config/siteContent.json`

**Chỉnh sửa:** vào `/admin/content` → chỉnh → Save All → lưu vào MongoDB → áp dụng ngay

**Sections có thể chỉnh qua admin:**
- `navbar` — brand, CTA button, nav links
- `hero` — badge, name, typing words, description, CTA labels
- `about` — heading, bio paragraphs, stats, tech badges, CV link
- `skills` — section label, heading, description, filter categories
- `projects` — section label, heading, description, GitHub link
- `experience` — section label, heading, description
- `contact` — section label, email, phone, location
- `social` — GitHub, LinkedIn, Twitter URLs
- `footer` — tagline, copyright, location, tech stack text

**Data items** (skills list, projects list, experience entries) được quản lý qua các trang admin riêng (SkillsManager, ProjectsManager, ExperienceManager).

---

## File Structure (Client)

```
client/src/
├── components/
│   ├── Navbar.jsx       — Fixed top nav, scroll progress
│   ├── Hero.jsx         — 3D scene + intro text
│   ├── About.jsx        — Bio + stats + avatar
│   ├── Skills.jsx       — Skill cards fetched from /api/skills
│   ├── Projects.jsx     — Project grid fetched from /api/projects
│   ├── Experience.jsx   — Timeline fetched from /api/experience
│   ├── Contact.jsx      — Form + contact info
│   ├── Footer.jsx       — Bottom bar
│   ├── Loader.jsx       — Intro loading screen (2.8s)
│   └── Cursor.jsx       — Custom cursor (disabled in admin)
├── context/
│   ├── ContentContext.jsx  — Global site text state
│   └── AuthContext.jsx     — Admin JWT auth state
├── pages/
│   ├── Login.jsx
│   └── admin/
│       ├── AdminLayout.jsx
│       ├── Dashboard.jsx
│       ├── ContentManager.jsx  ← chỉnh text frontend
│       ├── ProfileEdit.jsx
│       ├── SkillsManager.jsx
│       ├── ProjectsManager.jsx
│       ├── ExperienceManager.jsx
│       └── MessagesView.jsx
└── utils/
    └── api.js  — Axios instance với auth interceptor
```
