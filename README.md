# Ujjwal's Personal Wealth & Europe Migration Tracker

Personal dashboard to track wealth across multiple currencies and plan European migration journey. Built with Next.js, Tailwind CSS, shadcn/ui, and localStorage for data persistence.

## Features

- **Dashboard** — Net worth overview, growth chart, migration progress at a glance
- **Wealth Tracker** — Manage accounts in EUR, USD, GBP, CHF, add snapshots to track growth
- **Migration Checklist** — Tasks by category (visa, documents, finance, housing, healthcare, tax), priorities, and due dates
- **Settings** — Customize profile, base currency, and target country
- **Local Storage** — All data saved in your browser, no cloud sync required (works offline)

## Features

- **Dashboard** — Net worth overview, growth chart, migration progress
- **Wealth Tracker** — Multi-currency accounts (EUR, USD, GBP, CHF), assets & liabilities, snapshots
- **Migration Tracker** — Target country, visa type, checklist by category, due dates
- **Settings** — Profile, base currency, demo reset
- **Demo mode** — Works immediately without Supabase (localStorage)

## Quick start (demo mode)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Open Demo**.

## Production setup (Supabase + Vercel)

### 1. Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL Editor
3. Copy Project URL and anon key from Settings → API

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add the same env vars
4. Deploy

## Project structure

```
src/
├── app/
│   ├── dashboard/     # Main overview
│   ├── wealth/        # Accounts & net worth
│   ├── migration/     # Checklist & goals
│   ├── settings/      # Profile
│   ├── login/         # Auth
│   └── signup/
├── components/
│   ├── ui/            # shadcn-style components
│   └── layout/        # Sidebar, mobile nav
├── contexts/          # App state (demo mode)
└── lib/               # Types, Supabase, utils
supabase/migrations/   # Database schema
```

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) patterns
- [Supabase](https://supabase.com) (Auth + Postgres)
- [Recharts](https://recharts.org) (charts)
- [Vercel](https://vercel.com) (hosting)

## License

MIT
