# open-socmed

This is a full-stack social media platform built as a monorepo using Turborepo.

## Project Structure

- `apps/web`: The frontend application built with Next.js (TypeScript), Tailwind CSS, Headless UI, React Query, and Supabase Auth.
- `apps/api`: The backend API built with Go (Gin, GORM) and connected to Supabase PostgreSQL.
- `packages/ui`: A shared library for React/Tailwind components.

## Getting Started

### 1. Clone the repository

```bash
git clone [your-repo-url]
cd open-socmed
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

1.  Create a new project on [Supabase](https://supabase.com/).
2.  In your Supabase dashboard, navigate to "SQL Editor" and run the `supabase_schema.sql` script located in the root of this project. This will set up your database tables and Row Level Security (RLS) policies.
3.  Get your Supabase URL and Anon Key from "Project Settings" -> "API".
4.  Get your Database Connection String from "Project Settings" -> "Database".

### 4. Environment Variables

Create `.env.local` files in the respective application directories and populate them with your Supabase credentials:

#### `apps/web/.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

#### `apps/api/.env.local`

```
DATABASE_URL=YOUR_DATABASE_URL
PORT=8080
```

### 5. Running the Applications

#### Frontend (Next.js)

```bash
npm run dev --workspace=apps/web
```

#### Backend (Go)

```bash
cd apps/api
go run main.go
```

### 6. Building the Project

To build all applications in the monorepo:

```bash
npm run build
```

### 7. Linting and Formatting

```bash
npm run lint
npm run format
```

## Deployment

### Frontend (Next.js) - Vercel

This project is configured for deployment to Vercel. Ensure you have the `VERCEL_TOKEN` set as a GitHub Secret in your repository. The `deploy.yml` GitHub Actions workflow will automatically deploy `apps/frontend` to Vercel on merges to the `main` branch.

### Backend (Go) - Render/Fly.io (Recommended)

For the Go API, it is recommended to deploy to platforms like [Render](https://render.com/) or [Fly.io](https://fly.io/) as they are better suited for long-running Go applications. A separate CI/CD pipeline would typically be set up for the Go application on your chosen platform.
