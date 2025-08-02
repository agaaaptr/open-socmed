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
- **dotenv-cli**: For managing environment variables in scripts.

### Frontend (`apps/frontend`)

- **Framework**: Next.js (TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Data Fetching**: React Query
- **Authentication**: Supabase Auth

### Backend (`apps/backend`)

- **Language**: Go (refactored to Vercel Serverless Functions)
- **Web Framework**: (N/A - replaced by Vercel Serverless Functions)
- **ORM**: GORM (for PostgreSQL)
- **Database**: Supabase PostgreSQL (via `DATABASE_URL`)
- **Supabase Client**: supabase-go

### Database & CI/CD

- **Supabase**: Provides PostgreSQL database, Authentication, and Realtime capabilities.
- **Supabase CLI**: Used for local development and schema migrations.
- **GitHub Actions**: For Continuous Integration and Deployment.
- **Vercel**: For frontend hosting and backend serverless functions.

## 3. Development Plan & Checkpoints

This project is developed in structured stages to ensure organized progress.

### 3.1. Core Infrastructure & Configuration

- [x] **Checkpoint 1.1: Initial Monorepo & App Setup (Completed)**
- [x] **Checkpoint 1.2: Project Restructuring & Initial Fixes (Completed)**
- [x] **Checkpoint 1.3: Supabase Project Integration (Completed)**
  - [x] Created and linked remote Supabase project.
  - [x] Configured `.env` files for both `frontend` and `backend` with actual credentials.
  - [x] Pushed initial `supabase_schema.sql` to the remote database.
  - [x] Troubleshot and resolved database connection issues (`failed SASL auth`).
- [x] **Checkpoint 1.4: Build & CI/CD Configuration (Completed)**
  - [x] Fixed backend Go module paths (`go.mod`, `main.go`, etc.).
  - [x] Fixed frontend build failure by using `dotenv-cli` to load environment variables during `next build`.
  - [x] Configured GitHub Actions for CI/CD.
  - [x] **Lint Verification:** Successfully ran linting commands, confirming project integrity. (Build command is not applicable for Vercel serverless functions).
- [x] **Checkpoint 1.5: Documentation Update (Completed)**
  - [x] Updated `README.md` with accurate, step-by-step setup instructions.
  - [x] Updated `GEMINI.md` to reflect the current project state.

### 3.2. Frontend Development Plan

- [x] **Checkpoint 2.1: Landing Page & Auth UI (Completed)**
  - [x] Redesigned `apps/frontend/app/page.tsx` as a modern landing page.
  - [x] Separated sign-in and sign-up into their own pages.
  - [x] Changed brand name to "Cirqle" and updated metadata.
- [x] **Checkpoint 2.2: Authentication Logic (Completed)**
- [x] **Checkpoint 2.3: Visual & UX Overhaul (Completed)**
  - [x] Established a new, consistent design system: dark/purple theme with a bright teal (`#00FFDE`) as the primary accent.
  - [x] Eliminated mixed gradients in favor of a clean, high-contrast aesthetic.
  - [x] Integrated `framer-motion` for fluid, physics-based animations across the application.
  - [x] Redesigned the Landing Page, Login, Signup, and Dashboard pages to be modern, interactive, and visually cohesive using glassmorphism effects.
  - [x] Added `lucide-react` for a consistent and high-quality icon set.
  - [x] **UI/UX Enhancements for Home and Profile Pages:** Improved visual appeal and interactivity of home page placeholders and profile edit form, ensuring consistency with overall design, color scheme, and smooth animations.
- [x] **Checkpoint 2.4: Frontend Core Feature Implementation (In Progress)**
  - [x] **User Profile Display:** Display user's `full_name` and `username` on the home page.
  - [x] **Login with Username/Email:** Implemented frontend and backend logic to allow users to sign in using either their email or username.
  - [ ] **Home as Main Page:** Redesign the home page to be the main social media feed, incorporating placeholders for timeline, stories, and messages.
  - [ ] **Post Creation UI:** Create a form for users to create new posts.
  - [ ] **Post List Display:** Display a list of posts from other users.
  - [ ] **Basic Post Interaction:** Implement like/comment buttons (UI only for now).
  - [ ] **Responsive Design:** Ensure all pages are responsive across devices.
  - [ ] **Error Handling & Feedback:** Improve user feedback for authentication and data operations.
- [ ] **Checkpoint 2.5: Frontend Title and Icon (Next Steps)**
  - [ ] **To Do:** Add favicon and other app icons to `apps/frontend/public/` directory.

### 3.3. Backend Development Plan

- [x] **Checkpoint 3.1: Backend Core Feature Implementation (In Progress)**
  - [x] Renamed `users` model/controller to `profiles` to match database schema.
  - [x] **Unique Username Constraint:** Added a unique constraint to the `username` column in the `profiles` table.
  - [x] **User Profile API:** Implemented API endpoint for fetching and updating user profiles.
  - [x] **Login with Username/Email Backend:** Implemented full authentication logic in the serverless function (`/api/auth/signin`) to sign in users with resolved email/username and password via Supabase. (Fixed `gotrue-go` `SignIn` method issue by using `Token` method and resolving import error).
  - [x] **Signin Error Handling:** Ensured `/api/auth/signin` always returns valid JSON responses, including for errors, to prevent frontend parsing issues.
  - [ ] **Post CRUD API:** Implement API endpoints for creating, reading, updating, and deleting posts.
  - [ ] **Authentication Integration:** Ensure backend APIs are protected and integrate with Supabase authentication (e.g., verifying JWT tokens).
  - [ ] **Database Interaction:** Implement GORM models and queries for `posts`, `comments`, `likes`, and `follows` tables.
- [x] **Checkpoint 3.2: Backend Deployment Optimization (Completed)**
  - [x] Refactored Go backend into Vercel serverless functions.
  - [x] Configured `vercel.json` for Vercel deployment.
  - [x] Simplified `vercel.json` builds configuration to remove redundant entries.
- [x] **Checkpoint 3.3: Backend Refactoring & Hardening (Completed)**
  - [x] Refactored database connection logic to be resilient in a serverless environment.
  - [x] Hardened the `updateProfile` endpoint by using a dedicated request struct (`UpdateProfileRequest`) to prevent mass assignment vulnerabilities.
  - [x] Corrected JWT validation to use the `sub` claim for user ID.
  - [x] Fixed `getProfile` logic to correctly fetch a single record.
  - [x] **Fixed Vercel Rewrite for Signin:** Corrected `vercel.json` rewrite rule for `/api/auth/signin` to correctly route to the Go serverless function.

## 4. Current Known Issues

### Frontend (`apps/frontend`)

- **No known issues.** The `npm run dev` command now runs successfully, and Vercel deployment is stable.

### Backend (`apps/backend`)

- **No known issues.** All identified issues with the profile API have been resolved.

## 5. Next Steps: Troubleshooting & Development

### Feature: User Profile (View & Edit) - Completed

**Goal:** Users can view their own profile (full name, username, etc.) on the dashboard and edit their profile information on a dedicated page.

#### Frontend (`apps/frontend`) - Next.js:

*   **Profile Display (Dashboard):**
    *   [x] Create UI components to display user profile information (full name, username, avatar, etc.) on the `/dashboard` page.
    *   [x] Fetch user profile data from the backend API when the dashboard page loads.
    *   [x] Handle loading and error states when fetching profile data.
*   **Edit Profile Form (Dedicated Page):**
    *   [x] Create a UI form on a separate page (e.g., `/settings/profile`) that allows users to edit their full name and username.
    *   [x] Validate form input on the client-side.
    *   [x] Submit updated profile data to the backend API.
    *   [x] Handle loading and error states when submitting data.
    *   [x] Provide feedback to the user after successful or failed updates.
*   **Authentication Integration:**
    *   [x] Ensure only authenticated users can view and edit their profiles.
    *   [x] Use Supabase authentication tokens to secure requests to the backend API.

#### Backend (`apps/backend`) - Go: - Completed

*   **`Profile` Model:**
    *   [x] Ensure the `models.Profile` model aligns with the `profiles` table schema in Supabase (ID, username, full_name, avatar_url, etc.).
*   **API Endpoint for Fetching Profile:**
    *   [x] Create an API endpoint (`GET /api/profile`) to retrieve user profile data based on user ID or authentication token.
    *   [x] Implement logic to fetch data from the database using GORM.
    *   [x] Secure this endpoint so only authenticated users can access it (JWT verification from Supabase).
*   **API Endpoint for Updating Profile:**
    *   [x] Create an API endpoint (`PUT /api/profile`) to update user profile data (only full_name and username).
    *   [x] Implement logic to update data in the database using GORM.
    *   [x] Validate input received from the frontend.
    *   [x] Secure this endpoint so only authenticated users can update their own profile.
*   **Authentication Integration:**
    *   [x] Implement middleware or logic in the backend to verify JWT tokens received from the frontend for all protected profile endpoints.
    *   [x] Extract user ID from the JWT token to ensure users can only access or modify their own profile.

### Feature: Post Feed (View & Create)

**Goal:** Users can view a feed of posts from other users and create new posts.

#### Frontend (`apps/frontend`) - Next.js:

*   **Post Feed Display:**
    *   Create UI components to display a list of posts (content, author, timestamp, likes, comments count).
    *   Fetch post data from the backend API.
    *   Implement pagination or infinite scrolling for the feed.
*   **Post Creation UI:**
    *   Create a form for users to compose and submit new posts.
    *   Handle form input and validation.
    *   Send new post data to the backend API.
*   **Basic Post Interaction (UI Only):**
    *   Implement UI for like/comment buttons (functionality will be added later).

#### Backend (`apps/backend`) - Go:

*   **`Post` Model:**
    *   Define a GORM model for posts (ID, content, author ID, timestamp, etc.).
*   **API Endpoint for Fetching Posts:**
    *   Create an API endpoint (`GET /api/posts`) to retrieve a list of posts.
    *   Implement logic to fetch posts from the database, potentially with filtering and pagination.
*   **API Endpoint for Creating Posts:**
    *   Create an API endpoint (`POST /api/posts`) to allow authenticated users to create new posts.
    *   Implement logic to save new posts to the database.
    *   Validate post content.
*   **Authentication Integration:**
    *   Ensure API endpoints are protected and integrate with Supabase authentication.

### Feature: Timeline (Main Feed)

**Goal:** The home page will serve as the main timeline, displaying a consolidated feed of posts from followed users and relevant content.

#### Frontend (`apps/frontend`) - Next.js:

*   **Timeline Display:**
    *   [ ] Integrate post feed display into the main dashboard layout.
    *   [ ] Implement a visually appealing and interactive timeline UI.
    *   [ ] Consider infinite scrolling or pagination for loading more posts.
*   **Content Aggregation:**
    *   [ ] Fetch and display posts from various sources (e.g., followed users, trending topics).
*   **Interaction Points:**
    *   [ ] Ensure like, comment, and share buttons are integrated (UI only for now).

#### Backend (`apps/backend`) - Go:

*   **Timeline API:**
    *   [ ] Create an API endpoint (`GET /api/timeline`) to fetch a personalized feed for the authenticated user.
    *   [ ] Implement logic to aggregate posts based on follow relationships and other criteria.

### Feature: Stories

**Goal:** Users can view and create short, ephemeral stories.

#### Frontend (`apps/frontend`) - Next.js:

*   **Stories Display:**
    *   [ ] Create a UI component to display a carousel or list of active stories.
    *   [ ] Implement a full-screen viewer for individual stories.
*   **Story Creation UI:**
    *   [ ] Create a form or interface for users to upload images/videos and create new stories.
*   **Placeholder:**
    *   [ ] Add a placeholder UI element on the dashboard for stories.

#### Backend (`apps/backend`) - Go:

*   **`Story` Model:**
    *   [ ] Define a GORM model for stories (ID, user ID, media URL, expiration time, etc.).
*   **API Endpoints:**
    *   [ ] Create API endpoints for creating, fetching, and viewing stories.

### Feature: Direct Messages

**Goal:** Users can send and receive direct messages with other users.

#### Frontend (`apps/frontend`) - Next.js:

*   **Message List:**
    *   [ ] Create a UI to display a list of conversations/chats.
*   **Chat Interface:**
    *   [ ] Implement a real-time chat interface for sending and receiving messages.
*   **Placeholder:**
    *   [ ] Add a placeholder UI element on the dashboard for direct messages.

#### Backend (`apps/backend`) - Go:

*   **`Message` Model:**
    *   [ ] Define a GORM model for messages (ID, sender ID, receiver ID, content, timestamp, etc.).
*   **API Endpoints:**
    *   [ ] Create API endpoints for sending, receiving, and retrieving messages.
    *   [ ] Consider WebSocket integration for real-time messaging.

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
- Submit Pull Requests to `develop` for `review`.

## 9. Lessons Learned

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