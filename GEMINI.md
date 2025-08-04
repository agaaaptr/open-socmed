# Gemini Project Context: open-socmed

*Note: This file is for internal project tracking and Gemini CLI context.*

## 1. Project Overview

`open-socmed` is a full-stack social media platform built as a monorepo using Turborepo. It consists of a Next.js frontend, a Go backend API, and shared UI/Go component libraries.

### 1.1. Monorepo Structure

- **`apps/web`**: The main frontend application built with Next.js (TypeScript).
- **`api/`**: The backend API, consisting of Vercel Serverless Functions written in Go.
- **`packages/ui`**: A shared library for React/Tailwind components.
- **`packages/go-common`**: A shared Go module for common functionalities like database connection and models.

## 2. Technologies Used

### 2.1. Core Monorepo

- **Turborepo**: For monorepo management and optimized build caching.
- **npm Workspaces**: For managing dependencies across packages.
- **TypeScript**: For type safety across JavaScript/React projects.
- **ESLint & Prettier**: For code linting and formatting.

### 2.2. Frontend (`apps/web`)

- **Framework**: Next.js (TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Data Fetching**: React Query
- **Authentication**: Supabase Auth
- **Environment Variables**: `dotenv-cli` for local development.

### 2.3. Backend (`api/`)

- **Language**: Go (Vercel Serverless Functions)
- **ORM**: GORM (for PostgreSQL)
- **Database**: Supabase PostgreSQL (via `DATABASE_URL`)
- **Supabase Client**: `supabase-go`
- **Environment Variables**: `godotenv` for local development.

### 2.4. Database & CI/CD

- **Supabase**: Provides PostgreSQL database, Authentication, and Realtime capabilities.
- **Supabase CLI**: Used for local development and schema migrations.
- **GitHub Actions**: For Continuous Integration and Deployment.
- **Vercel**: For frontend hosting and backend serverless functions.

## 3. Development Plan & Checkpoints

This project is developed in structured stages to ensure organized progress.

### 3.1. Core Infrastructure & Configuration

- [x] **Checkpoint 1.1: Initial Monorepo & App Setup (Completed)**
- [x] **Checkpoint 1.2: Project Restructuring & Initial Fixes (Completed)**
  - [x] Initial monorepo setup with `apps/frontend`, `apps/backend`, `packages/ui`.
  - [x] Refactored to standard monorepo structure: `apps/web`, `apps/api`, `packages/go-common`, `packages/ui`.
  - [x] Moved frontend code to `apps/web`.
  - [x] Moved Go serverless functions to `apps/api`.
  - [x] Moved shared Go code (database, models) to `packages/go-common`.
  - [x] Updated `go.mod` and import paths for new Go module structure.
- [x] **Checkpoint 1.3: Supabase Project Integration (Completed)**
  - [x] Created and linked remote Supabase project.
  - [x] Configured `.env` files for both `web` and `api` with actual credentials.
  - [x] Pushed initial `supabase_schema.sql` to the remote database.
  - [x] Troubleshot and resolved database connection issues (`failed SASL auth`).
- [x] **Checkpoint 1.4: Build & CI/CD Configuration (Completed)**
  - [x] Fixed Go module paths and dependencies.
  - [x] Configured `vercel.json` for monorepo deployment with explicit `builds` and `routes`.
  - [x] Configured `turbo.json` for monorepo pipeline management.
  - [x] Updated `package.json` scripts to use `turbo` commands.
  - [x] Updated `tsconfig.json` for monorepo TypeScript paths.
  - [x] Configured GitHub Actions for CI/CD.
  - [x] **Lint Verification:** Successfully ran linting commands, confirming project integrity.
- [x] **Checkpoint 1.5: Documentation Update (Completed)**
  - [x] Updated `README.md` with accurate, step-by-step setup instructions.
  - [x] Updated `GEMINI.md` to reflect the current project state.

### 3.2. Frontend Development Plan

- [x] **Checkpoint 2.1: Landing Page & Auth UI (Completed)**
  - [x] Redesigned `apps/web/app/page.tsx` as a modern landing page.
  - [x] Separated sign-in and sign-up into their own pages.
  - [x] Changed brand name to "Cirqle" and updated metadata.
- [x] **Checkpoint 2.2: Authentication Logic (Completed)**
  - [x] Reverted to email/password only login.
- [x] **Checkpoint 2.3: Visual & UX Overhaul (Completed)**
  - [x] Established a new, consistent design system: dark/purple theme with a bright teal (`#00FFDE`) as the primary accent.
  - [x] Eliminated mixed gradients in favor of a clean, high-contrast aesthetic.
  - [x] Integrated `framer-motion` for fluid, physics-based animations across the application.
  - [x] Redesigned the Landing Page, Login, Signup, and Dashboard pages to be modern, interactive, and visually cohesive using glassmorphism effects.
  - [x] Added `lucide-react` for a consistent and high-quality icon set.
  - [x] **UI/UX Enhancements for Home and Profile Pages:** Improved visual appeal and interactivity of home page placeholders and profile edit form, ensuring consistency with overall design, color scheme, and smooth animations.
- [ ] **Checkpoint 2.4: Frontend Core Feature Implementation (In Progress)**
  - [x] **User Profile Display:** Display user's `full_name` and `username` on the home page.
  - [x] **Login with Email/Password:** Implemented frontend logic to allow users to sign in using email and password.
  - [ ] **Home as Main Page:** Redesign the home page to be the main social media feed, incorporating placeholders for timeline, stories, and messages.
  - [ ] **Post Creation UI:** Create a form for users to create new posts.
  - [ ] **Post List Display:** Display a list of posts from other users.
  - [ ] **Basic Post Interaction:** Implement like/comment buttons (UI only for now).
  - [ ] **Responsive Design:** Ensure all pages are responsive across devices.
  - [ ] **Error Handling & Feedback:** Improve user feedback for authentication and data operations.
- [ ] **Checkpoint 2.5: Frontend Title and Icon (Next Steps)**
  - [ ] **To Do:** Add favicon and other app icons to `apps/web/public/` directory.

### 3.3. Backend Development Plan

- [x] **Checkpoint 3.1: Backend Core Feature Implementation (In Progress)**
  - [x] Renamed `users` model/controller to `profiles` to match database schema.
  - [x] **Unique Username Constraint:** Added a unique constraint to the `username` column in the `profiles` table.
  - [x] **User Profile API:** Implemented API endpoint for fetching and updating user profiles.
  - [x] **Login with Email/Password Backend:** Removed custom backend logic for login, now relying on Supabase client-side authentication.
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
- [x] **Checkpoint 3.4: Backend Directory Restructuring (Completed)**
  - [x] Moved Go serverless functions from `apps/api` to `api/` at the project root.
  - [x] Updated `vercel.json` to reflect the new API directory structure.
  - [x] Updated Go package names to `main` for Vercel compatibility.
  - [x] Updated `go.mod` to use relative path for `packages/go-common`.
  - [x] Restructured Go API functions into individual subdirectories with their own `go.mod` files.

## 4. Current Known Issues

### 4.1. Frontend (`apps/web`)

- **No known issues.** The `npm run dev` command now runs successfully, and Vercel deployment is expected to be stable with the new configuration.

### 4.2. Backend (`api/`)

- **`/api/profile` endpoint returns 404 in `vercel dev` (Unresolved Locally):** Despite extensive debugging and restructuring to ensure correct Go module configuration and Vercel deployment patterns, the `/api/profile` endpoint continues to return a 404 when running `vercel dev`.
  - **Investigation Summary:**
    - Initial attempts focused on `vercel.json` routing (`routes` vs. `rewrites`).
    - Restructured Go API to be self-contained (removed `packages/go-common` dependency, copied code directly into each function).
    - Ensured all Go files within each function (`api/profile`, `api/health`) use `package <directory_name>` (e.g., `package profile`).
    - Cleaned `go.mod` and `go.sum` files in both root and function directories.
    - Verified `vercel.json` `builds` configuration for Go functions.
  - **Current Hypothesis:** The issue is likely a limitation or bug within the `vercel dev` environment itself when handling this specific monorepo setup (Turborepo + Next.js + self-contained Go serverless functions). The Go functions compile correctly when tested independently.
  - **Next Step:** Proceeding with deployment to Vercel production to verify if the issue persists in the deployed environment, which will help isolate the problem to either the local development environment or the build/runtime on Vercel.
- **Vercel Deployment Failure (Go Build Error):** Deployment to Vercel failed with `undefined: GetDB` and `undefined: Profile` errors in `handler/index.go`.
  - **Root Cause:** The primary cause was Vercel's specific behavior when building Go serverless functions. While Go allows multiple files within a single package, Vercel's build process for `@vercel/go` builder expects all code for a given serverless function to be consolidated into a single `index.go` file. When multiple `.go` files were present in the function directory (e.g., `index.go`, `database.go`, `profile.go`), Vercel failed to correctly link or compile them, leading to `undefined` symbol errors.
  - **Resolution:** Consolidated all Go code for each serverless function into a single `index.go` file within its respective directory (`api/profile/index.go` and `api/health/index.go`). Removed redundant `database.go` and `profile.go` files. This approach ensures all necessary definitions are present in the single file that Vercel compiles for the function, making the deployment robust.

## 5. Next Steps: Troubleshooting & Development

### 5.1. Feature: User Profile (View & Edit) - Completed

**Goal:** Users can view their own profile (full name, username, etc.) on the dashboard and edit their profile information on a dedicated page.

#### 5.1.1. Frontend (`apps/web`) - Next.js

- [x] Create UI components to display user profile information (full name, username, avatar, etc.) on the `/dashboard` page.
- [x] Fetch user profile data from the backend API when the dashboard page loads.
- [x] Handle loading and error states when fetching profile data.
- [x] Create a UI form on a separate page (e.g., `/settings/profile`) that allows users to edit their full name and username.
- [x] Validate form input on the client-side.
- [x] Submit updated profile data to the backend API.
- [x] Handle loading and error states when submitting data.
- [x] Provide feedback to the user after successful or failed updates.
- [x] Ensure only authenticated users can view and edit their profiles.
- [x] Use Supabase authentication tokens to secure requests to the backend API.

#### 5.1.2. Backend (`api/`) - Go: - Completed

- [x] Ensure the `models.Profile` model aligns with the `profiles` table schema in Supabase (ID, username, full_name, avatar_url, etc.).
- [x] Create an API endpoint (`GET /api/profile`) to retrieve user profile data based on user ID or authentication token.
- [x] Implement logic to fetch data from the database using GORM.
- [x] Secure this endpoint so only authenticated users can access it (JWT verification from Supabase).
- [x] Create an API endpoint (`PUT /api/profile`) to update user profile data (only full_name and username).
- [x] Implement logic to update data in the database using GORM.
- [x] Validate input received from the frontend.
- [x] Secure this endpoint so only authenticated users can update their own profile.
- [x] Implement middleware or logic in the backend to verify JWT tokens received from the frontend for all protected profile endpoints.
- [x] Extract user ID from the JWT token to ensure users can only access or modify their own profile.

### 5.2. Feature: Post Feed (View & Create)

**Goal:** Users can view a feed of posts from other users and create new posts.

#### 5.2.1. Frontend (`apps/web`) - Next.js

- [ ] Create UI components to display a list of posts (content, author, timestamp, likes, comments count).
- [ ] Fetch post data from the backend API.
- [ ] Implement pagination or infinite scrolling for the feed.
- [ ] Create a form for users to compose and submit new posts.
- [ ] Handle form input and validation.
- [ ] Send new post data to the backend API.
- [ ] Implement UI for like/comment buttons (functionality will be added later).

#### 5.2.2. Backend (`api/`) - Go

- [ ] Define a GORM model for posts (ID, content, author ID, timestamp, etc.).
- [ ] Create an API endpoint (`GET /api/posts`) to retrieve a list of posts.
- [ ] Implement logic to fetch posts from the database, potentially with filtering and pagination.
- [ ] Create an API endpoint (`POST /api/posts`) to allow authenticated users to create new posts.
- [ ] Implement logic to save new posts to the database.
- [ ] Validate post content.
- [ ] Ensure API endpoints are protected and integrate with Supabase authentication.

### 5.3. Feature: Timeline (Main Feed)

**Goal:** The home page will serve as the main timeline, displaying a consolidated feed of posts from followed users and relevant content.

#### 5.3.1. Frontend (`apps/web`) - Next.js

- [ ] Integrate post feed display into the main dashboard layout.
- [ ] Implement a visually appealing and interactive timeline UI.
- [ ] Consider infinite scrolling or pagination for loading more posts.
- [ ] Fetch and display posts from various sources (e.g., followed users, trending topics).
- [ ] Ensure like, comment, and share buttons are integrated (UI only for now).

#### 5.3.2. Backend (`api/`) - Go

- [ ] Create an API endpoint (`GET /api/timeline`) to fetch a personalized feed for the authenticated user.
- [ ] Implement logic to aggregate posts based on follow relationships and other criteria.

### 5.4. Feature: Stories

**Goal:** Users can view and create short, ephemeral stories.

#### 5.4.1. Frontend (`apps/web`) - Next.js

- [ ] Create a UI component to display a carousel or list of active stories.
- [ ] Implement a full-screen viewer for individual stories.
- [ ] Create a form or interface for users to upload images/videos and create new stories.
- [ ] Add a placeholder UI element on the dashboard for stories.

#### 5.4.2. Backend (`api/`) - Go

- [ ] Define a GORM model for stories (ID, user ID, media URL, expiration time, etc.).
- [ ] Create API endpoints for creating, fetching, and viewing stories.

### 5.5. Feature: Direct Messages

**Goal:** Users can send and receive direct messages with other users.

#### 5.5.1. Frontend (`apps/web`) - Next.js

- [ ] Create a UI to display a list of conversations/chats.
- [ ] Implement a real-time chat interface for sending and receiving messages.
- [ ] Add a placeholder UI element on the dashboard for direct messages.

#### 5.5.2. Backend (`api/`) - Go

- [ ] Define a GORM model for messages (ID, sender ID, receiver ID, content, timestamp, etc.).
- [ ] Create API endpoints for sending, receiving, and retrieving messages.
- [ ] Consider WebSocket integration for real-time messaging.

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
- **chore**: Changes to the build process or auxiliary tools and libraries suchs as documentation generation.

**Scope (Scope of Change):**

The scope can be the name of the component or part of the project affected. Examples: `web`, `api`, `ui`, `go-common`, `config`, `build`, `docs`, `monorepo`, `supabase`, `auth`, `post`, `profile`.

**Subject (Commit Title):**

A brief description of the change in imperative mood (e.g., "add" not "adding").

**Example Commit Messages:**

- `feat(auth): implement form-based signup and login`
- `fix(web): resolve build error by loading env vars`
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

-   **Local Development:**
    -   Create a `.env.local` file in the project root for frontend environment variables:

        ```
        NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

    -   Create a `.env` file in the project root for backend environment variables:

        ```
        DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@db.abcdefghijk.supabase.co:5432/postgres"
        SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET
        ```

    -   **DO NOT COMMIT `.env` or `.env.local` files to the repository.**
-   **CI/CD:** Supabase credentials for CI/CD are managed as GitHub Secrets (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`, `SUPABASE_JWT_SECRET`).

