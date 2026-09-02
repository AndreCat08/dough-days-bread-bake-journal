import { el } from './dom.js';
import { renderBakeCard } from './BakeCard.js';

/** Render the full card list (newest first) or a friendly empty state. */
export function renderBakeList(bakes, { onDelete }) {
  if (!bakes.length) {
    return el('ul', { class: 'bake-list empty' },
      el('li', { class: 'empty-msg' }, 'No bakes logged yet. Your crumb trail starts here.'));
  }
  return el('ul', { class: 'bake-list' },
    ...bakes.map((bake) => el('li', {}, renderBakeCard(bake, { onDelete }))));
}
