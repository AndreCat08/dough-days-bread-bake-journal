import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderBakeForm } from '../../src/components/BakeForm.js';

function submit(form, data = {}) {
  if (data.name !== undefined) form.querySelector('#bake-name').value = data.name;
  if (data.date !== undefined) form.querySelector('#bake-date').value = data.date;
  if (data.note !== undefined) form.querySelector('#bake-note').value = data.note;
  if (data.bakeAgain !== undefined) form.querySelector('#bake-again').checked = data.bakeAgain;
  if (data.rating !== undefined) form.querySelector(`#rating-${data.rating}`).checked = true;
  form.dispatchEvent(new Event('submit'));
}

describe('BakeForm', () => {
  it('renders the five capture fields', () => {
    const form = renderBakeForm({ onAdd: vi.fn() });
    expect(form.querySelector('#bake-name')).toBeTruthy();
    expect(form.querySelector('#bake-date')).toBeTruthy();
    expect(form.querySelectorAll('input[name="rating"]')).toHaveLength(5);
    expect(form.querySelector('#bake-note')).toBeTruthy();
    expect(form.querySelector('#bake-again')).toBeTruthy();
  });

  it('calls onAdd with entered values', () => {
    const onAdd = vi.fn();
    const form = renderBakeForm({ onAdd });
    submit(form, { name: 'Sourdough', date: '2025-01-05', note: 'wet dough', rating: 5, bakeAgain: false });
    expect(onAdd).toHaveBeenCalledWith({ name: 'Sourdough', date: '2025-01-05', rating: 5, note: 'wet dough', bakeAgain: false });
  });

  it('defaults to a 3-star rating', () => {
    const onAdd = vi.fn();
    const form = renderBakeForm({ onAdd });
    submit(form, { name: 'Focaccia' });
    expect(onAdd.mock.calls[0][0].rating).toBe(3);
  });

  it('resets name field after submit', () => {
    const form = renderBakeForm({ onAdd: vi.fn() });
    submit(form, { name: 'Pretzel Bread' });
    expect(form.querySelector('#bake-name').value).toBe('');
  });

  it('is a WAI-ARIA radiogroup: arrow keys move and re-check', () => {
    const form = renderBakeForm({ onAdd: vi.fn() });
    const r3 = form.querySelector('#rating-3');
    expect(r3.checked).toBe(true);
    expect(r3.tabIndex).toBe(0); // single tab stop on the selected control

    r3.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(form.querySelector('#rating-4').checked).toBe(true);
    expect(form.querySelector('#rating-4').tabIndex).toBe(0);
    expect(r3.tabIndex).toBe(-1);

    form.querySelector('#rating-4').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(r3.checked).toBe(true);
  });

  it('clamps arrow-key movement at the range ends', () => {
    const form = renderBakeForm({ onAdd: vi.fn() });
    const r5 = form.querySelector('#rating-5');
    r5.focus();
    r5.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(r5.checked).toBe(true); // stuck at 5

    const r1 = form.querySelector('#rating-1');
    r1.focus();
    r1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(r1.checked).toBe(true); // stuck at 1
  });

  it('keeps a working default rating after reset', () => {
    const onAdd = vi.fn();
    const form = renderBakeForm({ onAdd });
    submit(form, { name: 'Ciabatta', rating: 5 });
    expect(form.querySelector('#rating-5').checked).toBe(false);
    expect(form.querySelector('#rating-3').checked).toBe(true);
    expect(form.querySelector('#rating-3').tabIndex).toBe(0);
  });
});
