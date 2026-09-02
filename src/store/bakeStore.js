// bakeStore: the only thing that touches localStorage.
// Every read normalizes + validates, so corrupt/legacy data never reaches the UI.

import { cleanName, cleanNote, cleanDate } from '../utils/sanitize.js';
import { clampRating } from '../utils/rating.js';

export const STORAGE_KEY = 'dough-days-bakes';
const defaultStorage = globalThis.localStorage;

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return 'bake-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

function normalize(bake, fallbackNow) {
  const now = fallbackNow ?? Date.now();
  return {
    id: String(bake.id ?? makeId()),
    name: cleanName(bake.name),
    date: cleanDate(bake.date),
    rating: clampRating(bake.rating),
    note: cleanNote(bake.note),
    bakeAgain: Boolean(bake.bakeAgain),
    createdAt: Number(bake.createdAt) || now,
  };
}

function isBake(bake) {
  return bake && typeof bake === 'object' && (bake.name || bake.date);
}

/** All bakes, newest first. Returns [] on missing/corrupt storage. */
export function listBakes(storage = defaultStorage) {
  if (!storage) return [];
  let parsed;
  try {
    parsed = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(isBake)
    .map((b) => normalize(b))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function persist(bakes, storage = defaultStorage) {
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(bakes));
}

/** Add a bake from raw form input. Returns the normalized entry. */
export function addBake(input, storage = defaultStorage) {
  const now = Date.now();
  const bake = normalize({ ...input, id: makeId(), createdAt: now }, now);
  const all = [bake, ...listBakes(storage)];
  persist(all, storage);
  return bake;
}

/** Remove a bake by id. Returns true if one was removed. */
export function deleteBake(id, storage = defaultStorage) {
  const all = listBakes(storage);
  const next = all.filter((b) => b.id !== id);
  if (next.length === all.length) return false;
  persist(next, storage);
  return true;
}
