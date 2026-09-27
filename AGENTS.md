<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# 🌿 TaskMint — Full Project Overview

> **Read this file before touching any code.** It is the single source of truth for how this project is structured, what conventions to follow, and where everything lives.

---

## 📌 What is TaskMint?

**TaskMint** is a micro-task marketplace web application where:

- **Buyers** post tasks and pay coins to have them completed.
- **Workers** browse, complete, and submit tasks in exchange for coins.
- **Admins** manage users, approve/reject submissions, handle withdrawals, and oversee the platform.

The app uses a **coin-based economy**: buyers purchase coins with real money; workers earn coins by completing tasks and can withdraw them.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16.3.5** (App Router) |
| React | **React 19** |
| Styling | **Tailwind CSS v4** |
| Icons | **Lucide React** |
| Auth | **Firebase** (Google Sign-In only) |
| HTTP Client | **Axios** (public + secured instances) |
| Server State | **TanStack Query v5** (`@tanstack/react-query`) |
| Forms | **React Hook Form v7** |
| Charts | **Recharts** |
| Fonts | `Merriweather` (body + headings) via `next/font/google` |
| Animation | `tw-animate-css` |

> No NextAuth, no Zustand, no Redux. Auth state is managed by `useUser` + localStorage JWT. Do NOT add conflicting auth libraries.

---

## 📁 Project Directory Structure

```
task_mint/
├── public/                         # Static assets
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.js               # Root layout — fonts, QueryProvider
│   │   ├── page.jsx                # Landing/Home page
│   │   ├── globals.css             # Global styles + Tailwind CSS tokens
│   │   ├── not-found.jsx           # 404 page
│   │   ├── login/                  # /login route
│   │   ├── register/               # /register route
│   │   ├── profile/                # /profile route
│   │   ├── tasks/                  # /tasks (public task marketplace)
│   │   └── dashboard/              # Protected dashboard area
│   │       ├── layout.js           # Dashboard layout — sidebar + mobile drawer
│   │       ├── page.js             # /dashboard → redirects by role
│   │       ├── buyer/              # Buyer-only pages
│   │       │   ├── page.js         # Buyer dashboard overview
│   │       │   ├── add-task/       # Post a new task
│   │       │   ├── my-tasks/       # View own tasks + submissions
│   │       │   ├── payment-history/
│   │       │   ├── purchase-coins/ # Buy coins via payment
│   │       │   └── review/         # Review worker submissions
│   │       ├── worker/             # Worker-only pages
│   │       │   ├── page.js         # Worker dashboard overview
│   │       │   ├── tasks/          # Browse available tasks
│   │       │   ├── submissions/    # My submissions
│   │       │   ├── withdrawals/    # Request coin withdrawal
│   │       │   └── upgrade/        # Upgrade to Buyer role
│   │       └── admin/              # Admin-only pages
│   │           ├── page.js         # Admin dashboard overview
│   │           ├── users/          # Manage all users
│   │           ├── tasks/          # Manage all tasks
│   │           ├── withdrawals/    # Approve/reject withdrawals
│   │           └── role-requests/  # Handle worker->buyer upgrade requests
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── ui/                     # Primitive / design-system components
│   │   │   ├── Alert.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Dialog.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Label.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Sheet.jsx           # Slide-out drawer (mobile sidebar)
│   │   │   ├── Slider.jsx
│   │   │   ├── Table.jsx
│   │   │   └── Textarea.jsx
│   │   ├── dashboard/              # Shared dashboard building blocks
│   │   │   ├── Sidebar.jsx         # Role-aware navigation sidebar
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── DataTable.jsx       # Reusable table with sort/filter
│   │   │   ├── Pagination.jsx      # Page controls
│   │   │   ├── StatCard.jsx        # KPI metric card
│   │   │   ├── StatusBadge.jsx     # Colored status pill
│   │   │   └── NotificationPanel.jsx
│   │   ├── home/                   # Landing page sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── StatsBar.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── TopWorkers.jsx
│   │   │   ├── FeaturedTasks.jsx
│   │   │   ├── TrustSection.jsx
│   │   │   ├── EarningsCalculator.jsx
│   │   │   ├── Testimonial.jsx
│   │   │   └── FinalCTA.jsx
│   │   ├── navbar/                 # Top navigation bar
│   │   ├── footer/                 # Footer
│   │   ├── auth/                   # Login / register forms
│   │   ├── buyer/                  # Buyer-specific components
│   │   ├── worker/                 # Worker-specific components
│   │   │   └── TaskMarketplaceCard.jsx
│   │   ├── admin/                  # Admin-specific components
│   │   ├── tasks/                  # Task browsing/detail components
│   │   ├── brand/                  # Logo, brand assets
│   │   ├── common/                 # Misc shared components
│   │   └── notifications/          # Notification UI
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useUser.js              # Primary auth hook (JWT + /auth/me)
│   │   ├── useAuth.js              # Thin alias for useUser
│   │   ├── useRole.js              # Returns current role string
│   │   ├── useRequireRole.js       # Route-level role guard + redirect
│   │   ├── useAxiosSecure.js       # axiosSecure instance + usePostData mutation
│   │   ├── useNotifications.js     # Notification state
│   │   └── usePagination.js        # Pagination state helper
│   │
│   ├── lib/                        # Pure utilities & config singletons
│   │   ├── firebase.js             # Firebase app + GoogleAuthProvider export
│   │   ├── axios.js                # axiosPublic + axiosSecure instances
│   │   ├── avatar.js               # Avatar URL helper
│   │   ├── imageUtils.js           # Image resize / upload helpers
│   │   ├── dashboardData.js        # Mock/seed data for dashboard charts
│   │   ├── constants.js            # App-wide constants (currently empty)
│   │   └── utils.js                # General utility functions
│   │
│   ├── services/                   # Backend API call modules
│   │   ├── api.js                  # Base API config
│   │   ├── authService.js          # loginWithGoogle() — Firebase -> backend
│   │   ├── taskService.js          # Task CRUD
│   │   ├── userService.js          # User profile updates
│   │   ├── paymentService.js       # Coin purchase
│   │   ├── submissionService.js    # Task submissions
│   │   └── withdrawalService.js    # Coin withdrawals
│   │
│   ├── providers/
│   │   ├── QueryProvider.jsx       # TanStack Query client wrapper
│   │   ├── AuthProvider.js         # (thin/empty — auth is in useUser)
│   │   └── ThemeProvider.js        # (thin/placeholder)
│   │
│   ├── store/                      # Lightweight client state
│   │   ├── authStore.js
│   │   ├── userStore.js
│   │   └── notificationStore.js
│   │
│   └── config/
│       └── siteConfig.js           # Site name, URLs, misc config
│
├── .env                            # Environment variables (see below)
├── next.config.mjs
├── jsconfig.json                   # Path aliases (@/ -> src/)
└── package.json
```