### 8.3. Code Style & Linting

-   Always run `npm run lint` and `npm run format` before committing to ensure code consistency.

### 8.4. Branching Strategy

-   Follow the `develop`/`master` branching strategy as outlined in the `README.md`.
-   Create feature branches from `develop` for new features or bug fixes.
-   Submit Pull Requests to `develop` for `review`.

## 9. Lessons Learned

This project has provided valuable insights into monorepo management, Vercel deployment, and Go serverless functions:

### 9.1. Monorepo Structure & Vercel Compatibility

-   The most robust monorepo structure for Vercel involves placing applications in `apps/` and shared code in `packages/`.
-   Vercel's `builds` and `routes` in `vercel.json` are crucial for explicitly defining how different parts of the monorepo are built and served.
-   The `routes` array is evaluated sequentially, allowing for explicit routing rules (e.g., `/api/*` to backend, `/*` to frontend).
-   **Crucial Insight:** `vercel dev` (and Vercel deployment) expects Go serverless functions to reside directly under a top-level `api/` directory relative to the project root, or within a sub-directory of `apps/` that is explicitly configured in `vercel.json`. The `apps/api` structure is now fully compatible.

### 9.2. Go Serverless Function Naming Convention

-   For Vercel to correctly identify and execute a Go file as a serverless function, it must contain a public function named `Handler(w http.ResponseWriter, r *http.Request)`.
-   **Crucial Insight:** All Go files within the *same package* (e.g., `package api`) cannot have functions with the same name. To have multiple `Handler` functions, each function must reside in its own distinct Go package (e.g., `package health`, `package profile`) within its own directory (e.g., `api/health/index.go`, `api/profile/index.go`). This also requires each function directory to have its own `go.mod` file.

