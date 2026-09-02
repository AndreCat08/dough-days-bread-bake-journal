# Dough Days: Bread Bake Journal
You're an enthusiastic home baker who has tried dozens of bread recipes — sourdough boules, focaccia slabs, seeded rye loaves — but you keep forgetting which tweaks worked and which flopped. Build a single-page **Bread Bake Journal** that lets you log each bake as a card.

Each entry should capture:
- **Bread name** (e.g. "Honey Oat Sandwich Loaf")
- **Date baked**
- **Outcome rating** — a simple 1–5 crust emoji scale (🍞🍞🍞🍞🍞)
- **Key tweak or note** (a short free-text field, e.g. "added 10 min steam" or "over-proofed")
- **Would bake again?** toggle (yes / no)

All entries must persist in `localStorage` so refreshing the page keeps the log intact. The journal should display all past bakes as a scrollable list of cards, newest first. Users must be able to delete any entry. Optionally, a small summary line at the top showing total bakes and average rating adds a nice finishing touch.

The visual style should feel warm and kitchen-y — think parchment tones, hand-lettered-style headings, and cozy UI. No backend, no login — just a baker and their notes.

max 40KB raw source (not zip size; markdown & images don't count).