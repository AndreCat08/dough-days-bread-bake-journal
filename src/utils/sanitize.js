// Text hygiene at the trust boundary (user input -> storage/DOM).
// DOM rendering never uses innerHTML with user data (see components), so
// XSS is handled structurally; these helpers guard size and format.

const NAME_MAX = 100;
const NOTE_MAX = 500;
// Strip C0 control chars (keeps plain text safe for date/name) + tab/newline.
const CONTROL = /[\u0000-\u001F\u007F]/g;

/** Trim, drop control chars, and cap length. Returns '' for non-strings. */
export function cleanText(value, max = NOTE_MAX) {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function cleanName(value) {
  return cleanText(value, NAME_MAX);
}

export function cleanNote(value) {
  return cleanText(value, NOTE_MAX);
}

/** Accept YYYY-MM-DD; reject empty/invalid. Returns the value or ''. */
export function cleanDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  return Number.isNaN(Date.parse(value)) ? '' : value;
}

export const LIMITS = { NAME_MAX, NOTE_MAX };
