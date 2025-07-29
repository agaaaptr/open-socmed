# open-socmed

A full-stack social media platform built with a Turborepo monorepo, Next.js, Go, and Supabase.

## Overview

This project is a monorepo containing:

- `apps/frontend`: A Next.js web application for the user-facing social media experience.
- `apps/backend`: A Go API that serves data to the frontend.
- `packages/ui`: A shared React component library.

## Tech Stack

- **Monorepo:** Turborepo & npm Workspaces
- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Query, Supabase (for Auth)
- **Backend:** Go, Gin, GORM
- **Database:** Supabase (PostgreSQL)

---

## Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Go](https://go.dev/) (v1.22 or later)
- [npm](https://www.npmjs.com/)

### 2. Clone & Install

Clone the repository and install all dependencies from the root directory.

```bash
git clone https://github.com/yourusername/open-socmed.git
cd open-socmed
npm install
```

### 3. Supabase Setup

You need a Supabase project to handle the database and authentication.

1.  **Create a Project:** Go to [supabase.com](https://supabase.com) and create a new project.
2.  **Run the Schema:** In your Supabase project's SQL Editor, run the entire script from `supabase_schema.sql` (located in the project root). This will create the necessary tables and policies.
3.  **Get Credentials:**
    -   **API URL & Anon Key:** Find these in `Project Settings > API`.
    -   **Database Connection String:** Find this in `Project Settings > Database`.

### 4. Environment Variables

Copy the `.env.example` files to `.env.local` in both the `apps/frontend` and `apps/backend` directories.

**File: `apps/frontend/.env.local`**
```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

**File: `apps/backend/.env.local`**
```
# Make sure to use the connection string for a session pool
DATABASE_URL=YOUR_DATABASE_CONNECTION_STRING
PORT=8080
```

### 5. Run the Development Servers

Run the frontend and backend applications concurrently using Turborepo from the root directory.

```bash
npm run dev
```

This will start:
- The Next.js frontend on `http://localhost:3000`
- The Go backend on `http://localhost:8080`

---

## Monorepo Commands

From the root directory:

- `npm run dev`: Starts all apps in development mode.
- `npm run build`: Builds all apps for production.
- `npm run lint`: Lints all code in the monorepo.
- `npm run format`: Formats all code with Prettier.