### 9.3. Environment Variables in Monorepos

-   Next.js applications in a monorepo do not automatically read `.env` files from the monorepo root during `next build`.
-   **Solution:** Use `dotenv-cli` in the `build` script of the Next.js application's `package.json` to explicitly load environment variables from the correct relative path (e.g., `dotenv -e ../../.env.local -- next build`).
-   Ensure `dotenv-cli` is installed as a `devDependency` in the Next.js application's `package.json`.
-   For Go backend, `godotenv` can load `.env` files locally, but for Vercel deployment, environment variables must be set in the Vercel Dashboard.

### 9.4. Vercel Dashboard Settings vs. `vercel.json`

-   **`vercel.json` takes precedence.** If `vercel.json` exists, Vercel will primarily rely on its configuration for builds and routing, often ignoring settings in the dashboard.
-   **Recommended Dashboard Settings for this Monorepo:**
    -   **Root Directory:** `.` (or empty)
    -   **Build Command:** `turbo build`
    -   **Development Command:** `turbo dev`
    -   **Include files outside of the Root Directory in the Build Step:** Enabled.

### 9.5. CI/CD Streamlining

-   For Vercel deployments, a separate backend deployment job in GitHub Actions is often unnecessary if the backend is refactored into Vercel serverless functions. Vercel handles the build and deployment of these functions as part of the main project deployment.
-   Keeping CI/CD configurations clean and focused improves maintainability and clarity.

