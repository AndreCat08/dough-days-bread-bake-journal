import { el } from './dom.js';
import { renderBakeCard } from './BakeCard.js';

/**
 * Render the card list (newest first) or a friendly empty state with a CTA.
 * @param {import('../store/bakeStore.js').BakeEntry[]} bakes
 * @param {{onDelete: (id: string) => void, onLogFirst?: () => void}} opts
 */
export function renderBakeList(bakes, { onDelete, onLogFirst } = {}) {
  if (!bakes.length) {
    return el('ul', { class: 'bake-list empty' },
      el('li', { class: 'empty-msg' },
        el('p', {}, 'No bakes logged yet. Your crumb trail starts here.'),
        onLogFirst ? el('button', { type: 'button', class: 'btn-primary', onClick: onLogFirst }, 'Log your first bake') : null,
      ));
  }
  return el('ul', { class: 'bake-list' },
    ...bakes.map((bake) => el('li', {}, renderBakeCard(bake, { onDelete }))));
}
