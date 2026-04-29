# 🍽️ AI Food Frontend

A React + TypeScript frontend for the [ai-food-backend](https://github.com/rohitanakiya/foodhelp) semantic food recommender.

## What it does

A search bar that takes natural-language queries like *"cheap high protein veg food in bangalore"* and renders the top semantic matches as ranked food cards. Filters extracted from the query are shown as colored chips above the results. Each card shows the restaurant, price, protein, calories, rating, and a semantic-match bar.

## Tech stack

- **Vite** — fast dev server, ESM-native
- **React 19** — UI
- **TypeScript** — strict, with `verbatimModuleSyntax`
- **Tailwind CSS v3** — utility-first styling
- **TanStack Query** — async state, loading/error handling
- **lucide-react** — icons
- **clsx + tailwind-merge** — class composition

## Running it

You need the **ai-food-backend** running on `http://localhost:4000` for this UI to do anything. See the backend README for setup.

```bash
npm install      # if you haven't yet
npm run dev
```

Open `http://localhost:5173`.

If the backend is on a different host or port, override at startup:

```bash
VITE_API_BASE=http://your-backend npm run dev
```

## Architecture

```
src/
├── main.tsx                    QueryClientProvider, root render
├── App.tsx                     Layout: header, search, results
├── components/
│   ├── SearchBar.tsx           Input + submit, Enter handling, loading state
│   ├── SuggestedQueries.tsx    Quick-pick chips of sample queries
│   ├── FilterChips.tsx         Renders extracted filters as colored pills
│   └── ResultCard.tsx          One ranked food item with stats + similarity bar
├── lib/
│   ├── api.ts                  Typed POST /chat/recommend client
│   └── utils.ts                cn() helper for tailwind-merge
└── index.css                   Tailwind directives
```

## v1 scope

This is the smallest useful frontend: anonymous search, no auth, talks directly to the food-backend. Future:

- **v2** — Signup form → store API key → all calls go through `/gw/*` on the rate-limiter at `:8000`.
- **v3** — Login flow, JWT, `/profile/me` page, history of past searches.
- **v4** — Filter UI to refine extracted filters before re-querying.

## CORS

The backend's `app.ts` defaults `CORS_ORIGINS` to include `http://localhost:5173`, which is Vite's default port. If you change either side's port, sync them up via the `CORS_ORIGINS` env var on the backend.

## Build for production

```bash
npm run build       # outputs to dist/
npm run preview     # serves the built bundle for sanity check
```

The build is a static site — deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
