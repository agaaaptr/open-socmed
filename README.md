# Cirqle - Open Socmed

A full-stack social media platform built with a Turborepo monorepo, Next.js, Go, and Supabase.

## Overview

This project is a monorepo containing:

- `apps/frontend`: A Next.js web application for the user-facing social media experience.
- `apps/backend`: A Go API that serves data to the frontend.
- `packages/ui`: A shared React component library.

## Tech Stack

- **Monorepo:** Turborepo & npm Workspaces
- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Query, Supabase (for Auth - *currently disabled*)
- **Backend:** Go, Gin, GORM
- **Database:** Supabase (PostgreSQL)

---

## Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v22.17.0 or later)
- [Go](https://go.dev/) (v1.22 or later)
- [npm](https://www.npmjs.com/)

### 2. Clone & Install

Clone the repository and install all dependencies from the root directory.

```bash
git clone https://github.com/yourusername/open-socmed.git
cd open-socmed
npm install
```

### 3. Supabase Setup (For Full Integration)

To enable full Supabase integration (database and authentication), you will need a Supabase project.

1.  **Create a Project:** Go to [supabase.com](https://supabase.com) and create a new project.
2.  **Run the Schema:** In your Supabase project's SQL Editor, run the entire script from `supabase_schema.sql` (located in the project root). This will create the necessary tables and configure Row Level Security (RLS) policies.
3.  **Get Credentials:**
    -   **API URL & Anon Key:** Find these in `Project Settings > API`.
    -   **Database Connection String:** Find this in `Project Settings > Database`.
4.  **Configure OAuth (Google):**
    -   Navigate to `Authentication` > `Providers` in your Supabase dashboard.
    -   Enable the `Google` provider and provide your Google Cloud Console Client ID and Client Secret.
    -   Add your Vercel deployment URL (e.g., `https://your-app.vercel.app/auth/callback`) as a Redirect URI.

### 4. Environment Variables

Copy the `.env.example` files to `.env.local` in both the `apps/frontend` and `apps/backend` directories.

**File: `apps/frontend/.env.local`**
```
# These are currently not used by the frontend as Supabase integration is temporarily disabled.
# Uncomment and fill with your actual Supabase credentials when backend integration is ready.
# NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

**File: `apps/backend/.env.local`**
```
# Make sure to use the connection string for a session pool
DATABASE_URL=YOUR_SUPABASE_DATABASE_CONNECTION_STRING
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

## CI/CD & Deployment

This project uses GitHub Actions for CI/CD.

### Branching Strategy

- **`master` branch:** Used for production deployments. CI/CD pipeline (`.github/workflows/ci-cd.yml`) will lint, build, and deploy the frontend to Vercel.
- **`develop` branch:** Used for active development. CI/CD pipeline (`.github/workflows/ci-cd-develop.yml`) will only perform linting, building, and testing.

### GitHub Actions Secrets

Ensure the following secrets are configured in your GitHub repository (`Settings > Secrets and variables > Actions`):

- `VERCEL_TOKEN`: Your Vercel API Token.
- `VERCEL_ORG_ID`: Your Vercel Organization ID.
- `VERCEL_PROJECT_ID`: Your Vercel Project ID.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL (for Vercel environment variables).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key (for Vercel environment variables).

### Deployment Flow

- Pushing to the `master` branch triggers the CI/CD pipeline for production deployment.
- Pushing to the `develop` branch triggers the CI/CD pipeline for linting, building, and testing only.
- Supabase schema deployment and backend deployment are currently disabled in the CI/CD pipeline.

## Local Development on `develop` Branch

When working on the `develop` branch, you will primarily run the applications locally to test your changes.

1.  **Switch to `develop` branch:**
    ```bash
    git checkout develop
    ```
2.  **Install dependencies (if you haven't recently):**
    ```bash
    npm install
    ```
3.  **Run Linting:**
    ```bash
    npx turbo lint
    ```
4.  **Run Build:**
    ```bash
    npx turbo build
    ```
5.  **Run Tests (if configured):**
    ```bash
    # If you have test scripts defined in your package.json files
    # npx turbo test
    ```
6.  **Run the applications locally:**
    ```bash
    npm run dev
    ```
    This will start the frontend on `http://localhost:3000` and the backend on `http://localhost:8080`.

Once your changes are stable on `develop` and have been thoroughly tested locally, you can create a Pull Request from `develop` to `master` to initiate the production deployment.