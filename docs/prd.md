# PRD: Dough Days — Bread Bake Journal

## 1. Product Overview
A single-page web app for home bakers to log, track, and review their bread baking
experiments. All data persists locally in the browser via `localStorage`. No backend,
no authentication.

**Constraint:** Max 40KB raw source code (excluding markdown & images).

## 2. Features

### 2.1 Core Features (MVP)
| # | Feature | Description |
|---|---------|-------------|
| F1 | **Add Bake Entry** | Form: bread name, date baked, outcome rating (1–5 🍞), key tweak/note, "would bake again?" toggle |
| F2 | **Bake List** | Scrollable card list, newest first, all logged bakes |
| F3 | **Delete Entry** | Delete any card with confirmation |
| F4 | **localStorage Persistence** | Entries survive refresh |
| F5 | **Summary Bar** | Total bakes + average rating, top of page |

### 2.2 UX Requirements
- Warm, kitchen-y aesthetic: parchment tones, hand-lettered headings, cozy UI
- Responsive: 320px (mobile) → desktop, single-column on small screens
- Accessible: WCAG 2.1 AA basics — labels, contrast, keyboard nav, focus states, aria-live summary
- Native form validation for required fields (name, date, rating)

### 2.3 Security
- XSS prevention: DOM built with `textContent`/`createTextNode` only — never `innerHTML` with user data
- Input length caps (name 100, note 500) + control-char stripping at the store boundary
- No external runtime dependencies (no supply-chain attack surface)
- localStorage is origin-scoped by the browser

## 3. Tech Stack
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Runtime | Vanilla ES modules | No build tooling; tiny; keeps under 40KB |
| Styling | CSS custom properties + native CSS | Warm theme via variables; no CSS-in-JS |
| State | localStorage | Zero backend, per spec |
| Testing | Vitest + jsdom | Fast unit tests for logic + DOM |
| Build | None | Keep it simple |

## 4. Project Structure
```
dough-days-bread-bake-journal/
├── docs/
│   ├── brief.md
│   └── prd.md                 # this file
├── src/
│   ├── index.html             # single-page entry shell
│   ├── main.js                # bootstrap + state refresh loop
│   ├── store/
│   │   └── bakeStore.js       # localStorage CRUD + normalize/validate
│   ├── components/
│   │   ├── dom.js             # tiny safe DOM builder
│   │   ├── BakeForm.js        # entry form
│   │   ├── BakeCard.js        # single bake card + delete
│   │   ├── BakeList.js        # card list + empty state
│   │   └── SummaryBar.js      # total + avg rating
│   ├── utils/
│   │   ├── sanitize.js        # text hygiene + input validation
│   │   └── rating.js          # rating clamp + average
│   └── styles/
│       └── main.css           # warm theme, responsive, focus/motion
├── tests/
│   ├── store/bakeStore.test.js
│   ├── utils/{sanitize,rating}.test.js
│   └── components/BakeForm.test.js
├── tools/
│   ├── check-size.mjs         # enforces the 40KB raw-source budget
│   └── serve.mjs              # tiny static server for local runs
├── package.json
├── vitest.config.js
└── .gitignore
```

## 5. Data Model
```typescript
interface BakeEntry {
  id: string;          // crypto.randomUUID()
  name: string;        // max 100 chars
  date: string;        // ISO date (YYYY-MM-DD)
  rating: number;      // 1–5
  note: string;        // max 500 chars
  bakeAgain: boolean;
  createdAt: number;   // epoch ms, used for newest-first sort
}
```
**localStorage key:** `dough-days-bakes`

## 6. Component Breakdown
- **BakeForm** — five capture fields; rating is an emoji radio group (default 3);
  `onAdd(cleaned)` on submit; resets after save.
- **BakeCard** — title, human-readable date, emoji rating, optional note,
  "Would bake again" / "One-and-done" badge, delete button with `confirm()`.
- **BakeList** — renders cards newest first; friendly empty state.
- **SummaryBar** — computed total + average (1 decimal); `aria-live="polite"`.

## 7. Test Plan
| File | Coverage |
|------|----------|
| `bakeStore.test.js` | CRUD, newest-first ordering, normalization, corrupt/invalid recovery |
| `sanitize.test.js` | trim/collapse, control-char strip, length caps, date validation |
| `rating.test.js` | clamp + average, empty/single/rounding |
| `BakeForm.test.js` | fields render, onAdd payload, rating default, reset |

## 8. Responsive Breakpoints
| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | ≤760px | Single column, form above list, full-width controls |
| Desktop | >760px | Two-column grid (sticky form | scrolling list) |

## 9. Acceptance Criteria
- [x] All 5 fields captured and persisted to localStorage
- [x] Entries display as cards, newest first
- [x] Delete removes entry from DOM and localStorage (with confirm)
- [x] Summary bar shows correct totals + average
- [x] Page survives refresh with data intact
- [x] Responsive at 375px and desktop
- [x] Zero console errors
- [x] All unit tests pass (29)
- [x] Raw source ≤ 40KB (actual 18.9KB)
- [x] No XSS: `innerHTML` never used with user data

## 10. How to Run
```bash
npm install
npm test            # run unit tests (Vitest)
npm run check:size  # verify 40KB raw-source budget
npm run serve       # open http://localhost:8080/index.html
```
