import { describe, it, expect, vi } from 'vitest';
import { renderBakeList } from '../../src/components/BakeList.js';

describe('BakeList', () => {
  it('renders one card per bake', () => {
    const list = renderBakeList(
      [
        { id: 'a', name: 'A', date: '2025-01-01', rating: 3, note: '', bakeAgain: true },
        { id: 'b', name: 'B', date: '2025-01-02', rating: 2, note: '', bakeAgain: false },
      ],
      { onDelete: vi.fn() });
    expect(list.querySelectorAll('.bake-card')).toHaveLength(2);
  });

  it('shows an empty state with a working CTA', () => {
    const onLogFirst = vi.fn();
    const list = renderBakeList([], { onDelete: vi.fn(), onLogFirst });
    expect(list.querySelector('.empty-msg')).toBeTruthy();
    list.querySelector('.btn-primary').click();
    expect(onLogFirst).toHaveBeenCalledTimes(1);
  });
});
