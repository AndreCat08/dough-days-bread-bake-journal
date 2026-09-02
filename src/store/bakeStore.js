// bakeStore: the only module that touches localStorage.
// Every read normalizes + validates per entry, so one bad row can never wipe
// the collection or pollute Object.prototype. Writes never throw — failures
// come back as data so the UI can surface them to the user.
//
// @typedef {Object} BakeEntry
// @property {string}  id
// @property {string}  name
// @property {string}  date        ISO date, YYYY-MM-DD
// @property {number}  rating      whole number 1..5
// @property {string}  note
// @property {boolean} bakeAgain
// @property {number}  createdAt   epoch milliseconds
//
// @typedef {Object} WriteResult
// @property {boolean} ok
// @property {BakeEntry|null} [bake]
// @property {boolean} [removed]
// @property {string} [error]      present when ok is false

import { cleanName, cleanNote, cleanDate } from '../utils/sanitize.js';
import { clampRating } from '../utils/rating.js';

export const STORAGE_KEY = 'dough-days-bakes';
const defaultStorage = globalThis.localStorage;

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return 'bake-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

// Read only named fields and build a fresh literal — never spread raw input,
// so stored "__proto__"/"constructor" keys cannot escape into the result.
function normalize(bake, fallbackNow) {
  const now = fallbackNow ?? Date.now();
  const entry = {};
  entry.id = String(bake.id ?? makeId());
  entry.name = cleanName(bake.name);
  entry.date = cleanDate(bake.date);
  entry.rating = clampRating(bake.rating);
  entry.note = cleanNote(bake.note);
  entry.bakeAgain = Boolean(bake.bakeAgain);
  entry.createdAt = Number(bake.createdAt) || now;
  return entry;
}

function isBake(bake) {
  return !!bake && typeof bake === 'object' && (bake.name || bake.date);
}

/**
 * Read all bakes plus any load problem. Never throws.
 * @returns {{bakes: BakeEntry[], error: string|null}}
 */
export function readBakes(storage = defaultStorage) {
  if (!storage) return { bakes: [], error: null };
  let raw;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { bakes: [], error: 'Could not read your saved bakes from this browser.' };
  }
  if (raw == null) return { bakes: [], error: null };
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { bakes: [], error: 'Saved data could not be read, so it was skipped.' };
  }
  if (!Array.isArray(parsed)) {
    return { bakes: [], error: 'Saved data was in an unexpected format, so it was skipped.' };
  }
  const bakes = parsed
    .filter(isBake)
    .map((b) => normalize(b))
    .sort((a, b) => b.createdAt - a.createdAt);
  return { bakes, error: null };
}

/** Convenience: just the list of bakes, newest first. @returns {BakeEntry[]} */
export function listBakes(storage = defaultStorage) {
  return readBakes(storage).bakes;
}

/** Persist bakes. Returns true on success, false if storage refused. */
export function persist(bakes, storage = defaultStorage) {
  if (!storage) return true;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(bakes));
    return true;
  } catch {
    return false;
  }
}

/**
 * Add a bake from raw form input.
 * @param {object} input raw fields (name, date, rating, note, bakeAgain)
 * @returns {WriteResult}
 */
export function addBake(input, storage = defaultStorage) {
  const now = Date.now();
  const bake = normalize({ ...input, id: makeId(), createdAt: now }, now);
  const ok = persist([bake, ...listBakes(storage)], storage);
  return ok
    ? { ok: true, bake }
    : { ok: false, bake: null, error: 'This bake could not be saved — browser storage is full or blocked.' };
}

/**
 * Delete a bake by id.
 * @returns {WriteResult}
 */
export function deleteBake(id, storage = defaultStorage) {
  const all = listBakes(storage);
  const next = all.filter((b) => b.id !== id);
  if (next.length === all.length) return { ok: true, removed: false };
  const ok = persist(next, storage);
  return ok
    ? { ok: true, removed: true }
    : { ok: false, removed: false, error: 'Delete could not be saved — browser storage is blocked.' };
}
