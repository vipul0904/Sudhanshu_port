# Product Requirements Document (PRD)

## Sudhanshu Academic & Professional Portfolio

> **Version**: 2.0 — Last updated: May 22, 2026  
> **Status**: Active Development  
> **Author**: Sudhanshu Kumar (Vipulsaini)

---

## 1. Project Overview

The Sudhanshu Portfolio is a modern, responsive, full-stack personal website designed to showcase academic achievements, research publications, professional experience, blogs, poetry, and educational resources. It features a secure admin dashboard for real-time content management, a MongoDB Atlas database for persistent storage, JWT-based authentication, and a Cloudinary-powered media pipeline with secure server-side image lifecycle management.

---

## 2. Tech Stack & Architecture

### 2.1. Frontend

| Layer          | Technology                                                  |
| -------------- | ----------------------------------------------------------- |
| Framework      | React 19                                                    |
| Build Tool     | Vite 8                                                      |
| Language       | TypeScript 6.x                                              |
| Styling        | Tailwind CSS 3.4, PostCSS, Vanilla CSS (`index.css`)        |
| Routing        | React Router DOM v7 (BrowserRouter, nested + legacy routes) |
| Icons          | Lucide React                                                |
| Utilities      | clsx, tailwind-merge                                        |
| Linting        | ESLint 10 (React Hooks + React Refresh plugins)             |

### 2.2. Backend

| Layer         | Technology                                   |
| ------------- | -------------------------------------------- |
| Runtime       | Node.js (ES Modules)                         |
| Framework     | Express 4.19                                 |
| Database      | MongoDB Atlas via Mongoose 8.3               |
| Auth          | JSON Web Tokens (jsonwebtoken 9.x)           |
| Media CDN     | Cloudinary (upload + secure server-side deletion) |
| Dev Tooling   | Nodemon 3.1                                  |

### 2.3. Infrastructure & Configuration

