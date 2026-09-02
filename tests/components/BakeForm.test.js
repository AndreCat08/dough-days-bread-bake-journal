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
});
