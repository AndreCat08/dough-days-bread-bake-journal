import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEY, listBakes, addBake, deleteBake, persist,
} from '../../src/store/bakeStore.js';

function fakeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

const sample = { name: 'Honey Oat', date: '2025-12-01', rating: 4, note: 'steam', bakeAgain: true };

describe('bakeStore', () => {
  let store;
  beforeEach(() => { store = fakeStorage(); });

  it('starts empty', () => { expect(listBakes(store)).toEqual([]); });

  it('adds a bake and persists', () => {
    const bake = addBake(sample, store);
    expect(bake.id).toBeTruthy();
    expect(bake.name).toBe('Honey Oat');
    expect(JSON.parse(store.getItem(STORAGE_KEY))).toHaveLength(1);
  });

  it('lists newest first', () => {
    addBake({ ...sample, name: 'old' }, store);
    const second = addBake({ ...sample, name: 'new' }, store);
    second.createdAt; // read for clarity
    const all = listBakes(store);
    expect(all[0].name).toBe('new');
    expect(all).toHaveLength(2);
  });

  it('normalizes input (trims, clamps rating, caps note)', () => {
    const bake = addBake({ ...sample, name: '  Rustic  ', rating: 99, note: 'x'.repeat(1000) }, store);
    expect(bake.name).toBe('Rustic');
    expect(bake.rating).toBe(5);
    expect(bake.note.length).toBe(500);
  });

  it('deleteBake removes only the target', () => {
    const a = addBake({ ...sample, name: 'A' }, store);
    const b = addBake({ ...sample, name: 'B' }, store);
    expect(deleteBake(a.id, store)).toBe(true);
    const all = listBakes(store);
    expect(all.map((x) => x.name)).toEqual(['B']);
    expect(deleteBake(b.id, store)).toBe(true);
    expect(listBakes(store)).toEqual([]);
  });

  it('deleteBake returns false when id missing', () => {
    addBake(sample, store);
    expect(deleteBake('nope', store)).toBe(false);
    expect(listBakes(store)).toHaveLength(1);
  });

  it('recovers from corrupt JSON', () => {
    store.setItem(STORAGE_KEY, '{not json');
    expect(listBakes(store)).toEqual([]);
  });

  it('drops malformed entries, keeps valid ones', () => {
    persist([
      sample,
      { id: 'x', name: 'no-date', rating: 3 }, // date missing but has name -> kept
      null, 'garbage', { foo: 'bar' }, // no name/date -> dropped
    ], store);
    expect(listBakes(store)).toHaveLength(2);
  });
});
