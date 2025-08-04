# open-socmed

`open-socmed` is a full-stack social media platform built as a monorepo using Turborepo, Next.js, Go, and Supabase.

## Monorepo Structure

This project is structured as a monorepo to manage multiple applications and shared packages efficiently.

- **`apps/web`**: The Next.js frontend application.
- **`apps/api`**: The Go backend API, deployed as Vercel Serverless Functions.
- **`packages/ui`**: A shared React component library.
- **`packages/go-common`**: A shared Go module for common functionalities (e.g., database connection, models).

## Technologies Used

- **Monorepo Management**: Turborepo, npm Workspaces
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Query, Supabase Auth
- **Backend**: Go, GORM, Vercel Serverless Functions
- **Database**: Supabase PostgreSQL
- **CI/CD**: GitHub Actions, Vercel

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/agaaaptr/open-socmed.git
cd open-socmed
```

### 2. Install Dependencies

Install all root and workspace dependencies using npm.

```bash
npm install
```

### 3. Supabase Setup

This project relies on Supabase for its database and authentication. If you don't have a Supabase project, create one at [Supabase.com](https://supabase.com/).

#### 3.1. Environment Variables

Create the following `.env` files in the **root of your project** and fill them with your Supabase credentials. These are crucial for both frontend and backend local development.

- **`.env.local` (for Frontend - `apps/web`):

  ```
  NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
  ```

- **`.env` (for Backend - `apps/api`):

  ```
  DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@db.abcdefghijk.supabase.co:5432/postgres"
  SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET
  ```

**Important:** Replace `YOUR_SUPABASE_PROJECT_URL`, `YOUR_SUPABASE_ANON_KEY`, `YOUR_DB_PASSWORD`, and `YOUR_SUPABASE_JWT_SECRET` with your actual Supabase project details. **Do not commit these files to Git.**

#### 3.2. Database Synchronization

Ensure your local Supabase CLI is set up and linked to your remote project. Then, push the schema.

```bash
supabase login
supabase link --project-ref your-project-ref
supabase db push --yes
```

### 4. Run the Development Server

Start the monorepo development server using Turborepo. This will run both the Next.js frontend and make the Go serverless functions available locally.

```bash
npm run dev
```

Access the frontend at `http://localhost:3000` (or `3001` if port 3000 is in use).

### 5. Linting and Building

To lint and build the entire monorepo:

```bash
npm run lint
npm run build
```

## Deployment

This project is designed for deployment on Vercel.

### Vercel Dashboard Configuration

After importing your Git repository to Vercel, ensure the following settings are configured in your Vercel Project Dashboard (`Settings` tab):

- **Framework Preset**: `Next.js`
- **Root Directory**: `.` (or empty)
- **Build Command**: `turbo build`
- **Development Command**: `turbo dev`
- **Include files outside of the Root Directory in the Build Step**: `Enabled`

### Environment Variables on Vercel

Add all necessary environment variables (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`, `SUPABASE_JWT_SECRET`) directly in your Vercel Project Dashboard (`Settings` -> `Environment Variables`).

## Contributing

Follow the [Semantic Commit Messages](https://www.conventionalcommits.org/en/v1.0.0/) standard for all commits.

```
<type>(<scope>): <subject>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
**Scopes:** `web`, `api`, `ui`, `go-common`, `config`, `build`, `docs`, `monorepo`, `supabase`, `auth`, `post`, `profile`

## License

[Specify your license here, e.g., MIT License]