### 9.6. Vercel Go Serverless Function Build Behavior (Crucial Insight)

-   **Problem:** Vercel's build process for Go serverless functions (using `@vercel/go` builder) expects all code for a given serverless function to be consolidated into a single `index.go` file. When multiple `.go` files are present in the function directory (even if they are in the same `package`), Vercel may fail to correctly link or compile them, leading to `undefined` symbol errors during deployment.
-   **Solution:** Always consolidate all Go code for a specific serverless function into its `index.go` file. This includes database connection logic, GORM models, and any other helper functions or structs directly used by that function. Remove any redundant `.go` files from the function directory after consolidation.

## 10. Development Guidelines & Conventions

This section outlines the step-by-step process and rules for creating new API endpoints and other project components, ensuring consistency and Vercel compatibility.

### 10.1. Creating a New Go API (Serverless Function)

To create a new Go serverless API function that is compatible with Vercel and adheres to the project's structure, follow these steps:

1.  **Create Function Directory:**
    -   Inside the `api/` directory at the project root, create a new subdirectory for your API endpoint.
    -   **Example:** For a `/api/posts` endpoint, create `api/posts/`.

    ```bash
    mkdir -p api/posts
    ```

2.  **Create `index.go` File (Consolidated Code):**
    -   Inside the new function directory (`api/posts/`), create a file named `index.go`.
    -   **`index.go` Content:**
        -   Use `package <function_directory_name>` (e.g., `package posts`).
        -   Define a `Handler(w http.ResponseWriter, r *http.Request)` function as the main entry point.
        -   **Crucially, all Go code (including database connection, GORM models, helper functions, and structs) directly related to this serverless function should be placed within this single `index.go` file.** This ensures Vercel's builder correctly compiles all necessary components.
    -   **Example `api/posts/index.go` (Illustrative - actual content will vary based on API logic):**

    ```go
    package posts

    import (
        "encoding/json"
        "net/http"
        "log"
        "os"
        "sync"
        "time"

        "github.com/joho/godotenv"
        "gorm.io/driver/postgres"
        "gorm.io/gorm"
        "github.com/google/uuid"
        // Add other necessary imports here
    )

    // Database connection variables (if needed for this function)
    var (
        db   *gorm.DB
        once sync.Once
    )

    // Connect initializes the database connection (if needed for this function)
    func Connect() (*gorm.DB, error) {
        var err error
        once.Do(func() {
            if os.Getenv("VERCEL_ENV") == "" {
                err = godotenv.Load()
                if err != nil {
                    log.Println("Warning: .env file not found, relying on environment variables")
                }
            }
            dsn := os.Getenv("DATABASE_URL")
            if dsn == "" {
                log.Fatal("FATAL: DATABASE_URL environment variable not set")
            }
            db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
            if err != nil {
                log.Fatalf("FATAL: Failed to connect to database: %v", err)
            }
            log.Println("Database connection successful and pool established.")
        })
        if err != nil {
            return nil, err
        }
        return db, nil
    }

    // GetDB returns the existing database connection pool (if needed for this function)
    func GetDB() (*gorm.DB, error) {
        if db == nil {
            return Connect()
        }
        return db
    }

    // Example GORM Model (if needed for this function)
    type Post struct {
        ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
        Content   string    `json:"content"`
        AuthorID  uuid.UUID `json:"author_id"`
        CreatedAt time.Time `json:"created_at"`
    }

    // Handler is the main entry point for the serverless function
    func Handler(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodGet {
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
            return
        }
        // Example: Fetch posts from DB
        // db, err := GetDB()
        // if err != nil { /* handle error */ }
        // var posts []Post
        // db.Find(&posts)

        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]string{"message": "Posts API endpoint"})
    }
    ```

