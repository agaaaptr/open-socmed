# Cirqle - Open Socmed

A full-stack social media platform built with a Turborepo monorepo, Next.js, Go, and Supabase.

## Overview

This project is a monorepo containing:

- `apps/frontend`: A Next.js web application for the user-facing social media experience, featuring a modern, interactive UI.
- `apps/backend`: A Go API that serves data to the frontend, including serverless functions for authentication.
- `packages/ui`: A shared React component library.

## Key Features & Improvements

- **Modern & Consistent UI/UX:** A complete visual overhaul with a dark/charcoal theme and a vibrant teal (`#00FFDE`) accent, utilizing glassmorphism effects and fluid animations powered by Framer Motion.
- **Flexible Authentication:** Users can now sign in using either their email or username, with robust client-side validation for all authentication forms.
- **User Profile Display:** Authenticated users can view their `full_name` and `username` on the dashboard.
- **Database Integrity:** The `profiles` table now enforces a unique constraint on the `username` column.

## Tech Stack

- **Monorepo:** Turborepo & npm Workspaces
- **Frontend:** Next.js, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Query, Supabase Auth
- **Backend:** Go (Vercel Serverless Functions), GORM, supabase-go
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (Frontend & Backend Serverless Functions), GitHub Actions (CI/CD)

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

1. **Create a Project:** Go to [supabase.com](https://supabase.com), create a new project, and save your database password.
2. **Configure Site URL:** In your Supabase Dashboard, navigate to **Authentication** > **URL Configuration**. Set **Site URL** to `http://localhost:3000`. For production, add your Vercel deployment URL to **Redirect URLs**.
3. **Enable Email Confirmation:** In your Supabase Dashboard, navigate to **Authentication** > **Providers** > **Email**. Ensure **"Confirm email"** is enabled.
4. **Login to Supabase CLI:**

    ```bash
    supabase login
    ```

    Follow the browser prompts to authorize.
5. **Link Project:** In the root of your local repository, link it to your remote Supabase project. Replace `<project-ref>` with your project's reference ID (found in your Supabase project's URL).

    ```bash
    supabase link --project-ref <project-ref>
    ```

    Enter your database password when prompted.
6. **Push Database Schema:** Apply the local schema to your remote database. This command is crucial for applying any schema changes (e.g., new tables, columns, constraints) defined in your `supabase/migrations` directory.

    ```bash
    supabase db push --yes
    ```

    *Note: If you encounter issues with `supabase db push` related to database password or connection, ensure your `SUPABASE_ACCESS_TOKEN` environment variable is set (after `supabase login`) and that you provide the correct database password when prompted or via the `PGPASSWORD` environment variable (e.g., `PGPASSWORD=YourDbPassword supabase db push --yes`). If you need to reset your local database state to match remote, use `supabase db reset` (CAUTION: this deletes all data) or `supabase db pull` to resync your local migration history.*

7. **Generate New Migrations (for schema changes):** If you make changes to your local `supabase_schema.sql` or directly in your Supabase dashboard and want to capture them as a migration, use:

    ```bash
    supabase migration new <migration_name>
    ```

    Then, copy the relevant SQL from `supabase_schema.sql` or write your changes directly into the newly created migration file (`supabase/migrations/<timestamp>_<migration_name>.sql`). Remember to `supabase db push` after creating new migrations.

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
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> # Required for backend operations like resolving usernames
```

### Important Note on Supabase Service Role Key

The `SUPABASE_SERVICE_ROLE_KEY` is a powerful key that grants full access to your Supabase database, bypassing Row Level Security (RLS). It is used by the backend serverless functions (e.g., `/api/auth/signin`) for operations that require elevated privileges, such as querying user profiles by username. **This key must NEVER be exposed to the client-side (frontend).** Ensure it is only used in secure server-side environments (like Vercel's serverless functions) and managed as a secret environment variable.

### 5. Run the Development Servers

To run the frontend and backend serverless functions locally, use the Vercel CLI from the root directory:

```bash
vercel dev
```

This will start:

- The Next.js frontend on `http://localhost:3000`
- The Go backend serverless functions, accessible via `http://localhost:3000/api/...`

---

## Monorepo Commands

From the root directory:

- `npm run dev`: (No longer directly used for local development, use `vercel dev` instead)
- `npm run build`: Builds all apps for production.
- `npm run lint`: Lints all code in the monorepo.

## CI/CD & Deployment

This project uses GitHub Actions for CI/CD.