| Concern          | Details                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| Dev Proxy        | Vite `server.proxy` routes `/api/*` → `http://localhost:5000`           |
| Environment      | `.env` (root) + `server/.env` — template provided in `.env.example`    |
| CORS             | Configurable allowed origins via `CORS_ORIGINS` env var                |
| Port Defaults    | Backend: `5000` · Frontend: `5173`                                     |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   BROWSER (Client)                  │
│  React 19 + TypeScript + Vite                       │
│  ┌───────────────┐  ┌─────────────────────────────┐ │
│  │  Public Pages  │  │     Admin Dashboard         │ │
│  │  (Home, Blog,  │  │  (Profile, Slides, Blogs,   │ │
│  │   Research,    │  │   Poetry, Messages, Media)  │ │
│  │   Resources,   │  │                             │ │
│  │   Contact)     │  │  JWT Auth (Access+Refresh)  │ │
│  └───────┬───────┘  └────────────┬────────────────┘ │
│          │                       │                   │
│          │  dataStore.ts         │                   │
│          │  (Cache + Sync)       │                   │
└──────────┼───────────────────────┼───────────────────┘
           │                       │
     Vite Proxy (/api/*)     Vite Proxy (/api/*)
           │                       │
┌──────────▼───────────────────────▼───────────────────┐
│              EXPRESS BACKEND (Port 5000)              │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ Public API   │  │ Auth API     │  │ Protected   │ │
│  │ GET /api/    │  │ POST login   │  │ API (JWT)   │ │
│  │   portfolio  │  │ POST refresh │  │ POST /api/  │ │
│  │ POST /api/   │  │ GET  verify  │  │   portfolio │ │
│  │   messages   │  │              │  │ CRUD msgs   │ │
│  └──────┬───────┘  └──────────────┘  │ POST media/ │ │
│         │                            │   delete    │ │
│         │                            └──────┬──────┘ │
└─────────┼───────────────────────────────────┼────────┘
          │                                   │
          ▼                                   ▼
┌──────────────────┐              ┌────────────────────┐
│  MongoDB Atlas   │              │    Cloudinary CDN   │
│  (Portfolio DB)  │              │  (Image Storage +   │
│  Collections:    │              │   Secure Deletion)  │
│  - profiles      │              │                     │
│  - slides        │              │  SHA-1 Signature    │
│  - blogs         │              │  Auth via Backend   │
│  - poems         │              └────────────────────┘
│  - messages      │
└──────────────────┘
```

---

## 4. Authentication & Security

### 4.1. JWT Token System

| Token           | Purpose                           | Lifetime | Storage          |
| --------------- | --------------------------------- | -------- | ---------------- |
| Access Token    | Authorizes API requests           | 15 min   | `sessionStorage` |
| Refresh Token   | Renews expired access tokens      | 7 days   | `sessionStorage` |

**Flow:**
1. Admin enters passkey → `POST /api/auth/login` validates password and returns both tokens.
2. All protected API calls include `Authorization: Bearer <accessToken>`.
3. On 401 (expired), the client automatically calls `POST /api/auth/refresh` with the refresh token to obtain a new access token — seamlessly and silently.
4. If the refresh token is also expired, the admin is redirected to re-login.

### 4.2. Middleware

- `requireAuth` middleware verifies JWT on all write/delete/admin endpoints.
- Fallback secrets are provided for development, but production should use strong random hex keys.

### 4.3. Image Security (Anti-Scraping)

- **CSS Layer**: All `<img>` elements have `-webkit-user-drag: none`, `user-select: none`, and `pointer-events` restrictions.
- **JS Layer**: Global `dragstart` and `contextmenu` event listeners in `App.tsx` intercept and block drag/right-click on all images site-wide.

---

## 5. Database Schema (MongoDB Atlas)

### 5.1. Collections & Mongoose Models

| Collection   | Model      | Key Fields                                                                                   |
| ------------ | ---------- | --------------------------------------------------------------------------------------------- |
| `profiles`   | `Profile`  | `heroImage`, `name`, `title`, `tagline`, `phone`, `phoneDisplay`, `address`, `socials{}`, `greeting`, `bioParagraphs[]` |
| `slides`     | `Slide`    | `img` (Cloudinary URL), `caption`                                                             |
| `blogs`      | `Blog`     | `id`, `type` (stem/guest), `title`, `meta`, `excerpt`, `link`, `image`, `gradient`, `date`    |
| `poems`      | `Poem`     | `id`, `title`, `meta`, `isHindi`, `isReflection`, `lines[]`, `content`, `quote`, `quoteAuthor`, `date`, `image`, `disclaimer` |
| `messages`   | `Message`  | `id`, `name`, `email`, `subject`, `message`, `date`, `read`                                   |

### 5.2. Auto-Seeding

On first boot, when the `profiles` collection is empty, the backend automatically seeds all collections from the local `src/data/db.json` file. This ensures zero-configuration setup for new deployments.

---

## 6. API Endpoints

### 6.1. Public Endpoints (No Auth Required)

| Method | Endpoint           | Description                              |
| ------ | ------------------ | ---------------------------------------- |
| GET    | `/api/portfolio`   | Retrieve all portfolio data (profile, slides, blogs, poetry) |
| POST   | `/api/messages`    | Submit a new contact form message         |

### 6.2. Authentication Endpoints

| Method | Endpoint             | Description                                     |
| ------ | -------------------- | ----------------------------------------------- |
| POST   | `/api/auth/login`    | Validate admin passkey, return JWT token pair    |
| POST   | `/api/auth/refresh`  | Exchange refresh token for a new access token   |
| GET    | `/api/auth/verify`   | Check if the current access token is still valid|

### 6.3. Protected Endpoints (JWT Required)

| Method | Endpoint                   | Description                                     |
| ------ | -------------------------- | ----------------------------------------------- |
| POST   | `/api/portfolio`           | Save/sync all portfolio data to MongoDB Atlas   |
| GET    | `/api/messages`            | Retrieve all contact messages (admin inbox)     |
| DELETE | `/api/messages/:id`        | Permanently delete a contact message            |
| PUT    | `/api/messages/:id/read`   | Toggle read/unread status of a message          |
| POST   | `/api/media/delete`        | Securely delete image(s) from Cloudinary CDN    |

---

## 7. Media Pipeline (Cloudinary)

### 7.1. Upload (Client-Side)

- Uses Cloudinary's unsigned upload preset via the frontend.
- Configured via `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.
- Uploads go directly from the browser to Cloudinary's API — no backend proxying needed.

### 7.2. Deletion (Server-Side — Secure)

- **Endpoint**: `POST /api/media/delete` (requires JWT auth).
- **Process**:
  1. Client sends the Cloudinary image URL(s) to the backend.
  2. Backend extracts the `public_id` from the URL.
  3. Backend generates a SHA-1 cryptographic signature using `public_id + timestamp + CLOUDINARY_API_SECRET`.
  4. Backend calls Cloudinary's `image/destroy` endpoint with the signed request.
- **API Secret never leaves the server** — fully secure.

### 7.3. Automatic Cleanup Triggers

| Trigger                      | Action                                          |
| ---------------------------- | ----------------------------------------------- |
| Admin replaces profile image | Old profile image deleted from Cloudinary        |
| Admin replaces a slide image | Old slide image deleted from Cloudinary          |
| Admin removes a slide        | That slide's image deleted from Cloudinary       |

---

## 8. Data Layer — `dataStore.ts`

The central state management module provides:

| Feature                       | Description                                                       |
| ----------------------------- | ----------------------------------------------------------------- |
| **In-Memory Cache**           | All data is cached in memory for instant reads across components   |
| **Server Sync**               | Fetches from `/api/portfolio` and `/api/messages` on startup      |
| **Offline Fallback**          | Falls back to `localStorage` if the backend is unreachable        |
| **Event-Driven UI Updates**   | Dispatches `CustomEvent`s to notify all subscribing components    |
| **Auto Token Refresh**        | `authFetch()` wrapper intercepts 401s and silently refreshes JWT  |
| **Subscription API**          | `subscribeToStore()` and `subscribeToMessages()` for reactive UI  |

---

## 9. Site Structure & Pages

### 9.1. Core Pages

| Route                  | Component               | Description                                                         |
| ---------------------- | ----------------------- | ------------------------------------------------------------------- |
| `/`                    | `Home.tsx`              | Landing page — hero section, intro, bio, slideshow carousel, highlights |
| `/contact`             | `Contact.tsx`           | Contact form + social profile links; messages saved to MongoDB       |
| `/internship-diaries`  | `InternshipDiaries.tsx` | Documentation of academic/professional internship experiences        |
| `/publications`        | `Publications.tsx`      | List of published research papers, articles, and conferences         |

### 9.2. Research & Academic Profile (`/research/*`)

| Route                    | Component              | Description                                        |
| ------------------------ | ---------------------- | -------------------------------------------------- |
| `/research`              | `ResearchProfile.tsx`  | Overview of research interests and focus areas      |
| `/research/cv`           | `CV.tsx`               | Detailed academic history, degrees, skills, avatar  |
| `/research/experience`   | `Experience.tsx`       | Timeline of work and teaching experience            |

### 9.3. Blogs (`/blogs/*`)

| Route                     | Component            | Description                                        |
| ------------------------- | -------------------- | -------------------------------------------------- |
| `/blogs`                  | `BlogsIndex.tsx`     | Hub and index for all written content               |
| `/blogs/stem-blogs`       | `StemBlogs.tsx`      | STEM-focused articles (dynamically sourced from DB) |
| `/blogs/guest-posts`      | `GuestPosts.tsx`     | Articles from guest authors (dynamically sourced)   |
| `/blogs/poetry-thoughts`  | `PoetryThoughts.tsx` | Poetry, reflections, translations, quotes from DB   |

### 9.4. Educational Resources (`/resources/*`)

| Route                              | Component               | Description                                     |
| ---------------------------------- | ----------------------- | ----------------------------------------------- |
| `/resources`                       | `ResourcesIndex.tsx`    | Directory of all educational materials           |
| `/resources/integrated-bed-med`    | `IntegratedBedMed.tsx`  | B.Ed-M.Ed program resources, syllabus, notes     |
| `/resources/video-lectures`        | `VideoLectures.tsx`     | Embedded/linked video educational content        |
| `/resources/career-guidance`       | `CareerGuidance.tsx`    | Career development advice and roadmaps           |
| `/resources/edtech-resources`      | `EdtechResources.tsx`   | EdTech tools and guides                          |
| `/resources/teacher-education`     | `TeacherEducation.tsx`  | Pedagogy and teacher training materials           |

### 9.5. Admin Dashboard (`/admin`)

| Component    | Description                                                                   |
| ------------ | ----------------------------------------------------------------------------- |
| `Admin.tsx`  | Full-featured admin panel with tabbed interface for managing all site content  |

**Admin Tabs:**
1. **🙋 Intro Panel & Profile Pic** — Edit greeting, bio paragraphs, upload/replace profile image (Cloudinary).
2. **📇 Contact Info Card** — Name, title, phone, address, and all social profile URLs.
3. **🖼️ Slideshow Carousel** — Add/remove/reorder slides with Cloudinary image upload + auto-cleanup.
4. **🔬 STEM Blogs** — Create, edit, and delete STEM blog entries.
5. **✏️ Guest Posts** — Manage guest author articles.
6. **🪶 Poetry & Thoughts** — Manage poems, reflections, Hindi/English toggle, quotes.
7. **📨 Contact Messages** — View, read/unread toggle, delete contact submissions (with unread badge counter).

### 9.6. Legacy Route Support

All routes have legacy `.html` path aliases (e.g., `/pages/research/cv.html` → `/research/cv`) for backward compatibility with older bookmarks and links.

---

## 10. Reusable Components

| Component          | File                            | Description                                         |
| ------------------ | ------------------------------- | --------------------------------------------------- |
| `Layout`           | `components/layout/Layout.tsx`  | Wrapper with Header + Footer + Outlet               |
| `Header`           | `components/layout/Header.tsx`  | Sticky top header with branding                      |
| `Navbar`           | `components/layout/Navbar.tsx`  | Responsive navigation with dropdown menus            |
| `Footer`           | `components/layout/Footer.tsx`  | Site footer with credits and links                   |
| `Slideshow`        | `components/Slideshow.tsx`      | Infinite image carousel with autoplay + manual controls |
| `LogoPopup`        | `components/LogoPopup.tsx`      | Modal popup for logo/brand interactions              |
| `Placeholder`      | `pages/Placeholder.tsx`         | Fallback 404 page for unmatched routes               |

---

## 11. Environment Configuration

### 11.1. Required Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>

# JWT Secrets (generate: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
JWT_ACCESS_SECRET=<random_hex>
JWT_REFRESH_SECRET=<random_hex>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
APP_PUBLIC_URL=http://localhost:5000

# Admin Passkey
VITE_ADMIN_PASSWORD=<your_admin_password>

# Cloudinary (Upload — public)
VITE_CLOUDINARY_CLOUD_NAME=<your_cloud_name>
VITE_CLOUDINARY_UPLOAD_PRESET=<your_unsigned_preset>

# Cloudinary (Deletion — private, server-only)
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

### 11.2. File Locations

| File             | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `.env`           | Root-level env (Vite reads `VITE_*` vars)    |
| `server/.env`    | Backend server env (all vars including secrets) |
| `.env.example`   | Template for new contributors/deployments     |

---

## 12. Project File Structure

```
Sudhanshu_portfolio/
├── .env                          # Root environment variables
├── .env.example                  # Env template for setup
├── .gitignore
├── index.html                    # Vite entry HTML
├── package.json                  # Frontend dependencies
├── vite.config.ts                # Vite config (proxy, aliases)
├── tailwind.config.ts
├── tsconfig.json
│
├── server/                       # ── Express Backend ──
│   ├── .env                      # Server environment variables
│   ├── package.json              # Backend dependencies
│   ├── index.js                  # Main server: routes, auth, media delete
│   ├── db.js                     # MongoDB Atlas connection
│   └── models.js                 # Mongoose schemas (Profile, Slide, Blog, Poem, Message)
│
├── src/                          # ── React Frontend ──
│   ├── main.tsx                  # App entry point
│   ├── App.tsx                   # Router + global event handlers
│   ├── index.css                 # Global styles + image security CSS
│   ├── App.css                   # App-level styles
│   ├── vite-env.d.ts             # Vite type declarations
│   │
│   ├── lib/
│   │   ├── dataStore.ts          # Central state: cache, sync, auth, subscriptions
│   │   └── utils.ts              # Utility helpers (clsx/cn)
│   │
│   ├── data/
│   │   └── db.json               # Seed data / offline fallback
│   │
│   ├── components/
│   │   ├── Slideshow.tsx          # Infinite carousel
│   │   ├── LogoPopup.tsx          # Logo modal
│   │   └── layout/
│   │       ├── Layout.tsx         # Page wrapper
│   │       ├── Header.tsx         # Sticky header
│   │       ├── Navbar.tsx         # Navigation bar
│   │       └── Footer.tsx         # Footer
│   │
│   └── pages/
│       ├── Home.tsx               # Landing page
│       ├── Contact.tsx            # Contact form
│       ├── Admin.tsx              # Full admin dashboard (85KB)
│       ├── Publications.tsx       # Research publications
│       ├── ResearchProfile.tsx    # Research overview
│       ├── InternshipDiaries.tsx  # Internship logs
│       ├── Placeholder.tsx        # 404 fallback
│       │
│       ├── research/
│       │   ├── CV.tsx             # Curriculum Vitae
│       │   └── Experience.tsx     # Work timeline
│       │
│       ├── blogs/
│       │   ├── BlogsIndex.tsx     # Blog hub
│       │   ├── StemBlogs.tsx      # STEM articles
│       │   ├── GuestPosts.tsx     # Guest authors
│       │   └── PoetryThoughts.tsx # Poetry & reflections
│       │
│       └── resources/
│           ├── ResourcesIndex.tsx      # Resource hub
│           ├── IntegratedBedMed.tsx     # B.Ed-M.Ed notes
│           ├── VideoLectures.tsx       # Video content
│           ├── CareerGuidance.tsx      # Career advice
│           ├── EdtechResources.tsx     # EdTech tools
│           └── TeacherEducation.tsx    # Teacher training
│
└── dist/                         # Production build output
```

---

## 13. How to Run Locally

### Step 1: Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### Step 2: Configure Environment

Copy `.env.example` to both `.env` (root) and `server/.env`, then fill in your real credentials (MongoDB URI, JWT secrets, Cloudinary keys, admin password).

### Step 3: Start the Backend

```bash
cd server
node index.js
```
> On first boot, auto-seeding will populate MongoDB Atlas from `db.json`.

### Step 4: Start the Frontend

```bash
npm run dev
```
> Visit `http://localhost:5173`

### Step 5: Access Admin

Navigate to `/admin` and enter your admin passkey.

---

## 14. Build for Production

```bash
npm run build
```

Output is generated in the `dist/` folder. The Express backend should be deployed separately (e.g., on Render, Railway, or a VPS) with the same environment variables.

---

## 15. Key Design Decisions

| Decision                        | Rationale                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------- |
| In-memory cache + server sync   | Instant page loads; no loading spinners; eventual consistency with MongoDB     |
| JWT access + refresh tokens     | Short-lived access tokens minimize exposure; refresh tokens provide UX        |
| Cloudinary unsigned upload      | Simple client-side uploads without proxying; no backend bottleneck            |
| Cloudinary signed deletion      | API secret never exposed to browser; server computes SHA-1 signatures          |
| Auto-seeding from `db.json`     | Zero-config first run; new deployments work immediately                        |
| Legacy `.html` route aliases    | Backward compatibility with old bookmarks/search engine indices               |
| `localStorage` offline fallback | Site remains functional even when the backend is temporarily unreachable       |

---

## 16. Future Considerations

- [ ] **Code Splitting**: Dynamic `import()` to reduce the 718KB main bundle size.
- [ ] **SEO Enhancement**: React Helmet / meta tags for search engine visibility.
- [ ] **Dark/Light Mode Toggle**: System-aware theme switching.
- [ ] **Analytics Dashboard**: Page view tracking to identify popular resources and blogs.
- [ ] **Rate Limiting**: Express rate limiting on public endpoints (`/api/messages`).
- [ ] **Image Optimization**: Cloudinary transformations (auto-format, quality, resize) for faster page loads.
- [ ] **CI/CD Pipeline**: GitHub Actions for automated builds, tests, and deployment.
- [ ] **Multi-Admin Support**: Role-based access with multiple admin accounts stored in MongoDB.
- [ ] **Email Notifications**: Notify admin via email when new contact messages arrive.
- [ ] **Rich Text Editor**: WYSIWYG editor for blog and poetry content in the admin panel.