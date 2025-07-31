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
- **Backend:** Go (Vercel Serverless Functions), GORM
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
6. **Push Database Schema:** Apply the local schema to your remote database. If you encounter issues, ensure your remote database is empty or use `supabase db reset` (CAUTION: this deletes all data) or `supabase db pull` to resync your local migration history.

    ```bash
    supabase db push --yes
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

## Feature: User Profile (View & Edit)

**Goal:** Users can view their own profile (full name, username, etc.) on the dashboard and edit their profile information.

### Frontend (`apps/frontend`) - Next.js:

*   **Profile Display (Dashboard):**
    *   Create UI components to display user profile information (full name, username, avatar, etc.) on the `/dashboard` page.
    *   Fetch user profile data from the backend API when the dashboard page loads.
    *   Handle loading and error states when fetching profile data.
*   **Edit Profile Form:**
    *   Create a UI form on the `/dashboard` page (or a separate page like `/settings/profile`) that allows users to edit their full name, username, and other profile fields.
    *   Validate form input on the client-side.
    *   Submit updated profile data to the backend API.
    *   Handle loading and error states when submitting data.
    *   Provide feedback to the user after successful or failed updates.
*   **Authentication Integration:**
    *   Ensure only authenticated users can view and edit their profiles.
    *   Use Supabase authentication tokens to secure requests to the backend API.

### Backend (`apps/backend`) - Go:

*   **`Profile` Model:**
    *   Ensure the `models.Profile` model aligns with the `profiles` table schema in Supabase (ID, username, full_name, avatar_url, etc.).
*   **API Endpoint for Fetching Profile:**
    *   Create an API endpoint (`GET /api/profile` or `GET /api/profiles/:id`) to retrieve user profile data based on user ID or authentication token.
    *   Implement logic to fetch data from the database using GORM.
    *   Secure this endpoint so only authenticated users can access it (JWT verification from Supabase).
*   **API Endpoint for Updating Profile:**
    *   Create an API endpoint (`PUT /api/profile` or `PUT /api/profiles/:id`) to update user profile data.
    *   Implement logic to update data in the database using GORM.
    *   Validate input received from the frontend.
    *   Secure this endpoint so only authenticated users can update their own profile.
*   **Authentication Integration:**
    *   Implement middleware or logic in the backend to verify JWT tokens received from the frontend for all protected profile endpoints.
    *   Extract user ID from the JWT token to ensure users can only access or modify their own profile.

## CI/CD & Deployment

This project uses GitHub Actions for CI/CD.

### GitHub Actions Secrets

Ensure the following secrets are configured in your GitHub repository (`Settings > Secrets and variables > Actions`):

- `VERCEL_TOKEN`: Your Vercel API Token.
- `VERCEL_ORG_ID`: Your Vercel Organization ID.
- `VERCEL_PROJECT_ID`: Your Vercel Project ID.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.

### Backend Deployment to Vercel (Serverless Functions)

The Go backend has been refactored into Vercel serverless functions located in `apps/backend/api/`. These functions are deployed alongside the Next.js frontend as part of the main Vercel project. The `vercel.json` file in the project root configures the routing and building of these Go functions.

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
