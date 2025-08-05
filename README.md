# open-socmed

`open-socmed` is a full-stack social media platform built as a monorepo using Turborepo. It consists of a Next.js frontend, a Go backend API, and shared UI/Go component libraries.

## 1. Getting Started

To set up the project locally, follow these steps:

### 1.1. Prerequisites

- Node.js (v18 or higher)
- Go (v1.21 or higher)
- npm (v8 or higher)
- Supabase CLI
- Docker (for local Supabase setup, optional)

### 1.2. Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/open-socmed.git
    cd open-socmed
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the project root for frontend environment variables:
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
    Create a `.env` file in the project root for backend environment variables:
    ```
    DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@db.abcdefghijk.supabase.co:5432/postgres"
    SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET
    ```
    **DO NOT COMMIT `.env` or `.env.local` files to the repository.**

4.  **Set up Supabase (Local or Remote):**
    *   **Remote Supabase:** Link your local project to a remote Supabase project:
        ```bash
        supabase login
        supabase link --project-ref your-project-ref
        ```
    *   **Local Supabase (using Docker):**
        ```bash
        supabase start
        ```

5.  **Push database migrations:**
    ```bash
    supabase db push --yes
    ```

### 1.3. Running the Development Server

To start both the frontend and backend development servers:

```bash
npm run dev
```

This will typically run the Next.js frontend on `http://localhost:3000` (or `3001` if `3000` is in use) and the Go API functions will be served by Vercel CLI.

## 2. Project Structure & Conventions

This project follows a monorepo structure managed by Turborepo. Understanding its layout and conventions is crucial for effective contribution.

### 2.1. Core Directories

- **`apps/`**: Contains independent applications within the monorepo.
  - **`apps/web`**: The Next.js frontend application. The 'Stories' section has been removed from the home page.
- **`api/`**: Contains Go serverless functions deployed via Vercel.
  - Each subdirectory within `api/` (e.g., `api/profile`, `api/health`) represents a distinct serverless function.
  - Each function directory must contain a single `index.go` file with a `Handler` function and its own `go.mod`.
- **`packages/`**: Contains shared code and components used across different applications.
  - **`packages/ui`**: Shared React/Tailwind components.
  

### 2.2. Naming Conventions & File Creation

To maintain consistency and Vercel compatibility, please adhere to the following:

- **Go Serverless Functions (`api/`):**
  - **Directory Structure:** Each new API endpoint should reside in its own subdirectory under `api/` (e.g., `api/your_new_endpoint/`).
  - **File Naming:** The main entry file for each function must be `index.go`. **All Go code for a given serverless function (including database connection, GORM models, helper functions, and structs) must be consolidated into this single `index.go` file.**
  - **Package Naming:** The `index.go` file must declare a package name that **exactly matches its parent directory name** (e.g., `package profile` inside `api/profile/`). Using `package main` or a generic `package handler` will cause build failures.
  - **Handler Function:** The entry point for Vercel must be a public function named `Handler(w http.ResponseWriter, r *http.Request)`.
  - **`go.mod`:** Each function directory (`api/your_new_endpoint/`) must have its own `go.mod` file, managing its specific dependencies.

- **Frontend Components (`apps/web` & `packages/ui`):**
  - Follow standard Next.js and React conventions.
  - Use PascalCase for React component files (e.g., `MyComponent.tsx`).
  - Use kebab-case for utility files or non-component modules (e.g., `utils/helpers.ts`).



### 2.3. Responsive Design & UI/UX

The frontend has been significantly refactored to ensure a professional, clean, and fully responsive user experience across all devices. Key improvements include:

-   **Mobile-First Approach:** Layouts are designed for mobile first and then scaled up for tablets and desktops.
-   **Responsive Components:** Core components like the `Sidebar` (which is now always visible on desktop and a mobile-only bottom navigation bar) and navigation elements adapt to different screen sizes.
-   **Optimized Pages:** All major pages, including the Home feed, Profile view/edit, and Sign In/Up forms, have been optimized for readability and ease of use on smaller screens.
-   **Structured Layouts:** Pages are organized into clear, logical sections to improve user comprehension and interaction flow.
-   **Conditional Rendering:** The sidebar and mobile navigation are now conditionally rendered only on the `/home` page, ensuring other pages maintain their full width and centered content.

