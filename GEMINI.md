# Gemini Project Context: open-socmed

*Note: This file is for internal project tracking and Gemini CLI context.*

## 1. Project Overview

`open-socmed` is a full-stack social media platform built as a monorepo using Turborepo. It consists of a Next.js frontend, a Go backend API, and a shared UI component library.

### Monorepo Structure:
- **`apps/frontend`**: The frontend application built with Next.js (TypeScript).
- **`apps/backend`**: The backend API built with Go (Gin, GORM).
- **`packages/ui`**: A shared library for React/Tailwind components.

## 2. Technologies Used

### Core Monorepo:
- **Turborepo**: For monorepo management and optimized build caching.
- **npm Workspaces**: For managing dependencies across packages.
- **TypeScript**: For type safety across JavaScript/React projects.
- **ESLint & Prettier**: For code linting and formatting.
- **dotenv-cli**: For managing environment variables in scripts.

### Frontend (`apps/frontend`):
- **Framework**: Next.js (TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Data Fetching**: React Query
- **Authentication**: Supabase Auth

### Backend (`apps/backend`):
- **Language**: Go
- **Web Framework**: Gin
- **ORM**: GORM (for PostgreSQL)
- **Database**: Supabase PostgreSQL (via `DATABASE_URL`)

### Database & CI/CD:
- **Supabase**: Provides PostgreSQL database, Authentication, and Realtime capabilities.
- **Supabase CLI**: Used for local development and schema migrations.
- **GitHub Actions**: For Continuous Integration and Deployment.
- **Vercel**: For frontend hosting.

## 3. Development Plan & Checkpoints

This project is developed in structured stages to ensure organized progress.

### 3.1. Core Infrastructure & Configuration

* [x] **Checkpoint 1.1: Initial Monorepo & App Setup (Completed)**
* [x] **Checkpoint 1.2: Project Restructuring & Initial Fixes (Completed)**
* [x] **Checkpoint 1.3: Supabase Project Integration (Completed)**
  * [x] Created and linked remote Supabase project.
  * [x] Configured `.env` files for both `frontend` and `backend` with actual credentials.
  * [x] Pushed initial `supabase_schema.sql` to the remote database.
  * [x] Troubleshot and resolved database connection issues (`failed SASL auth`).
* [x] **Checkpoint 1.4: Build & CI/CD Configuration (Completed)**
  * [x] Fixed backend Go module paths (`go.mod`, `main.go`, etc.).
  * [x] Fixed frontend build failure by using `dotenv-cli` to load environment variables during `next build`.
  * [x] Configured `develop` and `master` branch pipelines in GitHub Actions.
* [x] **Checkpoint 1.5: Documentation Update (Completed)**
  * [x] Updated `README.md` with accurate, step-by-step setup instructions.
  * [x] Updated `GEMINI.md` to reflect the current project state.

### 3.2. Frontend Development Plan

* [x] **Checkpoint 2.1: Landing Page & Auth UI (Completed)**
  * [x] Redesigned `apps/frontend/app/page.tsx` as a modern landing page.
  * [x] Separated sign-in and sign-up into their own pages.
  * [x] Changed brand name to "Cirqle" and updated metadata.
* [x] **Checkpoint 2.2: Authentication Logic (Completed)**
  * [x] Re-enabled Supabase authentication logic in login, signup, and home pages.
  * [x] Implemented form-based signup with `username` and `full_name`.
  * [x] Removed Google OAuth integration.
  * [x] Created protected `/dashboard` route.
  * [x] Configured redirects after login/signup.
* [ ] **Checkpoint 2.3: Frontend Title and Icon (Planned)**
  * [ ] **To Do:** Add favicon and other app icons to `apps/frontend/public/` directory.
* [ ] **Checkpoint 2.4: Frontend Core Feature Implementation (Next Steps)**
  * [ ] **User Profile Display:** Display user's `full_name` and `username` on the dashboard.
  * [ ] **Post Creation UI:** Create a form for users to create new posts.
  * [ ] **Post List Display:** Display a list of posts from other users.
  * [ ] **Basic Post Interaction:** Implement like/comment buttons (UI only for now).
  * [ ] **Responsive Design:** Ensure all pages are responsive across devices.
  * [ ] **Error Handling & Feedback:** Improve user feedback for authentication and data operations.

### 3.3. Backend Development Plan

* [x] **Checkpoint 3.1: Backend Core Feature Implementation (Next Steps)**
  * [x] Renamed `users` model/controller to `profiles` to match database schema.
  * [ ] **User Profile API:** Implement API endpoints for fetching user profiles (e.g., `/api/profiles/:id` or `/api/profile`).
  * [ ] **Post CRUD API:** Implement API endpoints for creating, reading, updating, and deleting posts.
  * [ ] **Authentication Integration:** Ensure backend APIs are protected and integrate with Supabase authentication (e.g., verifying JWT tokens).
  * [ ] **Database Interaction:** Implement GORM models and queries for `posts`, `comments`, `likes`, and `follows` tables.
* [ ] **Checkpoint 3.2: Backend Deployment Optimization (Planned)**
  * [ ] Containerize Go API (Docker) for easier deployment.
  * [ ] Configure `apps/backend` deployment to a cloud provider (e.g., Render, Fly.io).

## 4. Current Known Issues

### Frontend (`apps/frontend`)
- **No known issues.** The `npm run dev` command now runs successfully.

### Backend (`apps/backend`)
- **No known issues.** The `ERROR: relation "profiles" already exists` warning has been addressed by removing `db.AutoMigrate` from `main.go`.

## 5. Next Steps: Troubleshooting & Development

### For Frontend Developers
- **Implement User Profile Display:** Display user's `full_name` and `username` on the dashboard.
- **Develop Post Creation UI:** Create the user interface for creating new posts.

### For Backend Developers
- **Implement User Profile API:** Create API endpoints in the Go backend to fetch user profile data from the `profiles` table.
- **Implement Post CRUD API:** Develop API endpoints for creating, reading, updating, and deleting posts.
- **Integrate Authentication:** Implement middleware or logic in the backend to verify JWT tokens from Supabase for protected API routes.

## 6. Commit Rules (Semantic Commits)

All commits in this project **must** adhere to the Semantic Commit Messages standards to maintain a clean and readable Git history. Each commit message must follow the format:

```
<type>(<scope>): <subject>
```

**Type (Type of Change):**

- **feat**: A new feature.
- **fix**: A bug fix.
- **docs**: Documentation changes.
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **perf**: A code change that improves performance.
- **test**: Adding missing tests or correcting existing tests.
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation.

**Scope (Scope of Change):**

The scope can be the name of the component or part of the project affected. Examples: `frontend`, `backend`, `ui`, `config`, `build`, `docs`, `monorepo`, `supabase`, `auth`, `post`, `profile`.

**Subject (Commit Title):**

A brief description of the change in imperative mood (e.g., "add" not "adding").

**Example Commit Messages:**

- `feat(auth): implement form-based signup and login`
- `fix(frontend): resolve build error by loading env vars`
- `docs(readme): update setup instructions`
- `chore(monorepo): configure turborepo pipeline`
- `test(web): add unit tests for Button component`
- `feat(post): add API endpoint for creating posts`

## 7. Session Rules

At the end of each session, the agent must:

- Update knowledge, detailed information, and checkpoint updates informatively in the `GEMINI.md` file.
- Update `README.md` with the latest project conditions.
- Always offer to commit and push to the repository.

## 8. Collaboration Guidelines

### 8.1. Supabase Database Synchronization

When collaborating on database schema changes, it's crucial to keep your local Supabase CLI and the remote database in sync. Follow these steps:

1.  **Pull Latest Changes:** Before making any schema changes, always pull the latest migrations from the remote repository.
    ```bash
    git pull origin develop # or master, depending on your branch
    ```
2.  **Generate New Migration (for schema changes):** If you make changes to `supabase_schema.sql` or directly in your Supabase dashboard, generate a new migration file.
    ```bash
    supabase migration new <migration_name>
    ```
    Then, copy the relevant SQL from `supabase_schema.sql` or write your changes directly into the newly created migration file (`supabase/migrations/<timestamp>_<migration_name>.sql`).
3.  **Push Migrations to Remote:** After creating and verifying your local migrations, push them to the remote Supabase database.
    ```bash
    supabase db push --yes
    ```
    *Note: Ensure you have your `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` set as environment variables or provided directly in the command.* If you encounter issues, try `supabase db reset` (CAUTION: this deletes all data) or `supabase db pull` to resync your local migration history.

### 8.2. Environment Variables

- **Local Development:** Each developer should have their own `.env` files in `apps/frontend/` and `apps/backend/` with their respective Supabase credentials.
- **CI/CD:** Supabase credentials for CI/CD are managed as GitHub Secrets (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Do NOT commit `.env` files to the repository.

### 8.3. Code Style & Linting

- Always run `npm run lint` and `npm run format` before committing to ensure code consistency.

### 8.4. Branching Strategy

- Follow the `develop`/`master` branching strategy as outlined in the `README.md`.
- Create feature branches from `develop` for new features or bug fixes.
- Submit Pull Requests to `develop` for review.