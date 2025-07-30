# Cirqle - Open Socmed

A full-stack social media platform built with a Turborepo monorepo, Next.js, Go, and Supabase.

## Overview

This project is a monorepo containing:

- `apps/frontend`: A Next.js web application for the user-facing social media experience.
- `apps/backend`: A Go API that serves data to the frontend.
- `packages/ui`: A shared React component library.

## Tech Stack

- **Monorepo:** Turborepo & npm Workspaces
- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Query, Supabase Auth
- **Backend:** Go, Gin, GORM
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (Frontend), GitHub Actions (CI/CD)

---

## Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v22.17.0 or later)
- [Go](https://go.dev/) (v1.23 or later)
- [npm](https://www.npmjs.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 2. Clone & Install

Clone the repository and install all dependencies from the root directory.

```bash
git clone https://github.com/agaaaptr/open-socmed.git
cd open-socmed
npm install
```

### 3. Supabase Project Setup

1.  **Create a Project:** Go to [supabase.com](https://supabase.com), create a new project, and save your database password.
2.  **Login to Supabase CLI:**
    ```bash
    supabase login
    ```
    Follow the browser prompts to authorize.
3.  **Link Project:** In the root of your local repository, link it to your remote Supabase project. Replace `<project-ref>` with your project's reference ID (found in your Supabase project's URL).
    ```bash
    supabase link --project-ref <project-ref>
    ```
    Enter your database password when prompted.
4.  **Push Database Schema:** Apply the local schema to your remote database.
    ```bash
    supabase db push
    ```

### 4. Environment Variables

Create `.env` files in both the `apps/frontend` and `apps/backend` directories.

**File: `apps/frontend/.env`**

Copy your project's API credentials from your Supabase Dashboard (`Project Settings > API`).

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

**File: `apps/backend/.env`**

Use the database connection string from your Supabase Dashboard (`Project Settings > Database`). **Use the connection string with connection pooling.** Replace `[YOUR-PASSWORD]` with your actual database password.

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.<your-project-ref>.supabase.co:6543/postgres
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

## CI/CD & Deployment

This project uses GitHub Actions for CI/CD.

### Branching Strategy

- **`master` branch:** Used for production deployments. The CI/CD pipeline will lint, build, and deploy the frontend to Vercel.
- **`develop` branch:** Used for active development. The CI/CD pipeline will only perform linting and building.

### GitHub Actions Secrets

Ensure the following secrets are configured in your GitHub repository (`Settings > Secrets and variables > Actions`):

- `VERCEL_TOKEN`: Your Vercel API Token.
- `VERCEL_ORG_ID`: Your Vercel Organization ID.
- `VERCEL_PROJECT_ID`: Your Vercel Project ID.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
