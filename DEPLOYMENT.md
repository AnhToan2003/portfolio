# Deployment Guide

## Local Development

### 1. Start MongoDB
Make sure MongoDB is running locally:
```
mongod
```

### 2. Start the backend
```bash
cd server
npm install
npm run dev          # nodemon, auto-restarts on changes
```
Server runs at http://localhost:5000  
**Default admin credentials:** `admin` / `admin123`  
Change these in `server/.env` before deploying.

### 3. Start the frontend
```bash
cd client
npm install
npm run dev          # Vite dev server with HMR
```
App runs at http://localhost:5173  
Admin panel: http://localhost:5173/admin

---

## Production Build

### Frontend
```bash
cd client
npm run build        # Outputs to client/dist/
npm run preview      # Preview the production build locally
```

### Backend
```bash
cd server
npm start            # Runs node server.js
```

---

## Deploying the Frontend

### Option A — Vercel (recommended)
1. Push your repo to GitHub
2. Go to https://vercel.com → New Project → Import repo
3. Set **Root Directory** to `client`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. Deploy — Vercel auto-handles SPA routing via `vercel.json`

### Option B — Netlify
1. Push your repo to GitHub
2. Go to https://app.netlify.com → Add new site → Import from Git
3. Set **Base directory** to `client`, **Build command** to `npm run build`, **Publish directory** to `client/dist`
4. Add environment variable `VITE_API_URL=https://your-backend.onrender.com`
5. Deploy — `netlify.toml` handles SPA routing automatically

---

## Deploying the Backend

### Option A — Render (free tier available)
1. Push your repo to GitHub
2. Go to https://render.com → New → Web Service → Connect repo
3. Set **Root Directory** to `server`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add environment variables:
   ```
   PORT=10000
   MONGO_URI=mongodb+srv://...   (MongoDB Atlas URI)
   JWT_SECRET=your_long_random_secret
   CLIENT_URL=https://your-frontend.vercel.app
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   ```

### Option B — Railway
1. Go to https://railway.app → New Project → Deploy from GitHub repo
2. Select the `server` folder as the service root
3. Add the same environment variables as above
4. Railway auto-detects Node.js and runs `npm start`

### Option C — VPS / DigitalOcean / EC2
```bash
# On your server
git clone https://github.com/you/portfolio.git
cd portfolio/server
npm install

# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name portfolio-api
pm2 save
pm2 startup

# Nginx reverse proxy (example)
# proxy_pass http://localhost:5000;
```

---

## Database — MongoDB Atlas (Production)

1. Go to https://cloud.mongodb.com → Create a free cluster
2. Create a database user with password
3. Whitelist IPs (use `0.0.0.0/0` for Render/Railway)
4. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio
   ```
5. Set this as `MONGO_URI` in your backend environment variables

---

## Environment Variables Reference

### Server (`server/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_change_this_in_production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Client (`client/.env`)
```
VITE_API_URL=http://localhost:5000
```
In production:
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## Image Uploads in Production

By default, uploaded images are stored in `server/uploads/` on the server's filesystem.  
**On Render/Railway, the filesystem is ephemeral** — files are lost on redeploy.

For persistent image storage in production, use **Cloudinary**:

1. Create a free account at https://cloudinary.com
2. Install in server: `npm install cloudinary multer-storage-cloudinary`
3. Replace the Multer disk storage in `server/routes/upload.js` with:

```js
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'portfolio', allowed_formats: ['jpg', 'png', 'webp', 'gif'] },
})
```
4. Add Cloudinary env vars to your backend host

---

## CORS in Production

`server/server.js` reads `CLIENT_URL` from env.  
To allow multiple origins (e.g. both www and non-www):
```
CLIENT_URL=https://your-site.vercel.app,https://www.your-site.com
```
The server splits on commas and allows each origin.

---

## Admin Login

After deployment, visit `/admin/login`.  
Default credentials are set via `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars.  
**Change these before going live.**

The first time the server starts it auto-seeds the admin user, profile, and sample projects.
