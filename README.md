# 🌿 TaskMint

> A modern micro-task marketplace where workers earn coins by completing tasks and buyers post tasks to get things done — fast.

---

## 📌 Overview

**TaskMint** is a full-stack micro-task marketplace built with **Next.js 16 (App Router)** and **React 19**. It features a coin-based economy:

- 🛒 **Buyers** post tasks, pay coins, and review worker submissions.
- 🔨 **Workers** browse tasks, submit work, and withdraw earned coins.
- 🛡️ **Admins** manage the entire platform — users, tasks, withdrawals, and upgrade requests.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.5 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Auth | Firebase (Google Sign-In) |
| HTTP Client | Axios |
| Server State | TanStack Query v5 |
| Forms | React Hook Form v7 |
| Charts | Recharts |
| Fonts | Merriweather (body + headings, Google Fonts) |
| Animation | tw-animate-css |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd task_mint
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
task_mint/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.js          # Root layout (fonts + QueryProvider)
│   │   ├── page.jsx           # Landing / Home page
│   │   ├── globals.css        # Global styles + Tailwind tokens
│   │   ├── login/             # /login
│   │   ├── register/          # /register
│   │   ├── profile/           # /profile
│   │   ├── tasks/             # Public task marketplace
│   │   └── dashboard/         # Protected dashboard
│   │       ├── buyer/         # Buyer pages
│   │       ├── worker/        # Worker pages
│   │       └── admin/         # Admin pages
│   │
│   ├── components/
│   │   ├── ui/                # Primitive UI (Button, Card, Input, Dialog…)
│   │   ├── dashboard/         # Shared dashboard widgets
│   │   ├── home/              # Landing page sections
│   │   ├── navbar/            # Top navigation
│   │   ├── footer/            # Footer
│   │   ├── auth/              # Login / register forms
│   │   ├── buyer/             # Buyer-specific components
│   │   ├── worker/            # Worker-specific components
│   │   └── admin/             # Admin-specific components
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useUser.js         # Primary auth hook
│   │   ├── useRequireRole.js  # Route-level role guard
│   │   ├── useAxiosSecure.js  # Secure HTTP client + usePostData
│   │   └── ...
│   │
│   ├── lib/                   # Utilities & singletons
│   │   ├── firebase.js        # Firebase init
│   │   ├── axios.js           # axiosPublic + axiosSecure
│   │   └── ...
│   │
│   ├── services/              # API service modules
│   ├── providers/             # React context providers
│   ├── store/                 # Lightweight client state
│   └── config/                # App-wide config
│
├── .env
├── next.config.mjs
├── jsconfig.json              # @/ alias -> src/
└── package.json
```

---

## 👥 User Roles

| Role | Default | Capabilities |
|---|---|---|
| `WORKER` | ✅ Yes | Browse tasks, submit work, request coins withdrawal, upgrade to Buyer |
| `BUYER` | ❌ No | Post tasks, purchase coins, review submissions |
| `ADMIN` | ❌ No | Manage all users, tasks, withdrawals, and role upgrade requests |

> **Role is always stored UPPERCASE** in the backend and normalized on the frontend via `useUser()`.

---

## 🔑 Authentication

Authentication is handled exclusively via **Firebase Google Sign-In**:

1. User clicks "Sign in with Google" → Firebase popup opens.
2. Firebase returns user profile (email, name, photo).
3. Frontend POSTs to `POST /auth/google` (backend).
4. Backend returns a **JWT token**.
5. Token is stored in `localStorage` as `"access-token"`.
6. `useUser()` hook reads the token reactively via `useSyncExternalStore` and fetches full user data from `GET /auth/me`.

---

## 🌐 Key API Endpoints

```
POST /auth/google      — Google login / register
GET  /auth/me          — Get current user profile
POST /auth/logout      — Logout

GET  /tasks            — List all tasks
POST /tasks            — Create task (BUYER)
GET  /tasks/:id        — Task details

POST /submissions      — Submit a task (WORKER)
GET  /submissions      — List submissions

GET  /users            — List users (ADMIN)
PATCH /users/:id       — Update user (ADMIN)

POST /payments         — Purchase coins
GET  /payments/history — Payment history

POST /withdrawals      — Request withdrawal (WORKER)
PATCH /withdrawals/:id — Approve/reject (ADMIN)
```

---

## 🎨 Styling

- **Tailwind CSS v4** — no `tailwind.config.js`; configured via `postcss.config.mjs`.
- **Semantic CSS tokens** in `globals.css`: `bg-surface`, `bg-card`, `border-border`, `text-primary`, `text-muted-foreground`.
- **Fonts**: `font-merriweather` (used for both body and display/headings).
- Dark-mode aware — always use semantic tokens, never hardcode colors like `bg-white`.

---

## 🧩 Key Hooks

```js
// Get current user, role, auth state
const { user, role, isLoggedIn, isLoading, logout } = useUser();

// Protect a page by role
const { isAuthorized } = useRequireRole("BUYER");
// or multiple:
const { isAuthorized } = useRequireRole(["ADMIN", "BUYER"]);

// Authenticated HTTP calls
const axios = useAxiosSecure();
const data = await axios.get("/tasks");

// POST mutation helper
const { postData, isPending } = usePostData();
await postData("/tasks", taskPayload);
```

---

## 📦 Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

---

## 🚫 Important Conventions

- Use **App Router only** — no `next/router`, no `getServerSideProps`.
- Never create new Axios instances — always import from `@/lib/axios`.
- Never duplicate auth logic — always use `useUser()`.
- Always add `"use client"` for components using hooks or browser APIs.
- Always use design token classes — never hardcode hex/rgb colors.
- Always protect dashboard pages with `useRequireRole()`.

---

## 🌍 Deployment

Deploy easily on [Vercel](https://vercel.com):

1. Push your code to GitHub.
2. Import the repository on Vercel.
3. Add all environment variables from `.env` in the Vercel dashboard.
4. Deploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📄 License

This project is private. All rights reserved.
