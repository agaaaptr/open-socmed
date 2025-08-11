# Cirqle (open-socmed)

![Cirqle Logo](./apps/web/public/logo.png)

**Cirqle** is a modern, full-stack social media platform built with a Next.js frontend, a Go backend, and a robust monorepo architecture managed by Turborepo. It's designed to be a feature-rich, responsive, and visually appealing open-source social application.

## ✨ Features

- **Authentication:** Secure user sign-up and sign-in with email/password via Supabase Auth.
- **Dynamic Timeline:** A personalized feed that aggregates posts from followed users.
- **Post Management:** Create, edit, and delete your own posts with a modern UI.
- **User Profiles:** View and edit user profiles, including display names and unique usernames.
- **Social Graph:** Easily search for, follow, and unfollow other users.
- **Profile Stats:** View dynamic counts and lists of posts, followers, and users you are following.
- **Fully Responsive:** A mobile-first design ensures a seamless experience on any device, from phones to desktops.
- **Modern UI/UX:** Built with a custom "Subtle Harmony" color palette, smooth animations via Framer Motion, and a clean, intuitive layout.
- **Notifications:** Real-time updates for new followers, with options to follow back and mark as read.
- **And much more:** Including toast notifications, confirmation modals, pull-to-refresh on mobile, and more.

## 🛠️ Tech Stack

| Area      | Technologies                                                                                             |
| :-------- | :------------------------------------------------------------------------------------------------------- |
| **Monorepo**  | [Turborepo](https://turbo.build/repo), [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) |
| **Frontend**  | [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Backend**   | [Go](https://go.dev/), [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions), [GORM](https://gorm.io/) |
| **Database**  | [Supabase](https://supabase.com/) (PostgreSQL + Auth)                                                    |
| **Deployment**| [Vercel](https://vercel.com/), [GitHub Actions](https://github.com/features/actions) for CI/CD          |

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- Go (v1.21 or higher)
- npm (v8 or higher)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/open-socmed.git
    cd open-socmed
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Supabase:**
    You can either connect to a remote Supabase project or run one locally using Docker.
    ```bash
    # Login to Supabase
    supabase login

    # Link to your remote project OR start a local instance
    supabase link --project-ref your-project-ref
    # --- OR ---
    supabase start
    ```

4.  **Set up Environment Variables:**
    Create two files in the project root: `.env` and `.env.local`.
    - Get the required URLs and Keys from your Supabase project dashboard.
    - If running Supabase locally, use the keys provided in the terminal after running `supabase start`.

    **For the Backend (`.env`):**
    ```env
    DATABASE_URL="YOUR_SUPABASE_DATABASE_URL_WITH_PGBOUNCER"
    SUPABASE_JWT_SECRET="YOUR_SUPABASE_JWT_SECRET"
    ```

    **For the Frontend (`.env.local`):**
    ```env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```
    > **Note:** These `.env` files are ignored by Git and should not be committed.

5.  **Push Database Migrations:**
    Apply the database schema to your Supabase instance.
    ```bash
    supabase db push
    ```

### Running the Development Server

Start the frontend and backend development servers concurrently.

```bash
npm run dev
```

The Next.js app will be available at `http://localhost:3000`, and Vercel CLI will serve the Go API functions.

## 🏗️ Project Structure

The monorepo is organized into three main areas:

-   **`apps/web`**: The main Next.js frontend application.
-   **`api/`**: The backend API, consisting of Vercel Serverless Functions written in Go. Each sub-directory is a separate, self-contained serverless function.
-   **`packages/ui`**: A shared library for common React/Tailwind components used in the web app.

## 🤝 Contributing

We welcome contributions! Please follow these guidelines to ensure a smooth development process.

### Commit Messages

All commits **must** adhere to the [Semantic Commit Messages](https://www.conventionalcommits.org/en/v1.0.0/) standard.

-   **Format:** `<type>(<scope>): <subject>`
-   **Example:** `feat(profile): add endpoint for updating user profiles`
-   **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
-   **Scopes:** `web`, `api`,- `ui`, `docs`, `monorepo`, `auth`, `post`, etc.

### Development Workflow

1.  **Create a branch:** Create a new feature branch from `develop`.
2.  **Make changes:** Implement your feature or bug fix.
3.  **Lint and Build:** Before committing, always run the linter and build the project to catch errors.
    ```bash
    npm run lint
    npm run build
    ```
4.  **Commit your changes:** Follow the semantic commit guidelines.
5.  **Push and create a Pull Request:** Push your branch to the repository and open a PR against the `develop` branch.

### API Development Guide (Go)

To create a new Go serverless API function that is compatible with Vercel, follow these steps:

1.  **Create Function Directory**: Inside the `api/` directory, create a new subdirectory for your endpoint (e.g., `api/new-feature/`).

2.  **Create `index.go` File**:
    -   Inside the new directory, create an `index.go` file.
    -   The package name **must** match the directory name (e.g., `package new_feature`).
    -   The entry point must be a `Handler` function: `func Handler(w http.ResponseWriter, r *http.Request)`.
    -   **Crucially, all Go code for the function (db connection, models, helpers) should be in this single `index.go` file to ensure Vercel builds it correctly.**

3.  **Create `go.mod`**:
    -   Inside the function directory, create a `go.mod` file.
    -   The module name should match the directory name (e.g., `module new_feature`).
    -   Add your dependencies here.

4.  **Update `vercel.json`**:
    -   Add a new entry to the `builds` array in the root `vercel.json` file:
        ```json
        {
          "src": "api/new-feature/index.go",
          "use": "@vercel/go"
        }
        ```

5.  **Tidy Dependencies**:
    -   Run `go mod tidy` inside your new function's directory.

    ```bash
    cd api/new-feature
    go mod tidy
    ```

### Frontend Development Guide (Next.js)

-   **Components**: Use **PascalCase** for component files (`MyComponent.tsx`) and place them in `apps/web/components/` or `packages/ui/`.
-   **Pages**: Create new page routes by creating a folder under `apps/web/app/` and adding a `page.tsx` file.
-   **Utilities**: Use **kebab-case** or **camelCase** for utility files (e.g., `lib/utils.ts`).