# RL Clock

RL Clock is a Roxbury Latin student dashboard. The app is a React Router frontend backed by Supabase Edge Functions for schedule, lunch, and athletics data.

Live site: [rlclock.com](https://rlclock.com)

## Frontend

The frontend now lives in `frontend/` as a React Router 7 app using React 19, TypeScript, Vite, and Framer Motion.

Current routes:

- `/` - home dashboard with the live clock, lunch preview, and recent sports results
- `/lunch` - full lunch menu view
- `/sports` - upcoming games, recent results, and computed team records

Current UI features:

- responsive mobile/desktop layouts
- animated navigation drawer
- light, dark, and system theme selection
- client-side data loading through React Router `clientLoader`s
- localStorage-based fetch caching with Zod validation

## Backend

Supabase Edge Functions live in `supabase/functions/`.

Functions actively used by the current frontend:

- `getSchedule` - returns the current day schedule, using Supabase as a cache layer
- `getMenu` - fetches and caches the daily Sage Dining lunch menu
- `getMatches` - scrapes recent athletics results and filters to the current season
- `getUpcomingMatches` - scrapes upcoming athletics events and filters to the current season

Additional functions still present in the repo:

- `getAnnouncements`
- `getExams`
- `getServiceData`

Those extra functions are not currently wired into the React Router frontend routes in `frontend/app/routes.ts`.

## Notes On Data Sources

- `getMenu` fetches lunch data from Sage Dining.
- `getMatches` and `getUpcomingMatches` scrape Roxbury Latin athletics pages.
- `getSchedule` currently transforms a placeholder schedule defined in `supabase/functions/getSchedule/refresh.ts` and caches it in Supabase.
- The sports parsers use season start constants in their parse files, so those dates need to be updated as seasons change.

## Tech Stack

| Layer       | Technologies                                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| Frontend    | React 19, React Router 7, TypeScript, Vite, Framer Motion, Zod                                           |
| Backend     | Supabase Edge Functions, Supabase Postgres, Deno                                                         |
| Data access | Browser fetch + localStorage cache on the frontend, Supabase + external fetch/scraping in edge functions |

## Getting Started

### Prerequisites

- Node.js
- npm
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Deno

### 1. Clone the repo

```bash
git clone https://github.com/marcovsuri/rlclock.git
cd rlclock
```

### 2. Run the frontend

Install dependencies:

```bash
cd frontend
npm install
```

Create `frontend/.env` with the current frontend variables:

```env
VITE_SCHEDULE_URL=http://127.0.0.1:54321/functions/v1/getSchedule
VITE_MENU_URL=http://127.0.0.1:54321/functions/v1/getMenu
VITE_MATCHES_URL=http://127.0.0.1:54321/functions/v1/getMatches
VITE_UPCOMING_MATCHES_URL=http://127.0.0.1:54321/functions/v1/getUpcomingMatches
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the dev server:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

### 3. Run Supabase locally

From the repo root:

```bash
supabase start
supabase functions serve
```

Local functions are then available at:

```text
http://127.0.0.1:54321/functions/v1/<function-name>
```

### 4. Typecheck the frontend

```bash
cd frontend
npm run typecheck
```

## Project Structure

```text
rlclock/
├── frontend/
│   ├── app/
│   │   ├── components/     # UI components for home, lunch, sports, and shared controls
│   │   ├── core/           # Fetcher classes and client-side cache helpers
│   │   ├── hooks/          # Theme and viewport hooks
│   │   ├── routes/         # Home, lunch, sports, and catch-all routes
│   │   ├── shared/         # Shared fetcher wiring and error helpers
│   │   ├── types/          # Zod-backed frontend types (based on backend types)
│   │   ├── utils/          # Utilities for components (e.g., clock display, sports calculations)
│   │   ├── app.css         # Global styles
│   │   └── root.tsx        # Document shell and app layout
│   ├── package.json
│   └── README.md
├── supabase/
│   ├── functions/ # Edge functions
│   │   ├── _shared/              # Shared Supabase client and CORS helpers
│   │   ├── getSchedule/
│   │   ├── getMenu/
│   │   ├── getMatches/
│   │   ├── getUpcomingMatches/
│   │   ├── getAnnouncements/
│   │   ├── getExams/
│   │   └── getServiceData/
│   ├── migrations/
│   └── config.toml
├── .github/workflows/
├── rlclock.code-workspace
└── README.md
```
