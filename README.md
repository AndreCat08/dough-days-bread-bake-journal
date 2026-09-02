# Dough Days — Bread Bake Journal

A cozy, single-page **bread bake journal** that lives entirely in your browser.
Log every loaf as a card, rate the crust, jot the tweak that made or broke it,
and keep the whole log in `localStorage` — no backend, no login, just a baker
and their notes.

Warm parchment styling, hand-lettered headings, fully responsive from phone to
desktop.

## Features

- **Log a bake** — name, date, crust rating (1–5), key tweak/note, and a "would
  bake again?" toggle
- **Card list** — all past bakes, newest first, with a friendly empty state
- **Delete** — remove any entry (with a confirmation)
- **Summary bar** — total bakes + average rating, updated live
- **Persistence** — data survives page refresh via `localStorage`
- **Secure by construction** — user data is rendered with `textContent` only
  (no `innerHTML`), with input length caps and control-character stripping
- **Responsive & accessible** — keyboard nav, focus states, `aria-live` summary,
  single-column on mobile

## Quick Start

```bash
npm install
npm run serve
```

Then open http://localhost:8080/index.html

No build step — the app is plain ES modules served as static files.

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run serve` | Local static server at `http://localhost:8080/index.html` (set `PORT` to change) |
| `npm test` | Run the unit test suite (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run check:size` | Verify the app stays within the 40KB raw-source budget |

## Project Structure

```
dough-days-bread-bake-journal/
├── docs/
│   ├── brief.md              # original brief
│   └── prd.md                # product requirements + architecture
├── src/
│   ├── index.html            # single-page shell
│   ├── main.js               # bootstrap + refresh loop
│   ├── store/
│   │   └── bakeStore.js      # localStorage CRUD + normalize/validate
│   ├── components/
│   │   ├── dom.js            # tiny safe DOM builder (textContent only)
│   │   ├── BakeForm.js       # entry form (5 fields)
│   │   ├── BakeCard.js       # single bake card + delete
│   │   ├── BakeList.js       # card list + empty state
│   │   └── SummaryBar.js     # total + average rating
│   ├── utils/
│   │   ├── sanitize.js       # text hygiene + input validation
│   │   └── rating.js         # rating clamp + average
│   └── styles/
│       └── main.css          # warm theme, responsive, focus & motion
├── tests/
│   ├── store/bakeStore.test.js
│   ├── utils/{sanitize,rating}.test.js
│   └── components/BakeForm.test.js
└── tools/
    ├── check-size.mjs        # 40KB raw-source budget guard
    └── serve.mjs             # tiny static server
```

## Tech Stack

- **Runtime:** Vanilla JavaScript (ES modules) — no framework, no build tooling
- **State:** `localStorage` under the key `dough-days-bakes`
- **Styling:** Native CSS with custom properties
- **Testing:** [Vitest](https://vitest.dev) + jsdom

## Constraints

- Raw source must stay **under 40KB** (markdown & images excluded) — enforced by
  `npm run check:size`. Current total is well within budget.

## Data Model

Each entry stored as:

```json
{
  "id": "uuid",
  "name": "Honey Oat Sandwich Loaf",
  "date": "2026-09-02",
  "rating": 5,
  "note": "added 10 min steam",
  "bakeAgain": true,
  "createdAt": 1756800000000
}
```
