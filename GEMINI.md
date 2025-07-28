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
* [ ] **Checkpoint 10: Backend Core Feature Implementation (Planned)**
  * [ ] Implement user profile management (create, read, update).
  * [ ] Implement post creation, retrieval, update, and deletion (CRUD).
  * [ ] Implement comment creation and retrieval for posts.
  * [ ] Implement like/unlike functionality for posts.
  * [ ] Implement follow/unfollow functionality between users.

* [ ] **Checkpoint 11: Frontend Core Feature Implementation (Planned)**
  * [ ] Implement user authentication (signup, login, logout) connecting to Supabase and backend.
  * [ ] Build UI for user profile management.
  * [ ] Build UI for creating, viewing, and interacting with posts (comments, likes).
  * [ ] Build UI for viewing user lists and implementing follow/unfollow actions.

* [ ] **Checkpoint 12: Backend Testing (Planned)**
  * [ ] Write integration tests for all `apps/backend` API endpoints.
  * [ ] Configure Go testing framework.

* [ ] **Checkpoint 13: Frontend Testing (Planned)**
  * [ ] Write unit tests for `apps/frontend` components and logic.
  * [ ] Configure test runner (e.g., Vitest for Next.js).

* [ ] **Checkpoint 14: Backend - Week 1 Development Plan (Planned)**
  * [ ] **Day 1: Setup & Database Models**
    * [ ] Understand existing code: `apps/backend/main.go` and `supabase_schema.sql`.
    * [ ] Create `apps/backend/models` directory.
    * [ ] Define GORM model structs for `users`, `posts`, `comments`, `likes`, and `follows` in separate files within the `models` directory.
  * [ ] **Day 2: User Endpoints & DB Migration**
    * [ ] Add `db.AutoMigrate()` in `main.go` to sync models with the Supabase DB.
    * [ ] Create `apps/backend/controllers` directory and a `users.go` file inside.
    * [ ] Implement `CreateUser`, `GetUser`, and `UpdateUser` functions.
    * [ ] Register user routes (`POST /users`, `GET /users/:id`, `PUT /users/:id`) in `main.go`.
  * [ ] **Day 3: Post Endpoints (CRUD)**
    * [ ] Create `posts.go` in the `controllers` directory.
    * [ ] Implement full CRUD functions: `CreatePost`, `GetPosts`, `GetPost`, `UpdatePost`, `DeletePost`.
    * [ ] Register post routes (`POST /posts`, `GET /posts`, etc.) in `main.go`.
  * [ ] **Day 4: Comment & Like Endpoints**
    * [ ] Create `comments.go` and `likes.go` in the `controllers` directory.
    * [ ] Implement functions to create/read comments and like/unlike posts.
    * [ ] Register routes: `POST /posts/:id/comments`, `GET /posts/:id/comments`, `POST /posts/:id/like`.
  * [ ] **Day 5: Follow Endpoints & Initial Testing**
    * [ ] Create `follows.go` in the `controllers` directory.
    * [ ] Implement `FollowUser` and `UnfollowUser` functions.
    * [ ] Register follow routes (`POST /users/:id/follow`).
    * [ ] Perform initial manual testing on all created endpoints using `curl` or Postman.

* [ ] **Checkpoint 15: Frontend - Week 1 Development Plan (Planned)**
  * [ ] **Day 1: Setup & Authentication UI**
    * [ ] Understand the existing frontend structure in `apps/frontend`.
    * [ ] Review `supabase_schema.sql` to understand the data structure.
    * [ ] Implement the UI for Login and Signup pages using shared UI components.
    * [ ] Use the Supabase Auth client (`@supabase/auth-helpers-nextjs`) to handle user registration and login.
  * [ ] **Day 2: User Profile & State Management**
    * [ ] Create a dynamic user profile page to display user information.
    * [ ] Integrate React Query to manage server state for fetching data from the backend.
    * [ ] Create a custom hook (e.g., `useUser.ts`) to fetch user data from the backend API (`GET /api/users/:id`).
  * [ ] **Day 3: Post Feed & Creation UI**
    * [ ] Build the main feed component to display a list of posts fetched from the backend.
    * [ ] Create a custom hook (`usePosts.ts`) to fetch posts (`GET /api/posts`).
    * [ ] Create a form/modal component to allow users to create a new post (calling `POST /api/posts`).
  * [ ] **Day 4: Post Interaction (Comments & Likes)**
    * [ ] On the post component, add a button to like/unlike a post (calling `POST /api/posts/:id/like`).
    * [ ] Add a section to display comments for a post (calling `GET /api/posts/:id/comments`).
    * [ ] Add a form to allow users to submit a new comment (calling `POST /api/posts/:id/comments`).
  * [ ] **Day 5: Follow Functionality & UI Polish**
    * [ ] On the user profile page, add a "Follow"/"Unfollow" button.
    * [ ] Hook the button to the corresponding backend API endpoint (`POST /api/users/:id/follow`).
    * [ ] Begin polishing the UI, ensuring components are responsive and user-friendly.

* [ ] **Checkpoint 16: UI/UX Enhancements (Planned)**
  * [ ] Design and implement responsive layouts.
  * [ ] Enhance shared UI components.
  * [ ] Implement notifications and real-time updates using Supabase Realtime.

* [ ] **Checkpoint 17: Deployment Optimization (Planned)**
  * [ ] Optimize Next.js build for production.
  * [ ] Containerize Go API (Docker) for easier deployment.
  * [ ] Configure `apps/api` deployment to Render/Fly.io.

## 4. Commit Rules (Semantic Commits)

All commits in this project **must** adhere to the Semantic Commit Messages standards to maintain a clean and readable Git history. Each commit message must follow the format:

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