---

## 🔑 Authentication Flow

```
User clicks "Sign in with Google"
        |
        v
Firebase popup (GoogleAuthProvider)
        |  returns fbUser (email, displayName, photoURL)
        v
POST /auth/google  <- axiosPublic
        |  payload: { email, fullName, photoUrl, role }
        v
Backend returns JWT token
        |
        v
localStorage.setItem("access-token", token)
window.dispatchEvent("auth-change")
        |
        v
useUser() picks up token via useSyncExternalStore
GET /auth/me  <- axiosSecure (Bearer token in Authorization header)
        |
        v
user object available everywhere via useUser()
```

### Auth Rules
- **All auth state lives in `useUser`** — never duplicate auth logic.
- Token is stored in `localStorage` as `"access-token"` (also checked at `"token"` and `"accessToken"` for compatibility).
- JWT is decoded client-side as a **fallback** while `/auth/me` loads.
- On 401/403, localStorage tokens are automatically cleared.
- `logout()` calls `POST /auth/logout` + clears localStorage + invalidates query cache.

---

## 👥 User Roles

| Role | Description |
|---|---|
| `WORKER` | Default role. Browses and completes tasks. Can request upgrade. |
| `BUYER` | Posts tasks, pays coins, reviews submissions. |
| `ADMIN` | Full platform management. Approves withdrawals, manages users. |

- Role is always stored **UPPERCASE** in the backend and normalized via `useUser`.
- `/dashboard` auto-redirects to `/dashboard/worker`, `/dashboard/buyer`, or `/dashboard/admin` based on `user.role`.
- Page-level protection uses `useRequireRole(["BUYER"])` — it redirects unauthenticated users to `/login` and wrong-role users to `/dashboard`.

---

## 🌐 API & HTTP Clients

Two Axios instances live in `src/lib/axios.js`:

| Instance | Usage |
|---|---|
| `axiosPublic` | Unauthenticated requests (login, register) |
| `axiosSecure` | Authenticated requests — auto-attaches `Bearer <token>` from localStorage |

- Base URL is read from `NEXT_PUBLIC_SERVER_URL` env var (defaults to `http://localhost:5000`).
- Both instances use `withCredentials: true` for cookie support.

### Key Backend Endpoints (known)
```
POST /auth/google      — Google login / register
GET  /auth/me          — Get current user profile
POST /auth/logout      — Invalidate session

GET  /tasks            — List tasks
POST /tasks            — Create task (BUYER)
GET  /tasks/:id        — Task details

POST /submissions      — Submit task (WORKER)
GET  /submissions      — List submissions

GET  /users            — List users (ADMIN)
PATCH /users/:id       — Update user (ADMIN)

POST /payments         — Purchase coins
GET  /payments/history — Payment history

POST /withdrawals      — Request withdrawal (WORKER)
GET  /withdrawals      — List withdrawals
PATCH /withdrawals/:id — Approve/reject (ADMIN)
```

