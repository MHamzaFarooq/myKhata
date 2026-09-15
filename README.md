<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-database-4169e1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<h1 align="center">MyKhata</h1>

<p align="center">
  A personal finance tracker that helps you log income &amp; expenses, understand your spending at a glance, chat with an AI assistant about your money, and get a branded PDF report in your inbox every month.
</p>

---

## Overview

**MyKhata** ("my ledger") is a full-stack expense tracking app built with the Next.js App Router. It pairs a fast, server-rendered dashboard with a Postgres-backed data layer, an AI chat assistant scoped to your own spending data, and automated monthly PDF reports delivered by email — all wrapped in a polished, dark-themed UI.

## Features

### 📊 Dashboard & analytics
- At-a-glance **income, expense, and balance** summary cards
- Interactive **income vs. expense line chart** for the current month (Recharts)
- A **GitHub-style activity heatmap** of daily transaction activity
- Full **transaction history** with type/month filtering and pagination

### 💸 Transaction management
- Add income or expense entries with amount, category, description, and date
- Expense transactions are organized into **customizable categories**, seeded with sensible defaults (Food & Dining, Groceries, Transportation, Bills & Utilities, etc.) for every new account
- Delete transactions inline, with instant UI feedback (toasts)

### 🤖 AI expense assistant — "Chotta"
- A chat widget powered by **Claude** that answers natural-language questions about your own spending — e.g. *"How much did I spend on rent last month?"*
- Strictly scoped: it can only compute totals from your real transaction data (via structured output + a database query), and politely declines anything outside that — no hallucinated numbers, no off-topic chat

### 📧 Automated monthly PDF reports
- Toggle **monthly reports on/off** right from the profile menu, plus a **"Send test report now"** button to preview instantly
- Every report is a branded, multi-page **PDF** (built with `@react-pdf/renderer`) containing:
  - Income / expense / balance summary
  - A full spending-by-category breakdown with percentage share
  - Every transaction for the month
- Delivered via a matching branded HTML email (Resend + React Email), with the PDF attached
- Sent automatically on the 1st of every month for all opted-in users via a **Vercel Cron** job

### 🔐 Authentication
- Email/password auth with **bcrypt**-hashed passwords and Zod-validated forms
- **Sign in with Google** (OAuth 2.0 authorization-code flow with CSRF state validation)
- Secure, database-backed sessions via HTTP-only cookies

### 🎨 Polished UI/UX
- Dark, brand-consistent design system throughout (dashboard, chat, emails, and PDFs all share the same palette)
- Smooth open/close animations, toast notifications (Sonner), and responsive layouts down to mobile

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Database | PostgreSQL (via `pg`) |
| Auth | Cookie-based sessions, bcrypt, Google OAuth 2.0 |
| AI | Claude (`@anthropic-ai/sdk`) with structured (Zod-typed) output |
| Charts | Recharts |
| Email | Resend + React Email |
| PDF generation | `@react-pdf/renderer` |
| Notifications | Sonner |
| Validation | Zod |
| Scheduling | Vercel Cron |

## Architecture

The app follows a simple, layered structure to keep data access, business logic, and UI concerns separate:

```
Route / Server Action  →  Service (lib/services)  →  Repository (lib/repositories)  →  Postgres
```

- **Repositories** (`lib/repositories`) — raw SQL queries, one file per domain (users, transactions, categories)
- **Services** (`lib/services`) — business logic, auth checks, and orchestration (e.g. building a monthly report, answering a chat question)
- **Server Actions** (`app/dashboard/actions.ts`, etc.) — the boundary the client calls into
- **UI** (`app/**`) — App Router pages and client components

## Project structure

```
app/
  api/
    auth/google/         Google OAuth start + callback
    chat/                 Chat assistant endpoint
    cron/monthly-report/  Monthly report cron endpoint
  dashboard/               Dashboard page, navbar, forms, charts, chat widget
  login/  register/        Auth pages + server actions
emails/
  monthly-report.tsx       Branded HTML email template (React Email)
lib/
  pdf/                     Branded PDF report template (@react-pdf/renderer)
  repositories/             SQL data access
  services/                 Business logic
  validations/               Zod schemas
  db.ts  session.ts          Postgres pool + session helpers
vercel.json                 Cron schedule for monthly reports
```

## Getting started

### Prerequisites
- Node.js 20+
- A PostgreSQL database
- API keys for [Resend](https://resend.com) and [Anthropic](https://console.anthropic.com) (only needed for email/AI features)
- A Google OAuth client (only needed for "Sign in with Google")

### 1. Clone & install

```bash
git clone https://github.com/MHamzaFarooq/myKhata.git
cd myKhata
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Claude API key, powers the chat assistant |
| `RESEND_API_KEY` | Resend API key, sends monthly report emails |
| `RESEND_FROM_EMAIL` | Verified sender address, e.g. `MyKhata Reports <reports@yourdomain.com>` |
| `RESEND_REPLY_TO_EMAIL` | Reply-to address for report emails |
| `CRON_SECRET` | Random secret used to authorize the Vercel Cron request |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |

The OAuth callback URL is derived from the incoming request, not an env var, so it automatically matches whichever domain you're on (`localhost` in dev, your real domain in prod). For "Sign in with Google" to work, add `<your-domain>/api/auth/google/callback` to **Authorized redirect URIs** on your OAuth client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) — for every domain the app is reachable on (e.g. both `localhost:3000` for dev and your production domain).

### 3. Set up the database

MyKhata doesn't use a migration tool — apply this schema to your Postgres database:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar NOT NULL,
  email varchar NOT NULL UNIQUE,
  password text,
  monthly_report_enabled boolean NOT NULL DEFAULT false,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  provider varchar NOT NULL,
  provider_account_id varchar NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  expires_at timestamp NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  name varchar NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  category_id uuid REFERENCES categories(id),
  description text,
  amount integer NOT NULL,
  transaction_type varchar NOT NULL,
  transaction_date date NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000/register](http://localhost:3000/register) to create an account, then head to `/dashboard`.

## Deployment

The app is designed to deploy on [Vercel](https://vercel.com):

1. Import the repo into Vercel and add the environment variables above to the project settings.
2. `vercel.json` already defines a cron job that hits `/api/cron/monthly-report` at 06:00 UTC on the 1st of every month — Vercel picks this up automatically and authenticates the request using `CRON_SECRET`.
3. Verify your sending domain in Resend and point `RESEND_FROM_EMAIL` at it for production email delivery.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
