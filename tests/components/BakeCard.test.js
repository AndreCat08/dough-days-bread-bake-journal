import { describe, it, expect, vi } from 'vitest';
import { renderBakeCard } from '../../src/components/BakeCard.js';

const bake = { id: 'b1', name: 'Focaccia', date: '2025-03-01', rating: 4, note: 'brine', bakeAgain: false };

describe('BakeCard', () => {
  it('renders title, rating, note, and badge', () => {
    const card = renderBakeCard(bake, { onDelete: vi.fn() });
    expect(card.querySelector('.card-title').textContent).toBe('Focaccia');
    expect(card.querySelector('.card-rating').textContent).toBe('\u{1F35E}'.repeat(4));
    expect(card.querySelector('.card-note').textContent).toBe('brine');
    expect(card.querySelector('.badge').textContent).toBe('One-and-done');
  });

  it('omits the note line when there is none', () => {
    const card = renderBakeCard({ ...bake, note: '' }, { onDelete: vi.fn() });
    expect(card.querySelector('.card-note')).toBeNull();
  });

  it('never deletes until the inline confirm is accepted', () => {
    const onDelete = vi.fn();
    const card = renderBakeCard(bake, { onDelete });

    card.querySelector('.btn-danger').click();
    expect(onDelete).not.toHaveBeenCalled();
    expect(card.querySelector('.confirm-row')).toBeTruthy();

    card.querySelector('.confirm-row .btn-ghost').click();
    expect(onDelete).not.toHaveBeenCalled();
    expect(card.querySelector('.confirm-row')).toBeNull();

    card.querySelector('.btn-danger').click();
    card.querySelector('.confirm-row .btn-danger').click();
    expect(onDelete).toHaveBeenCalledWith('b1');
  });
});