3.  **Create `go.mod` for the New Function:**
    -   Inside the new function directory (`api/posts/`), create a file named `go.mod`.
    -   **`go.mod` Content:**
        -   `module <function_directory_name>` (e.g., `module posts`).
        -   Specify the Go version (e.g., `go 1.21`).
        -   Add `require` directives for any dependencies used by this function.
    -   **Example `api/posts/go.mod`:**

    ```go
    module posts

    go 1.21

    require (
        // Add your dependencies here, e.g.,
        // github.com/joho/godotenv v1.5.1
        // gorm.io/gorm v1.30.1
        // gorm.io/driver/postgres v1.6.0
        // github.com/google/uuid v1.6.0
    )
    ```

4.  **Update `vercel.json`:**
    -   Add a new entry in the `builds` section of `vercel.json` for your new API function.
    -   **Example Addition in `vercel.json`:**

    ```json
    {
      "version": 2,
      "builds": [
        // ... existing builds
        {
          "src": "api/posts/index.go", // Path to your new function's index.go
          "use": "@vercel/go"
        }
      ]
      // No need for explicit "routes" or "rewrites" for API functions
      // if they are placed directly under the top-level "api/" directory.
    }
    ```

5.  **Run `go mod tidy`:**
    -   Navigate to your new function directory and run `go mod tidy` to manage dependencies and generate `go.sum`.

    ```bash
    cd api/posts
    go mod tidy
    ```

