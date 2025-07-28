# Gemini Project Context: open-socmed

*Note: This file is for internal project tracking and Gemini CLI context.*

## 1. Project Overview

`open-socmed` is a full-stack social media platform built as a monorepo using Turborepo. It consists of a Next.js frontend, a Go backend API, and a shared UI component library.

### Monorepo Structure:
- **`apps/web` (cirqle)**: The frontend application built with Next.js (TypeScript).
- **`apps/api`**: The backend API built with Go (Gin, GORM).
- **`packages/ui`**: A shared library for React/Tailwind components.
- **`packages/config`**: (Planned) Shared ESLint, Prettier, TypeScript configurations.

## 2. Technologies Used

### Core Monorepo:
- **Turborepo**: For monorepo management and optimized build caching.
- **npm Workspaces**: For managing dependencies across packages.
- **TypeScript**: For type safety across JavaScript/React projects.
- **ESLint & Prettier**: For code linting and formatting.

### Frontend (`apps/web` - cirqle):
- **Framework**: Next.js (TypeScript) - Configured for SSR/SSG.
- **Styling**: Tailwind CSS.
- **UI Components**: Headless UI.
- **Data Fetching**: React Query (or SWR - currently using React Query).
- **Authentication**: Supabase Auth.

### Backend (`apps/api`):
- **Language**: Go.
- **Web Framework**: Gin.
- **ORM**: GORM (for PostgreSQL).
- **Database**: Supabase PostgreSQL (via `DATABASE_URL`).
- **API Endpoints**: Users, Posts, Comments, Likes, Follows, Health Check.

### Shared UI (`packages/ui`):
- **Components**: React components styled with Tailwind CSS.

### Database:
- **Supabase**: Provides PostgreSQL database, Authentication, and Realtime capabilities.

## 3. Development Plan & Checkpoints

This project will be developed in structured stages to ensure organized progress.

* [x] **Checkpoint 1: Monorepo Initialization & Basic Structure (Completed)**
  * [x] Create `open-socmed` root directory.
  * [x] Initialize Turborepo.
  * [x] Set up `apps/web`, `apps/api`, `packages/ui` directories.
  * [x] Create root `package.json`, `turbo.json`, `tsconfig.json`, `.eslintrc.js`, `.prettierrc`.
  * [x] Create root `.gitignore` and `README.md`.

* [x] **Checkpoint 2: Frontend (`apps/web`) Setup (Completed)**
  * [x] Initialize Next.js (TypeScript) project.
  * [x] Configure Tailwind CSS.
  * [x] Install Headless UI, React Query, Supabase Auth dependencies.
  * [x] Create `_app.tsx` (or `layout.tsx`/`page.tsx` for App Router), `tailwind.config.js`, `next.config.js`.
  * [x] Add sample React page consuming Supabase (login/logout example).
  * [x] Configure `.env.local` template for Next.js.

* [x] **Checkpoint 3: Backend (`apps/api`) Setup (Completed)**
  * [x] Initialize Go module (`github.com/yourusername/open-socmed/apps/api`).
  * [x] Install Gin and GORM dependencies.
  * [x] Create `main.go` with sample Gin route and DB connection (Supabase PostgreSQL).
  * [x] Configure `.env.local` template for Go.
  * [x] Add basic health check endpoint.

* [x] **Checkpoint 4: Shared UI (`packages/ui`) Setup (Completed)**
  * [x] Initialize `package.json`.
  * [x] Create `Button.tsx` as a shared component example.

* [x] **Checkpoint 5: Shared Configurations (`packages/config`) (Planned)**
  * [ ] Create `packages/config` directory.
  * [ ] Set up shared ESLint configuration.
  * [ ] Set up shared Prettier configuration.
  * [ ] Set up shared TypeScript configuration.
  * [ ] Integrate shared configs into `apps/web` and `packages/ui`.

* [x] **Checkpoint 6: Supabase Schema & RLS (Completed)**
  * [x] Define SQL schema for `users`, `posts`, `comments`, `likes`, `follows`.
  * [x] Implement Row Level Security (RLS) policies for all tables.
  * [x] Provide `supabase_schema.sql` file.

* [x] **Checkpoint 7: Turborepo Pipeline Configuration (Completed)**
  * [x] Wire up `lint`, `build`, `dev` pipelines in `turbo.json`.

* [x] **Checkpoint 8: GitHub Actions CI/CD (Completed)**
  * [x] Create `ci.yml` for linting, testing, and building on push/pull request.
  * [x] Create `deploy.yml` for deploying `apps/web` to Vercel on merge to `main`.
  * [ ] (Future) Implement CI/CD for `apps/api` (e.g., to Render/Fly.io).


* [ ] **Checkpoint 9: Linting Issue Investigation (Ongoing)**
  * [x] Removed `.markdownlint.json` and `.vscode/settings.json` as they did not resolve the `markdownlint-cli2` error.
  * [ ] Further investigation needed for `markdownlint-cli2` error with `package.json`.
* [ ] **Checkpoint 10: Core Feature Implementation (Planned)**
  * [x] Refactored folder structure: `apps/web` to `apps/frontend` and `apps/api` to `apps/backend`.
  * [ ] Implement user authentication (signup, login, logout) in `apps/web`.
  * [ ] Implement user profile management (create, read, update) via `apps/api`.
  * [ ] Implement post creation, retrieval, update, deletion.
  * [ ] Implement comment functionality.
  * [ ] Implement like/unlike functionality.
  * [ ] Implement follow/unfollow functionality.

* [ ] **Checkpoint 11: Testing (Planned)**
  * [ ] Write unit tests for `apps/web` components and logic.
  * [ ] Write integration tests for `apps/api` endpoints.
  * [ ] Configure test runners (e.g., Vitest for Next.js, Go testing for API).

* [ ] **Checkpoint 11: UI/UX Enhancements (Planned)**
  * [ ] Design and implement responsive layouts.
  * [ ] Enhance shared UI components.
  * [ ] Implement notifications and real-time updates using Supabase Realtime.

* [ ] **Checkpoint 12: Deployment Optimization (Planned)**
  * [ ] Optimize Next.js build for production.
  * [ ] Containerize Go API (Docker) for easier deployment.
  * [ ] Configure `apps/api` deployment to Render/Fly.io.

## 4. Commit Rules (Semantic Commits)

To keep the Git history clean and readable, this project adopts **Semantic Commit Messages** standards. Each commit message must follow the format:

```
<type>(<scope>): <subject>
```

**Type (Type of Change):**

* **feat**: A new feature.
* **fix**: A bug fix.
* **docs**: Documentation changes.
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.).
* **refactor**: A code change that neither fixes a bug nor adds a feature.
* **perf**: A code change that improves performance.
* **test**: Adding missing tests or correcting existing tests.
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation.

**Scope (Scope of Change):**

The scope can be the name of the component or part of the project affected. Examples: `frontend`, `backend`, `ui`, `config`, `build`, `docs`, `monorepo`, `supabase`.

**Subject (Commit Title):**

A brief description of the change in imperative mood (e.g., "add" not "adding").

**Example Commit Messages:**

* `feat(web): add google auth with supabase`
* `fix(api): handle user creation errors`
* `docs(readme): update setup instructions`
* `chore(monorepo): configure turborepo pipeline`
* `test(web): add unit tests for Button component`

## 5. Session Rules

At the end of each session, the agent must:

* Update knowledge, detailed information, and checkpoint updates informatively in the `GEMINI.md` file.
* Update `README.md` with the latest project conditions.
* Always offer to commit and push to the repository.
