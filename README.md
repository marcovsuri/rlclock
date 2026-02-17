# RL Clock

**RL Clock** is a real-time digital assistant for Roxbury Latin students. It displays the current class schedule, period countdown, lunch menu, sports results, upcoming games, service tracking, and announcements — all in one interface.

**Live at [rlclock.com](https://rlclock.com)**

---

## Features

- **Period Tracker** — Shows the current period and time remaining, adjusting automatically for special or modified schedules.
- **Lunch Menu** — Displays the day's school lunch pulled from Sage Dining.
- **Sports** — Recent game results with scores and win/loss records, plus upcoming games for the day.
- **Service Tracking** — Daily and monthly views with progress bars for donation goals.
- **Announcements** — Active school announcements displayed in a modal overlay.
- **Dark Mode** — System, light, and dark theme support.
- **Responsive Design** — Works on desktop and mobile.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Framer Motion, React Router, Zod |
| Backend | Supabase Edge Functions (Deno), PostgreSQL |
| Deployment | GitHub Pages |

---

## Getting Started

### Prerequisites

- Node.js
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Deno

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/marcovsuri/rlclock.git
   cd rlclock
   ```

2. Open `rlclock.code-workspace` in VS Code and install recommended extensions.

### Frontend

1. Create a `.env` file in `frontend/` with the required environment variables:

   ```env
   REACT_APP_LUNCH_MENU_URL=***
   REACT_APP_SPORTS_URL=***
   REACT_APP_UPCOMING_SPORTS_URL=***
   REACT_APP_ANNOUNCEMENTS_URL=***
   REACT_APP_EXAMS_URL=***
   REACT_APP_SUPABASE_ANON_KEY=***
   ```

2. Install dependencies and start the dev server:

   ```bash
   cd frontend
   npm install
   npm start
   ```

   The app runs at `localhost:3000`.

### Backend

1. Start Supabase and serve edge functions locally:

   ```bash
   supabase start
   supabase functions serve
   ```

2. Deploy edge functions when ready:

   ```bash
   supabase functions deploy
   ```

---

## Project Structure

```
rlclock/
├── frontend/
│   └── src/
│       ├── pages/          # Home, Lunch, Sports, Service, ExamSchedule
│       ├── components/     # Reusable UI (Clock, MenuGrid, ResultsCard, etc.)
│       ├── core/           # Data fetching logic
│       ├── types/          # TypeScript type definitions
│       ├── hooks/          # Custom React hooks
│       ├── App.tsx         # Routing and layout
│       └── styles.css      # Global styles with dark mode
├── supabase/
│   └── functions/          # Edge functions
│       ├── getAnnouncements/
│       ├── getLunch/
│       ├── getSports/
│       ├── getUpcomingSports/
│       ├── getExams/
│       └── getServiceData/
└── rlclock.code-workspace
```