---

## 🪝 Key Hooks — Quick Reference

### `useUser()` — `src/hooks/useUser.js`
The **primary auth hook**. Returns everything about the logged-in user.
```js
const {
  user,          // full user object or null
  token,         // JWT string or null
  role,          // "WORKER" | "BUYER" | "ADMIN" | null
  isAdmin,       // boolean
  isBuyer,       // boolean
  isWorker,      // boolean
  isLoggedIn,    // boolean
  isLoading,     // boolean — true only while loading AND no fallback user
  isFetching,    // boolean — true during any refetch
  hasRole,       // (roles: string | string[]) => boolean
  updateUser,    // (partial) => void — optimistic update
  logout,        // () => Promise<void>
  refetch,       // () => void
} = useUser();
```

### `useRequireRole(roles, options)` — `src/hooks/useRequireRole.js`
Guards a page. Auto-redirects if not logged in or wrong role.
```js
const { user, isAuthorized, isLoading } = useRequireRole("BUYER");
// or multiple roles:
const { isAuthorized } = useRequireRole(["ADMIN", "BUYER"]);
```

### `useAxiosSecure()` — `src/hooks/useAxiosSecure.js`
Returns the `axiosSecure` instance directly.
```js
const axios = useAxiosSecure();
const data = await axios.get("/tasks");
```

### `usePostData(endpoint?, options?)` — `src/hooks/useAxiosSecure.js`
TanStack mutation helper for POST requests.
```js
const { postData, isPending } = usePostData();
await postData("/tasks", taskPayload);

// Or with a predefined endpoint:
const { postData } = usePostData("/submissions");
await postData(submissionPayload);
```

---

## 🎨 Styling Conventions

- **Tailwind CSS v4** — utility-first, no separate `tailwind.config.js`.
- **CSS custom properties** for design tokens (defined in `globals.css`): `--color-primary`, `--color-surface`, `--color-border`, `--color-card`, `--color-muted-foreground`, etc.
- Use semantic token classes: `bg-surface`, `bg-card`, `border-border`, `text-muted-foreground`, `text-primary`.
- **Fonts**: `font-merriweather` (used for both body and display/headings).
- Dark mode aware — use semantic tokens, avoid hardcoded colors like `bg-white` or `text-black`.
- `tw-animate-css` is available for entrance animations.

---

## 🧩 Component Conventions

1. **All components are `.jsx`** (except hooks/lib/services which are `.js`).
2. **"use client"** directive required for any component using hooks, state, or browser APIs.
3. Server Components (no directive) for purely static rendering.
4. Import paths use **`@/`** alias which resolves to `src/`.
5. Primitive UI in `src/components/ui/` — always prefer these over raw HTML elements.
6. Dashboard components in `src/components/dashboard/` — shared across all roles.

---

## 🔒 Environment Variables

Defined in `.env`. Required variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_SERVER_URL=http://localhost:5000
# or:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## ⚡ Dev Commands

```bash
npm run dev     # Start development server (next dev)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

---

## 🚫 What NOT to Do

- Do NOT use `next/router` (Pages Router) — this is **App Router only**.
- Do NOT use `getServerSideProps` / `getStaticProps` — use Server Components or TanStack Query.
- Do NOT import from `react-dom/server` or wrap pages in manual providers — `QueryProvider` is in the root layout.
- Do NOT add Zustand, Redux, or any new auth library — auth is in `useUser`.
- Do NOT hardcode color values — use CSS token classes.
- Do NOT create new Axios instances — use `axiosPublic` or `axiosSecure` from `@/lib/axios`.
- Do NOT use `localStorage` directly for auth tokens — `useUser` handles it reactively.

---

## ✅ Task Checklist for Any New Feature

1. **Identify the role** — is this for WORKER, BUYER, ADMIN, or all?
2. **Check the route** — does the page exist? Where in `src/app/dashboard/` does it go?
3. **Use `useRequireRole`** — protect every dashboard page.
4. **Use `useUser`** — get user data; never re-implement auth.
5. **Use `axiosSecure` / `usePostData`** — for authenticated API calls.
6. **Use design tokens** — `bg-surface`, `border-border`, etc.
7. **Reuse UI primitives** — `Button`, `Card`, `Input`, `DataTable`, `Pagination`, `StatCard` from `@/components/ui` and `@/components/dashboard`.
8. **Add "use client"** — if the component uses hooks or browser APIs.