### 2.4. General Tips for Contributors

- **`vercel dev`:** When running locally, ensure your `vercel.json` is correctly configured to route requests to both frontend and Go API functions.
- **`go.mod` Management:** Always run `go mod tidy` within the specific Go module directory after adding or removing dependencies.
- **Linting & Formatting:** Before committing, always run `npm run lint` and `npm run format` from the project root to ensure code consistency.
- **Testing:** If applicable, write and run tests for your changes.

### 2.4. API Development Guidelines

To create a new Go serverless API function that is compatible with Vercel and adheres to the project's conventions, follow these steps:

1.  **Create Function Directory:**
    *   Inside the `api/` directory at the project root, create a new subdirectory for your API endpoint.
    *   **Example:** For a `/api/posts` endpoint, create `api/posts/` (this will be the module name).
    ```bash
    mkdir -p api/posts
    ```

2.  **Create `index.go` File (Consolidated Code):**
    *   Inside the new function directory (`api/posts/`), create a file named `index.go`.
    *   **`index.go` Content:**
        *   Use `package <function_directory_name>` (e.g., `package posts`).
        *   Define a `Handler(w http.ResponseWriter, r *http.Request)` function as the main entry point.
        *   **Crucially, all Go code (including database connection, GORM models, helper functions, and structs) directly related to this serverless function should be placed within this single `index.go` file.** This ensures Vercel's builder correctly compiles all necessary components.
    *   **Example `api/posts/index.go` (Illustrative - actual content will vary based on API logic):**

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
    *   Inside the new function directory (`api/posts/`), create a file named `go.mod`.
    *   **`go.mod` Content:**
        *   `module <function_directory_name>` (e.g., `module posts`).
        *   Specify the Go version (e.g., `go 1.21`).
        *   Add `require` directives for any dependencies used by this function.
    *   **Example `api/posts/go.mod`:**

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
    *   Add a new entry in the `builds` section of `vercel.json` for your new API function.
    *   **Example Addition in `vercel.json`:**

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
    *   Navigate to your new function directory and run `go mod tidy` to manage dependencies and generate `go.sum`.

    ```bash
    cd api/posts
    go mod tidy
    ```

6.  **Test Locally:**
    *   From the project root, run `vercel dev` and test your new API endpoint (e.g., `http://localhost:3000/api/posts`).

### 2.5. General File/Folder Creation Rules

#### For Frontend (`apps/web`)

*   **React Components:**
    *   Use **PascalCase** for component file names (e.g., `MyNewComponent.tsx`).
    *   Place components in relevant directories (e.g., `apps/web/components/`, or within `app/` directory if it's part of a specific page/layout).
*   **Next.js Pages:**
    *   Create new directories under `apps/web/app/` corresponding to your URL path (e.g., `apps/web/app/dashboard/`).
    *   Inside, create a `page.tsx` file as the entry point for that page.
*   **Utilities/Hooks/Libs:**
    *   Use **kebab-case** or **camelCase** for file names (e.g., `utils/helpers.ts`).
    *   Place them in `apps/web/lib/`, `apps/web/utils/`, or `apps/web/hooks/` based on their function.



#### For Shared UI Components (`packages/ui`)

*   **React Components:**
    *   Use **PascalCase** for component file names (e.g., `Button.tsx`).
    *   Place directly in the root of `packages/ui/` or within subdirectories if there's a logical grouping (e.g., `packages/ui/forms/Input.tsx`).
*   **Dependencies:**
    *   Add new dependencies to `packages/ui/package.json`.
    *   Run `npm install` at the project root after modifying `package.json`.

## 3. Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 4. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