### GitHub Actions Secrets

Ensure the following secrets are configured in your GitHub repository (`Settings > Secrets and variables > Actions`):

- `VERCEL_TOKEN`: Your Vercel API Token.
- `VERCEL_ORG_ID`: Your Vercel Organization ID.
- `VERCEL_PROJECT_ID`: Your Vercel Project ID.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (for backend serverless functions).

### Backend Deployment to Vercel (Serverless Functions)

The Go backend has been refactored into Vercel serverless functions located in `apps/backend/api/`. These functions are deployed alongside the Next.js frontend as part of the main Vercel project. The `vercel.json` file in the project root configures the routing and building of these Go functions.

## Collaboration

### Supabase Database Synchronization

When collaborating on database schema changes, it's crucial to keep your local Supabase CLI and the remote database in sync. Follow these steps:

1. **Pull Latest Changes:** Before making any schema changes, always pull the latest migrations from the remote repository.

    ```bash
    git pull origin develop # or master, depending on your branch
    ```

2. **Generate New Migration (for schema changes):** If you make changes to `supabase_schema.sql` or directly in your Supabase dashboard, generate a new migration file.

    ```bash
    supabase migration new <migration_name>
    ```

    Then, copy the relevant SQL from `supabase_schema.sql` or write your changes directly into the newly created migration file (`supabase/migrations/<timestamp>_<migration_name>.sql`).
3. **Push Migrations to Remote:** After creating and verifying your local migrations, push them to the remote Supabase database.

    ```bash
    supabase db push --yes
    ```

    *Note: Ensure you have your `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` set as environment variables or provided directly in the command.* If you encounter issues, try `supabase db reset` (CAUTION: this deletes all data) or `supabase db pull` to resync your local migration history.

### Environment Variables

- **Local Development:** Each developer should have their own `.env` files in `apps/frontend/` and `apps/backend/` with their respective Supabase credentials.
- **CI/CD:** Supabase credentials for CI/CD are managed as GitHub Secrets (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Do NOT commit `.env` files to the repository.

### Code Style & Linting

- Always run `npm run lint` and `npm run format` before committing to ensure code consistency.

### Branching Strategy

- Follow the `develop`/`master` branching strategy as outlined in the `README.md`.
- Create feature branches from `develop` for new features or bug fixes.
- Submit Pull Requests to `develop` for review.

## Lessons Learned

This project has provided valuable insights into monorepo management, Vercel deployment, and Go serverless functions:

- **Monorepo `npm run dev` Issues (`ENOWORKSPACES`):**
  - The `npm error code ENOWORKSPACES` often arises when `npm`'s workspace logic conflicts with how a tool (like `next dev`) expects to be run. Solutions involve ensuring the tool is run in the correct context (e.g., directly from the sub-package's directory, or using `npx` if the tool is a local dependency).
  - For `vercel dev`, the issue was resolved by ensuring the Vercel project's root directory was correctly configured in the Vercel dashboard, and `vercel.json` explicitly defined the frontend build with `src` pointing to `apps/frontend/package.json`.

- **Vercel `vercel.json` Configuration for Monorepos:**
  - When `vercel.json` is present at the monorepo root, it becomes the single source of truth for Vercel's build and routing. All applications (frontend and backend functions) must be explicitly defined within its `builds` and `rewrites` sections.
  - The `root` property in `builds` is not allowed for Vercel's `@vercel/next` builder when the project's root directory is already set to the monorepo root in the Vercel dashboard.
  - `rewrites` are crucial for directing traffic to the correct application within the monorepo (e.g., `/api/*` to backend functions, `/(.*)` to the frontend).

- **Go Backend Refactoring to Vercel Serverless Functions:**
  - Migrating a traditional Go web framework (like Gin) to Vercel serverless functions requires significant architectural changes. Each API endpoint needs to be refactored into a separate Go function that adheres to Vercel's serverless function signature (`http.HandlerFunc`).
  - `go.mod` and `go.sum` need to be cleaned up to remove unused dependencies (e.g., Gin).
  - Local development of these functions is best done using `vercel dev` from the monorepo root, which simulates the Vercel environment.

- **CI/CD Streamlining:**
  - For Vercel deployments, a separate backend deployment job in GitHub Actions is often unnecessary if the backend is refactored into Vercel serverless functions. Vercel handles the build and deployment of these functions as part of the main project deployment.
  - Keeping CI/CD configurations clean and focused improves maintainability and clarity.
