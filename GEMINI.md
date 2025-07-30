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
  * [x] Verified that email/password and Google OAuth flows are correctly implemented.
* [ ] **Checkpoint 2.3: Frontend Title and Icon (Planned)**
  * [ ] **To Do:** Add favicon and other app icons to `apps/frontend/public/` directory.
* [ ] **Checkpoint 2.4: Frontend Core Feature Implementation (Planned)**
  * [ ] Build UI for user profile management.
  * [ ] Build UI for creating, viewing, and interacting with posts (comments, likes).
  * [ ] Build UI for viewing user lists and implementing follow/unfollow actions.

### 3.3. Backend Development Plan

* [ ] **Checkpoint 3.1: Backend Core Feature Implementation (Planned)**
  * [ ] Implement user profile management (create, read, update).
  * [ ] Implement post creation, retrieval, update, and deletion (CRUD).
  * [ ] Implement comment creation and retrieval for posts.
  * [ ] Implement like/unlike functionality for posts.
  * [ ] Implement follow/unfollow functionality between users.

## 4. Commit Rules (Semantic Commits)

All commits must follow the format: `<type>(<scope>): <subject>`.

- **Examples:** `fix(frontend): resolve build error by loading env vars`, `chore(docs): update README with new setup instructions`.