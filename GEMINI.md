# Gemini Project Context: open-socmed

*Note: This file is for internal project tracking and Gemini CLI context.*

## 1. Project Overview

`open-socmed` is a full-stack social media platform built as a monorepo using Turborepo. It consists of a Next.js frontend, a Go backend API, and a shared UI component library.

### Monorepo Structure

- **`apps/frontend`**: The frontend application built with Next.js (TypeScript).
- **`apps/backend`**: The backend API built with Go (Gin, GORM).
- **`packages/ui`**: A shared library for React/Tailwind components.

## 2. Technologies Used

### Core Monorepo

- **Turborepo**: For monorepo management and optimized build caching.
- **npm Workspaces**: For managing dependencies across packages.
- **TypeScript**: For type safety across JavaScript/React projects.
- **ESLint & Prettier**: For code linting and formatting.

### Frontend (`apps/frontend`)

- **Framework**: Next.js (TypeScript) - Configured for SSR/SSG.
- **Styling**: Tailwind CSS.
- **UI Components**: Headless UI.
- **Data Fetching**: React Query.
- **Authentication**: Supabase Auth.

### Backend (`apps/backend`)

- **Language**: Go.
- **Web Framework**: Gin.
- **ORM**: GORM (for PostgreSQL).
- **Database**: Supabase PostgreSQL (via `DATABASE_URL`).

### Shared UI (`packages/ui`)

- **Components**: React components styled with Tailwind CSS.

### Database

- **Supabase**: Provides PostgreSQL database, Authentication, and Realtime capabilities.

## 3. Development Plan & Checkpoints

This project will be developed in structured stages to ensure organized progress.

- [x] **Checkpoint 1: Monorepo Initialization & Basic Structure (Completed)**

- [x] **Checkpoint 2: Frontend (`apps/frontend`) Setup (Completed)**

- [x] **Checkpoint 3: Backend (`apps/backend`) Setup (Completed)**

- [x] **Checkpoint 4: Shared UI (`packages/ui`) Setup (Completed)**

- [x] **Checkpoint 5: Project Restructuring & Repair (Completed)**
  - [x] **Backend: Fix Compilation & Structure**
    - [x] Removed duplicate `main()` function in `apps/backend/main.go`.
    - [x] Restructured backend into `models` and `controllers` directories.
    - [x] Added `godotenv` to manage environment variables.
    - [x] Cleaned up invalid dependencies in `go.mod`.
  - [x] **Frontend: Fix Authentication Flow**
    - [x] Created a `...` to handle the OAuth callback.
  - [x] **DX & Documentation**
    - [x] Created `.env.example` files for both `frontend` and `backend`.
    - [x] Updated `README.md` with clearer setup and run instructions.
  - [x] **Configuration: Shared Tooling**
    - [x] Added `dotenv-cli` for loading `.env` files in development.

- [x] **Checkpoint 6: Supabase Schema & RLS (Completed)**

- [x] **Checkpoint 7: Turborepo Pipeline Configuration (Completed)**

- [x] **Checkpoint 8: GitHub Actions CI/CD (Completed)**
  - [x] Consolidated `ci.yml` and `deploy.yml` into a single `ci-cd.yml`.
  - [x] Configured separate build and deploy jobs for frontend and backend.
  - [x] Set up triggers for `push` and `pull_request` on `master` branch.
  - [x] Added `supabase_schema_deploy` job to automatically push schema on `master` branch pushes.
  - [x] Temporarily disabled `supabase_schema_deploy` and `backend_deploy` jobs in `ci-cd.yml`.
  - [x] Fixed YAML syntax error in `ci-cd.yml` (`needs: []` removed).
  - [x] Corrected Vercel deployment command in `ci-cd.yml` to use `vercel deploy` directly.
  - [x] Added `--yes` argument to `vercel deploy` command in `ci-cd.yml` for automatic confirmation.
  - [x] Updated Node.js version to `22.17.0` in `ci-cd.yml`.
  - [x] Removed `--prebuilt` option from `vercel deploy` command in `ci-cd.yml`.

- [x] **Checkpoint 9: Frontend Landing Page & Auth Integration (Completed)**
  - [x] Redesigned `apps/frontend/app/page.tsx` for a modern, social media-like landing page.
  - [x] Integrated email/password sign-in/sign-up.
  - [x] Integrated Google OAuth sign-in.

- [x] **Checkpoint 10: Frontend UI/UX Redesign (Completed)**
  - [x] Configured Tailwind CSS for default dark mode.
  - [x] Applied dark mode to `app/layout.tsx`.
  - [x] Separated sign-in and sign-up into `app/auth/login/page.tsx` and `app/auth/signup/page.tsx`.
  - [x] Redesigned `app/page.tsx` as a modern landing page with header navigation for sign-in/sign-up.
  - [x] Changed brand name from "Open Socmed" to "Cirqle" in frontend.

- [x] **Checkpoint 11: Vercel Project Duplication Troubleshooting (Completed)**
  - [x] Identified common causes for duplicate Vercel projects (manual import, missing project IDs in CI/CD).
  - [x] Provided steps to identify the correct Vercel project, update GitHub Actions secrets (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`), and delete unintended duplicate projects.

- [ ] **Checkpoint 12: Supabase Schema Deployment (Pending)**
  - [ ] Enable `supabase_schema_deploy` job in `ci-cd.yml`.
  - [ ] Ensure `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_ID` GitHub secrets are configured.

- [ ] **Checkpoint 13: Backend Integration (Pending)**
  - [ ] Implement core backend features (users, posts, comments, likes, follows).
  - [ ] Integrate frontend with backend API endpoints.

- [ ] **Checkpoint 14: Backend Deployment (Pending)**
  - [ ] Enable `backend_deploy` job in `ci-cd.yml`.
  - [ ] Implement actual deployment steps for the backend (e.g., to Render).

- [ ] **Checkpoint 15: Backend Testing (Planned)**

- [ ] **Checkpoint 16: Frontend Testing (Planned)**

- [ ] **Checkpoint 17: UI/UX Enhancements (Planned)**

- [ ] **Checkpoint 18: Deployment Optimization (Planned)**

## 4. Commit Rules (Semantic Commits)

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

The scope can be the name of the component or part of the project affected. Examples: `frontend`, `backend`, `ui`, `config`, `build`, `docs`, `monorepo`, `supabase`.

**Subject (Commit Title):**

A brief description of the change in imperative mood (e.g., "add" not "adding").

**Example Commit Messages:**

- `feat(web): add google auth with supabase`
- `fix(api): handle user creation errors`
- `docs(readme): update setup instructions`
- `chore(monorepo): configure turborepo pipeline`
- `test(web): add unit tests for Button component`

## 5. Session Rules

At the end of each session, the agent must:

- Update knowledge, detailed information, and checkpoint updates informatively in the `GEMINI.md` file.
- Update `README.md` with the latest project conditions.
- Always offer to commit and push to the repository.
