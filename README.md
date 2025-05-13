# 🕒 RL Clock

**RL Clock** is a real-time digital assistant designed for students. It displays the current class schedule, what period it is, how much time remains in the current period, the day's lunch menu, recent sports results, and upcoming athletic events — all in one intuitive interface.

---

## 📚 Features

-   ⏱️ **Period Tracker:** Displays the current period and how much time is left.
-   📅 **Daily Schedule Awareness:** Adjusts automatically for special schedules or modified days.
-   🍽️ **Lunch Menu Display:** Shows the school lunch for the day.
-   🏀 **Sports Updates:**
    -   Displays results from the most recent games or matches.
    -   Notifies users about any games or matches happening later in the day.

---

## 🚀 Getting Started

### Prerequisites

-   Node.js
-   Supabase
-   Typescript (tsc) parser
-   Visual Studio Code
-   Deno

### Basic Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/marcovsuri/rlclock.git
    cd rlclock
    ```

2. Open the folder in VS Code
3. Open the VS Code workspace defined in `rlclock.code-workspace` and download recommended extensions.

### Frontend Development

1. Fill out environment variables: Create a `.env` file in `/frontend`. Paste the following contents inside (note that you will need the development secrets):

```env
  REACT_APP_LUNCH_MENU_URL=***
  REACT_APP_SPORTS_URL=***
  REACT_APP_UPCOMING_SPORTS_URL=***
  REACT_APP_SUPABASE_ANON_KEY=***
```

2. Install frontend `npm` packages

```bash
cd frontend
npm install
```

3. Run the frontend on `localhost:3000`

```bash
npm start
```

### Backend Development

1. Start supabase and then serve edge functions locally

```bash
supabase start
supabase functions serve
```

#### Once You're Ready to Deploy Changes

```bash
supabase functions deploy
```
