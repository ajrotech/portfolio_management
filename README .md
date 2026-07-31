# Portfolio Management System

> Full Stack Development Internship — Week 03

A dynamic, multi-tenant portfolio management web application built with **Next.js 16**, **TypeScript**, **Prisma ORM**, and **shadcn/ui**. Users can create accounts, manage their profiles and projects through a Creator Dashboard, and share a unique public portfolio URL.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Component Architecture](#component-architecture)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [Design Patterns](#design-patterns)
- [Deliverables](#deliverables)

---

## Features

### Creator Dashboard
- **Authentication** — Register with email/username/password, sign in, sign out
- **Profile Management** — Edit bio, avatar, job title, location, social links (website, GitHub, LinkedIn, Twitter), and skills
- **Project CRUD** — Add, edit, and delete portfolio projects with title, description, live demo URL, repository URL, tech tags, media URLs, and featured flag
- **Drag-to-Reorder** — Reorder projects via drag and drop using `@dnd-kit` with optimistic updates and transactional persistence
- **Tabbed Interface** — Switch between Projects and Profile Settings within the dashboard

### Public Portfolio View
- **Unique URLs** — Each user gets a shareable portfolio at `/portfolio/:username`
- **Responsive Grid** — Two-column grid on desktop, single-column on mobile
- **Featured Projects** — Highlighted section for pinned/featured work
- **Loading Skeletons** — Perceived-performance skeleton states during data fetch
- **Error Handling** — Clear 404 page for non-existent portfolios
- **Owner Detection** — "Edit Dashboard" button shown when viewing your own portfolio

### Landing Page
- Portfolio search by `@username`
- Feature overview cards
- Quick-access sign in / registration

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|--------|
| Framework | **Next.js 16** (App Router) | Full-stack React with server API routes |
| Language | **TypeScript 5** | End-to-end type safety |
| Database | **SQLite** via **Prisma ORM** | Lightweight relational database |
| Styling | **Tailwind CSS 4** + **shadcn/ui** | Utility-first CSS + accessible components |
| State | **Zustand** | Client-side navigation and auth state |
| Drag & Drop | **@dnd-kit/core** + **@dnd-kit/sortable** | Accessible project reordering |
| Icons | **Lucide React** | Consistent, tree-shakeable icon set |
| Animations | **Framer Motion** | Page transitions and micro-interactions |
| Password | **Node.js crypto** (SHA-256) | Demo-grade password hashing with salt |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Main entry — client-side view router
│   ├── layout.tsx                        # Root layout with fonts and toaster
│   ├── globals.css                       # Global Tailwind styles
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts             # POST — Email/password authentication
│       │   ├── register/route.ts          # POST — Account creation + auto-profile
│       │   └── session/route.ts           # GET  — Session validation
│       └── portfolio/
│           ├── [username]/route.ts        # GET  — Public portfolio data
│           ├── profile/route.ts          # PUT  — Update profile (upsert)
│           └── projects/
│               ├── route.ts              # GET  — List projects
│               │                          # POST — Create project
│               ├── [id]/route.ts         # PUT  — Update project
│               │                          # DELETE — Delete project
│               └── reorder/route.ts      # PUT  — Bulk reorder (transaction)
├── components/
│   ├── portfolio/
│   │   ├── LandingView.tsx               # Public landing page with search
│   │   ├── AuthForms.tsx                 # LoginForm + RegisterForm
│   │   ├── DashboardViews.tsx            # CreatorDashboard + ProfileEditForm + ProjectForm + ProjectsManager
│   │   ├── PublicProfileView.tsx         # Public read-only portfolio display
│   │   ├── ProjectCard.tsx               # Reusable project card component
│   │   ├── ProfileHeader.tsx             # Reusable profile header with social links
│   │   └── SkillTag.tsx                  # Reusable SkillTag + SkillTagList badges
│   └── ui/                               # shadcn/ui component library (30+ components)
├── store/
│   └── useStore.ts                       # Zustand store (auth, navigation, data)
├── types/
│   └── portfolio.ts                      # TypeScript interfaces
├── lib/
│   ├── db.ts                             # Prisma client singleton
│   ├── utils.ts                          # cn() utility for class merging
│   └── crypto.ts                         # Password hash/verify helpers
scripts/
├── seed.ts                              # Database seeder with demo data
└── generate-doc.ts                      # Documentation DOCX generator
prisma/
└── schema.prisma                        # Database schema (User, Profile, Project)
db/
└── custom.db                           # SQLite database file
```

---

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Client (Browser)                       │
│                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Zustand    │  │  React       │  │  shadcn/ui +     │  │
│  │  Store      │  │  Components  │  │  Tailwind CSS    │  │
│  │  (auth,     │  │  (views,     │  │  (styling,       │  │
│  │   routing,  │  │   cards,     │  │   layout,        │  │
│  │   data)     │  │   forms)     │  │   responsive)    │  │
│  └──────┬──────┘  └──────┬───────┘  └──────────────────┘  │
│         │                │                                   │
└─────────┼────────────────┼───────────────────────────────────┘
          │  fetch()       │
          ▼                ▼
┌──────────────────────────────────────────────────────────┐
│              Next.js API Routes (Server)                   │
│                                                           │
│  /api/auth/*           /api/portfolio/*                   │
│  ├─ POST /register     ├─ GET /:username (public)          │
│  ├─ POST /login        ├─ PUT /profile (auth)              │
│  └─ GET  /session      ├─ POST /projects (auth)            │
│                        ├─ PUT  /projects/:id (auth)        │
│                        ├─ DELETE /projects/:id (auth)      │
│                        └─ PUT  /projects/reorder (auth)    │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│                   Prisma ORM (Type-Safe)                   │
│                     SQLite Database                         │
│                                                           │
│  ┌────────┐    1:1    ┌─────────┐   1:N   ┌─────────┐     │
│  │  User  │──────────│ Profile │─────────│ Project │     │
│  └────────┘          └─────────┘          └─────────┘     │
└──────────────────────────────────────────────────────────┘
```

### Multi-Tenant Design

The system implements a **multi-tenant architecture** where each user's data is scoped through a chain of relationships: `User → Profile → Projects`. All authenticated API endpoints verify ownership by looking up the user's profile and confirming the requested resource belongs to it. This prevents cross-tenant data access without requiring complex role-based authorization.

### Client-Side Routing

Since the deployment environment exposes a single `/` route, the application implements **client-side view switching** via Zustand state. The `viewMode` state value determines which top-level view component is rendered:

| viewMode | Component | Auth | Description |
|----------|-----------|------|-------------|
| `landing` | `LandingView` | No | Public landing with search |
| `login` | `LoginForm` | No | Sign in form |
| `register` | `RegisterForm` | No | Account creation form |
| `dashboard` | `CreatorDashboard` | Yes | Management interface |
| `public-profile` | `PublicProfileView` | No | Read-only portfolio display |

---

## Database Schema

### Entity Relationship

```
User (1) ──── (1) Profile (1) ──── (N) Project
```

### User Model — Authentication

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID auto-generated | Unique identifier |
| `email` | String | Unique, required | Login email |
| `username` | String | Unique, required | Public handle for portfolio URL |
| `name` | String? | Optional | Display name |
| `password` | String | Required | SHA-256 hashed password |
| `createdAt` | DateTime | Auto | Account creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

### Profile Model — Portfolio Data

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | String | CUID | Unique identifier |
| `userId` | String | — | FK → User.id (unique, cascade delete) |
| `bio` | String | `""` | Profile biography |
| `avatarUrl` | String | `""` | Profile picture URL |
| `title` | String | `""` | Job title / role |
| `location` | String | `""` | Geographic location |
| `website` | String | `""` | Personal website URL |
| `github` | String | `""` | GitHub profile URL |
| `linkedin` | String | `""` | LinkedIn profile URL |
| `twitter` | String | `""` | Twitter/X profile URL |
| `skills` | String | `"[]"` | JSON array of skill strings |

### Project Model — Portfolio Items

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | String | CUID | Unique identifier |
| `profileId` | String | — | FK → Profile.id (cascade delete) |
| `title` | String | — | Project name (required) |
| `description` | String | `""` | Project description |
| `link` | String | `""` | Live demo URL |
| `repoUrl` | String | `""` | Source code repository URL |
| `techTags` | String | `"[]"` | JSON array of technology tag strings |
| `mediaUrls` | String | `"[]"` | JSON array of media/screenshot URLs |
| `order` | Int | `0` | Position for drag-to-reorder |
| `featured` | Boolean | `false` | Whether project is featured |

> **Note:** Array fields (`skills`, `techTags`, `mediaUrls`) are stored as JSON strings to maintain SQLite scalar-type compatibility while supporting flexible, variable-length collections.

---

## API Documentation

### Authentication

All authenticated endpoints require the `x-user-id` header. After login, the client stores the user ID in Zustand state and includes it in every mutating request.

---

#### `POST /api/auth/register`

Create a new account and auto-initialize an empty profile.

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "name": "John Doe",
  "password": "password123"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | Yes | Valid email format, unique |
| `username` | string | Yes | 3–30 chars, alphanumeric + `_`, unique |
| `name` | string | No | Display name |
| `password` | string | Yes | Min 6 characters |

**Response `201`:**

```json
{ "message": "Account created successfully", "user": { "id": "...", "email": "user@example.com", "username": "johndoe", "name": "John Doe" } }
```

**Errors:** `400` (validation), `409` (email/username taken), `500`

---

#### `POST /api/auth/login`

Authenticate with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`:**

```json
{ "user": { "id": "...", "email": "user@example.com", "username": "johndoe", "name": "John Doe" } }
```

**Errors:** `400` (missing fields), `401` (invalid credentials), `500`

---

#### `GET /api/auth/session`

Validate session (check if user ID is valid).

**Headers:** `x-user-id: <user_id>`

**Response `200`:**

```json
{ "user": { "id": "...", "email": "...", "username": "...", "name": "..." } }
```

---

### Portfolio

---

#### `GET /api/portfolio/:username`

Fetch public-facing portfolio data. **No authentication required.**

**Response `200`:**

```json
{
  "user": {
    "id": "...",
    "username": "johndoe",
    "name": "John Doe",
    "email": "",
    "profile": {
      "id": "...", "bio": "...", "avatarUrl": "...",
      "title": "Senior Full Stack Developer", "location": "San Francisco, CA",
      "website": "https://johndoe.dev", "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe", "twitter": "https://twitter.com/johndoe",
      "skills": ["React", "Next.js", "TypeScript", "Prisma"]
    },
    "projects": [
      {
        "id": "...", "profileId": "...", "title": "CloudSync Dashboard",
        "description": "A real-time cloud monitoring dashboard...",
        "link": "https://cloudsync.demo", "repoUrl": "https://github.com/johndoe/cloudsync",
        "techTags": ["React", "WebSocket", "D3.js"], "mediaUrls": [],
        "order": 0, "featured": true,
        "createdAt": "2026-07-31T07:01:15.969Z", "updatedAt": "2026-07-31T07:01:15.969Z"
      }
    ]
  }
}
```

**Errors:** `404` (username not found), `500`

---

#### `PUT /api/portfolio/profile`

Update or create the authenticated user's profile (upsert).

**Headers:** `x-user-id: <user_id>`

**Request Body:**

```json
{
  "bio": "Full Stack Developer...",
  "avatarUrl": "https://example.com/avatar.jpg",
  "title": "Senior Developer",
  "location": "San Francisco, CA",
  "website": "https://mysite.com",
  "github": "https://github.com/user",
  "linkedin": "https://linkedin.com/in/user",
  "twitter": "https://twitter.com/user",
  "skills": ["React", "TypeScript", "Node.js"]
}
```

> All fields are optional — only provided fields are updated. `skills` accepts either a JSON array or a comma-separated string.

**Response `200`:** Returns the updated profile with `skills` parsed as an array.

**Errors:** `401`, `500`

---

#### `POST /api/portfolio/projects`

Create a new project. Auto-assigns the next `order` position.

**Headers:** `x-user-id: <user_id>`

**Request Body:**

```json
{
  "title": "My Awesome Project",
  "description": "A project that does X, Y, Z...",
  "link": "https://myproject.live",
  "repoUrl": "https://github.com/user/myproject",
  "techTags": "React, TypeScript, Prisma",
  "mediaUrls": "https://screenshot1.png, https://screenshot2.png",
  "featured": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | **Yes** | Project name |
| `description` | string | No | Project description |
| `link` | string | No | Live demo URL |
| `repoUrl` | string | No | Repository URL |
| `techTags` | string | No | Comma-separated tech tags |
| `mediaUrls` | string | No | Comma-separated media URLs |
| `featured` | boolean | No | Featured flag (default: `false`) |

**Response `201`:** Returns the created project with parsed arrays.

**Errors:** `400` (missing title), `401`, `500`

---

#### `PUT /api/portfolio/projects/:id`

Update an existing project (partial update). Ownership verified.

**Headers:** `x-user-id: <user_id>`

Same request body fields as `POST` — only provided fields are updated.

**Response `200`:** Returns the updated project.
**Errors:** `401`, `404` (not found or not yours), `500`

---

#### `DELETE /api/portfolio/projects/:id`

Permanently delete a project. Ownership verified.

**Headers:** `x-user-id: <user_id>`

**Response `200`:** `{ "message": "Project deleted" }`
**Errors:** `401`, `404`, `500`

---

#### `PUT /api/portfolio/projects/reorder`

Bulk-reorder projects in a single database transaction.

**Headers:** `x-user-id: <user_id>`

**Request Body:**

```json
{
  "projectIds": [
    { "id": "project_1_id", "order": 0 },
    { "id": "project_2_id", "order": 1 },
    { "id": "project_3_id", "order": 2 }
  ]
}
```

**Response `200`:** `{ "message": "Projects reordered successfully" }`
**Errors:** `400`, `401`, `404`, `500`

---

## Component Architecture

### Reusable Components (used across multiple views)

| Component | File | Props | Purpose |
|-----------|------|-------|---------|
| `ProjectCard` | `SkillTag.tsx` | `project`, `showActions?`, `onEdit?`, `onDelete?` | Displays project with tech tags, links, featured badge, and optional edit/delete actions |
| `SkillTag` | `SkillTag.tsx` | `label`, `variant?`, `className?` | Single technology badge |
| `SkillTagList` | `SkillTag.tsx` | `skills`, `maxDisplay?`, `className?` | Badge list with "+N more" truncation |
| `ProfileHeader` | `ProfileHeader.tsx` | `username`, `name`, `profile`, `isOwner?`, `onEditProfile?` | Avatar, name, title, bio, social links, skill badges |

### View Components (one per view mode)

| Component | File | Description |
|-----------|------|-------------|
| `LandingView` | `LandingView.tsx` | Public landing page with search, CTAs, and feature cards |
| `LoginForm` | `AuthForms.tsx` | Email/password sign-in with validation |
| `RegisterForm` | `AuthForms.tsx` | Account creation with username/email/password validation |
| `CreatorDashboard` | `DashboardViews.tsx` | Tabbed dashboard shell (Projects + Settings) with nav |
| `ProfileEditForm` | `DashboardViews.tsx` | Profile editing form with all fields |
| `ProjectForm` | `DashboardViews.tsx` | Add/edit project form with all fields + featured toggle |
| `ProjectsManager` | `DashboardViews.tsx` | Project list with drag-to-reorder and CRUD actions |
| `SortableProjectItem` | `DashboardViews.tsx` | `@dnd-kit` sortable wrapper around `ProjectCard` |
| `PublicProfileView` | `PublicProfileView.tsx` | Read-only portfolio with loading/error states |

---

## Getting Started

### Prerequisites

- **Node.js** v18+ or **Bun** v1.0+
- **Git** v2+

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd portfolio-management-system

# 2. Install dependencies
bun install

# 3. Push the database schema
bun run db:push

# 4. (Optional) Seed demo data
bun run scripts/seed.ts

# 5. Start the development server
bun run dev
```

The app will be available at **http://localhost:3000**.

### Environment Variables

Only one variable is required (pre-configured in `.env`):

```
DATABASE_URL="file:./db/custom.db"
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server (port 3000) |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push schema changes to SQLite |
| `bun run db:generate` | Regenerate Prisma Client |
| `bun run db:migrate` | Run Prisma migrations |
| `bun run scripts/seed.ts` | Seed database with demo data |

---

## Demo Accounts

| Username | Email | Password | Projects |
|----------|-------|----------|----------|
| `johndoe` | john@example.com | `password123` | 5 projects (2 featured) |
| `janedev` | jane@example.com | `password123` | 2 projects (1 featured) |

---

## Design Patterns

### 1. Ownership-Based Access Control

Every authenticated API endpoint follows the same verification pattern:

1. Extract `x-user-id` from headers
2. Look up the user's profile via the `userId` → `Profile` relationship
3. Verify the target resource belongs to that profile
4. Proceed or return `404`

This prevents cross-tenant data access without complex RBAC.

### 2. Optimistic Drag-to-Reorder

The reorder flow uses an optimistic update pattern:

1. User drags a project → `@dnd-kit` fires `onDragEnd`
2. Local state is immediately updated with `arrayMove()` for instant visual feedback
3. A bulk `PUT /api/portfolio/projects/reorder` request is sent
4. On failure, local state is reverted to the previous order

### 3. Prop-Driven Component Reuse

`ProjectCard` is used in both the **Public Profile View** (read-only, no actions) and the **Creator Dashboard** (with edit/delete actions) by toggling the `showActions` prop. The same component is also wrapped in `SortableProjectItem` for drag-to-reorder in the dashboard, demonstrating three usage modes from a single reusable component.

### 4. JSON Serialization for SQLite Arrays

Since SQLite does not natively support array types, collection fields (`skills`, `techTags`, `mediaUrls`) are stored as JSON strings. The API layer handles parsing on read (`JSON.parse()`) and serialization on write (`JSON.stringify()`), providing a clean array interface to the frontend while maintaining database compatibility.

### 5. Client-Side View Router

A Zustand `viewMode` state field drives a switch statement in `page.tsx`, rendering the appropriate view component. This pattern was adopted because the deployment exposes only the `/` route, making Next.js file-based routing impractical. The store also carries auth state and portfolio data, providing a single source of truth for the entire client application.

---

## Deliverables

| Deliverable | Status | Description |
|-------------|--------|-------------|
| Working Application | Done | Live preview with all features functional |
| Documentation | Done | `Portfolio_Management_System_Documentation.docx` (architecture, API specs, setup guide) |
| README | Done | This file — complete project reference |
