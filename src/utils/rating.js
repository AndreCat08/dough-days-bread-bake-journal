// Rating math. Ratings are integers 1..5 on the crust-emoji scale.

export const MIN_RATING = 1;
export const MAX_RATING = 5;

/** Coerce anything to a whole number clamped to 1..5 (defaults to 1). */
export function clampRating(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return MIN_RATING;
  return Math.min(MAX_RATING, Math.max(MIN_RATING, n));
}

/** Mean rating of a list of bakes, rounded to 1 decimal. 0 when empty. */
export function averageRating(bakes) {
  if (!Array.isArray(bakes) || bakes.length === 0) return 0;
  const total = bakes.reduce((sum, b) => sum + clampRating(b.rating), 0);
  return Math.round((total / bakes.length) * 10) / 10;
}