6.  **Test Locally:**
    -   From the project root, run `vercel dev` and test your new API endpoint (e.g., `http://localhost:3000/api/posts`).

### 10.2. General File/Folder Creation Rules

#### 10.2.1. For Frontend (`apps/web`)

-   **React Components:**
    -   Use **PascalCase** for component file names (e.g., `MyNewComponent.tsx`).
    -   Place components in relevant directories (e.g., `apps/web/components/`, or within `app/` directory if it's part of a specific page/layout).
-   **Next.js Pages:**
    -   Create new directories under `apps/web/app/` corresponding to your URL path (e.g., `apps/web/app/dashboard/`).
    -   Inside, create a `page.tsx` file as the entry point for that page.
-   **Utilities/Hooks/Libs:**
    -   Use **kebab-case** or **camelCase** for file names (e.g., `utils/helpers.ts`, `hooks/useAuth.ts`).
    -   Place them in `apps/web/lib/`, `apps/web/utils/`, or `apps/web/hooks/` based on their function.

#### 10.2.2. For Shared Go Modules (`packages/go-common`)

-   **Structure:**
    -   Organize code into logical subdirectories (e.g., `packages/go-common/services/`, `packages/go-common/utils/`).
    -   Each subdirectory can have its own package name (e.g., `package services`, `package utils`).
-   **Dependencies:**
    -   If this shared module requires new dependencies, add them to `packages/go-common/go.mod`.
    -   After adding/removing dependencies, navigate to `packages/go-common` and run `go mod tidy`.

#### 10.2.3. For Shared UI Components (`packages/ui`)

-   **React Components:**
    -   Use **PascalCase** for component file names (e.g., `Button.tsx`, `Card.tsx`).
    -   Place directly in the root of `packages/ui/` or within subdirectories if there's a logical grouping (e.g., `packages/ui/forms/Input.tsx`).
-   **Dependencies:**
    -   Add new dependencies to `packages/ui/package.json`.
    -   Run `npm install` at the project root after modifying `package.json`.