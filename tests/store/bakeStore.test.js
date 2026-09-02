import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEY, listBakes, readBakes, addBake, deleteBake, persist,
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

  it('starts empty', () => {
    expect(listBakes(store)).toEqual([]);
    expect(readBakes(store)).toEqual({ bakes: [], error: null });
  });

  it('adds a bake and persists it', () => {
    const result = addBake(sample, store);
    expect(result.ok).toBe(true);
    expect(result.bake.id).toBeTruthy();
    expect(result.bake.name).toBe('Honey Oat');
    expect(JSON.parse(store.getItem(STORAGE_KEY))).toHaveLength(1);
  });

  it('lists newest first', () => {
    addBake({ ...sample, name: 'old' }, store);
    addBake({ ...sample, name: 'new' }, store);
    const all = listBakes(store);
    expect(all[0].name).toBe('new');
    expect(all).toHaveLength(2);
  });

  it('normalizes input (trims, clamps rating, caps note)', () => {
    const { bake } = addBake({ ...sample, name: '  Rustic  ', rating: 99, note: 'x'.repeat(1000) }, store);
    expect(bake.name).toBe('Rustic');
    expect(bake.rating).toBe(5);
    expect(bake.note.length).toBe(500);
  });

  it('deleteBake removes only the target', () => {
    const a = addBake({ ...sample, name: 'A' }, store);
    const b = addBake({ ...sample, name: 'B' }, store);
    expect(deleteBake(a.bake.id, store)).toEqual({ ok: true, removed: true });
    expect(listBakes(store).map((x) => x.name)).toEqual(['B']);
    expect(deleteBake(b.bake.id, store)).toEqual({ ok: true, removed: true });
    expect(listBakes(store)).toEqual([]);
  });

  it('deleteBake is a no-op for unknown id', () => {
    addBake(sample, store);
    expect(deleteBake('nope', store)).toEqual({ ok: true, removed: false });
    expect(listBakes(store)).toHaveLength(1);
  });

  it('drops malformed entries, keeps valid ones', () => {
    persist([
      sample,
      { id: 'x', name: 'no-date', rating: 3 }, // date missing but has name -> kept
      null, 'garbage', { foo: 'bar' }, // no name/date -> dropped
    ], store);
    expect(listBakes(store)).toHaveLength(2);
  });

  it('reports corrupt saved data instead of throwing', () => {
    store.setItem(STORAGE_KEY, '{not json');
    const { bakes, error } = readBakes(store);
    expect(bakes).toEqual([]);
    expect(error).toBeTruthy();
  });

  it('reports non-array saved data', () => {
    store.setItem(STORAGE_KEY, '{"name":"not an array"}');
    const { bakes, error } = readBakes(store);
    expect(bakes).toEqual([]);
    expect(error).toBeTruthy();
  });

  it('surfaces a failing read (storage error)', () => {
    const failing = { getItem: () => { throw new Error('quota'); } };
    const { bakes, error } = readBakes(failing);
    expect(bakes).toEqual([]);
    expect(error).toBeTruthy();
  });

  it('surfaces a save failure on add (e.g. quota exceeded)', () => {
    const failing = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); } };
    const result = addBake(sample, failing);
    expect(result.ok).toBe(false);
    expect(result.bake).toBeNull();
    expect(result.error).toBeTruthy();
  });

  it('surfaces a save failure on delete', () => {
    addBake(sample, store);
    const failing = {
      getItem: (k) => store.getItem(k),
      setItem: () => { throw new Error('blocked'); },
    };
    const [bake] = listBakes(store);
    const result = deleteBake(bake.id, failing);
    expect(result.ok).toBe(false);
    expect(result.removed).toBe(false);
    expect(result.error).toBeTruthy();
    expect(listBakes(store)).toHaveLength(1); // entry untouched
  });

  it('is resistant to prototype pollution in stored rows', () => {
    // Hand-built JSON: JSON.parse creates "__proto__" as an OWN data property,
    // exactly what an attacker would plant in a storage value.
    const payload = '[{"id":"evil","name":"x","date":"2025-01-01","rating":3,"__proto__":{"polluted":"yes"}}]';
    store.setItem(STORAGE_KEY, payload);
    const { bakes } = readBakes(store);
    expect(bakes).toHaveLength(1);
    expect(bakes[0].name).toBe('x');
    expect({}.polluted).toBeUndefined();
    expect(Object.getPrototypeOf({})).toBe(Object.prototype);
  });
});
