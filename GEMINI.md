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

### Frontend (`apps/frontend`):
- **Framework**: Next.js (TypeScript) - Configured for SSR/SSG.
- **Styling**: Tailwind CSS.
- **UI Components**: Headless UI.
- **Data Fetching**: React Query.
- **Authentication**: Supabase Auth.

### Backend (`apps/backend`):
- **Language**: Go.
- **Web Framework**: Gin.
- **ORM**: GORM (for PostgreSQL).
- **Database**: Supabase PostgreSQL (via `DATABASE_URL`).

### Shared UI (`packages/ui`):
- **Components**: React components styled with Tailwind CSS.

### Database:
- **Supabase**: Provides PostgreSQL database, Authentication, and Realtime capabilities.

## 3. Development Plan & Checkpoints

This project will be developed in structured stages to ensure organized progress.

### 3.1. General Monorepo Setup & Core Infrastructure

* [x] **Checkpoint 1.1: Monorepo Initialization & Basic Structure (Completed)**

* [x] **Checkpoint 1.2: Frontend (`apps/frontend`) Setup (Completed)**

* [x] **Checkpoint 1.3: Backend (`apps/backend`) Setup (Completed)**

* [x] **Checkpoint 1.4: Shared UI (`packages/ui`) Setup (Completed)**

* [x] **Checkpoint 1.5: Project Restructuring & Repair (Completed)**
  * [x] **Backend: Fix Compilation & Structure**
    * [x] Removed duplicate `main()` function in `apps/backend/main.go`.
    * [x] Restructured backend into `models` and `controllers` directories.
    * [x] Added `godotenv` to manage environment variables.
    * [x] Cleaned up invalid dependencies in `go.mod`.
  * [x] **Frontend: Fix Authentication Flow**
    * [x] Created a `...` to handle the OAuth callback.
  * [x] **DX & Documentation**
    * [x] Created `.env.example` files for both `frontend` and `backend`.
    * [x] Updated `README.md` with clearer setup and run instructions.
  * [x] **Configuration: Shared Tooling**
    * [x] Added `dotenv-cli` for loading `.env` files in development.

* [x] **Checkpoint 1.6: Supabase Schema & RLS (Completed)**

* [x] **Checkpoint 1.7: Turborepo Pipeline Configuration (Completed)**

* [x] **Checkpoint 1.8: GitHub Actions CI/CD (Completed)**
  * [x] Consolidated `ci.yml` and `deploy.yml` into a single `ci-cd.yml`.
  * [x] Configured separate build and deploy jobs for frontend and backend.
  * [x] Set up triggers for `push` and `pull_request` on `master` branch.
  * [x] Added `supabase_schema_deploy` job to automatically push schema on `master` branch pushes.
  * [x] Temporarily disabled `supabase_schema_deploy` and `backend_deploy` jobs in `ci-cd.yml`.
  * [x] Fixed YAML syntax error in `ci-cd.yml` (`needs: []` removed).
  * [x] Corrected Vercel deployment command in `ci-cd.yml` to use `vercel deploy` directly.
  * [x] Added `--yes` argument to `vercel deploy` command in `ci-cd.yml` for automatic confirmation.
  * [x] Updated Node.js version to `22.17.0` in `ci-cd.yml`.
  * [x] Removed `--prebuilt` option from `vercel deploy` command in `ci-cd.yml`.
  * [x] Removed `working-directory` from Vercel deploy step in `ci-cd.yml`.

* [x] **Checkpoint 1.9: Vercel Project Duplication Troubleshooting (Completed)**
  * [x] Identified common causes for duplicate Vercel projects (manual import, missing project IDs in CI/CD).
  * [x] Provided steps to identify the correct Vercel project, update GitHub Actions secrets (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`), and delete unintended duplicate projects.

* [x] **Checkpoint 1.10: Git Branching Strategy (Completed)**
  * [x] Implemented `develop` branch for development, keeping `master` for production.
  * [x] Configured CI/CD for `develop` branch (`ci-cd-develop.yml`) to perform linting, building, and testing only.

### 3.2. Frontend Development Plan

* [x] **Checkpoint 2.1: Frontend Landing Page & Auth Integration (Completed)**
  * [x] Redesigned `apps/frontend/app/page.tsx` for a modern, social media-like landing page.
  * [x] Integrated email/password sign-in/sign-up.
  * [x] Integrated Google OAuth sign-in.

* [x] **Checkpoint 2.2: Frontend UI/UX Redesign (Completed)**
  * [x] Configured Tailwind CSS for default dark mode.
  * [x] Applied dark mode to `app/layout.tsx`.
  * [x] Separated sign-in and sign-up into `app/auth/login/page.tsx` and `app/auth/signup/page.tsx`.
  * [x] Redesigned `app/page.tsx` as a modern landing page with header navigation for sign-in/sign-up.
  * [x] Changed brand name from "Open Socmed" to "Cirqle" in frontend.

* [x] **Checkpoint 2.3: Frontend Title and Icon (Completed)**
  * [x] Updated `metadata.title` in `app/layout.tsx` to "Cirqle".
  * [ ] **To Do:** Add favicon and other app icons to `apps/frontend/public/` directory.

* [ ] **Checkpoint 2.4: Frontend Core Feature Implementation (Planned)**
  * [ ] Implement user authentication (signup, login, logout) connecting to Supabase and backend.
  * [ ] Build UI for user profile management.
  * [ ] Build UI for creating, viewing, and interacting with posts (comments, likes).
  * [ ] Build UI for viewing user lists and implementing follow/unfollow actions.

* [ ] **Checkpoint 2.5: Frontend Testing (Planned)**
  * [ ] Write unit tests for `apps/frontend` components and logic.
  * [ ] Configure test runner (e.g., Vitest for Next.js).

### 3.3. Backend Development Plan

* [ ] **Checkpoint 3.1: Backend Core Feature Implementation (Planned)**
  * [ ] Implement user profile management (create, read, update).
  * [ ] Implement post creation, retrieval, update, and deletion (CRUD).
  * [ ] Implement comment creation and retrieval for posts.
  * [ ] Implement like/unlike functionality for posts.
  * [ ] Implement follow/unfollow functionality between users.

* [ ] **Checkpoint 3.2: Backend Testing (Planned)**
  * [ ] Write integration tests for all `apps/backend` API endpoints.
  * [ ] Configure Go testing framework.

### 3.4. Cross-Cutting Concerns & Future Enhancements

* [ ] **Checkpoint 4.1: Supabase Schema Deployment (Pending)**
  * [ ] Enable `supabase_schema_deploy` job in `ci-cd.yml`.
  * [ ] Ensure `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_ID` GitHub secrets are configured.
  * [ ] **To Do:** Set up separate Supabase project for staging environment.

* [ ] **Checkpoint 4.2: Backend Deployment (Pending)**
  * [ ] Enable `backend_deploy` job in `ci-cd.yml`.
  * [ ] Implement actual deployment steps for the backend (e.g., to Render).
  * [ ] **To Do:** Set up separate backend instances for staging environment.

* [ ] **Checkpoint 4.3: UI/UX Enhancements (Planned)**
  * [ ] Design and implement responsive layouts.
  * [ ] Enhance shared UI components.
  * [ ] Implement notifications and real-time updates using Supabase Realtime.

* [ ] **Checkpoint 4.4: Deployment Optimization (Planned)**
  * [ ] Optimize Next.js build for production.
  * [ ] Containerize Go API (Docker) for easier deployment.
  * [ ] Configure `apps/api` deployment to Render/Fly.io.

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
