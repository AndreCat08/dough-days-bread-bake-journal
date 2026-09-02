import { el } from './dom.js';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Render one bake card. Deleting uses an inline in-context confirmation
 * (not a blocking browser dialog), so the user never loses their place.
 * @param {import('../store/bakeStore.js').BakeEntry} bake
 * @param {{onDelete: (id: string) => void}} opts
 */
export function renderBakeCard(bake, { onDelete }) {
  const actions = el('div', { class: 'card-actions' });
  let confirming = false;

  function renderActions() {
    actions.replaceChildren(
      confirming
        ? el('div', { class: 'confirm-row' },
            el('span', { class: 'confirm-q' }, 'Remove this bake?'),
            el('button', { type: 'button', class: 'btn-danger btn-sm', onClick: confirmDelete }, 'Yes, remove'),
            el('button', { type: 'button', class: 'btn-ghost btn-sm', onClick: cancelConfirm }, 'Keep'),
          )
        : el('button', {
            type: 'button', class: 'btn-danger', 'aria-label': 'Delete ' + bake.name,
            onClick: askConfirm,
          }, 'Delete'),
    );
  }
  function askConfirm() { confirming = true; renderActions(); }
  function cancelConfirm() { confirming = false; renderActions(); }
  function confirmDelete() { onDelete(bake.id); }

  const badge = el('span', { class: 'badge' + (bake.bakeAgain ? ' yes' : ' no') },
    bake.bakeAgain ? 'Would bake again' : 'One-and-done');

  const card = el('article', {
    class: 'bake-card' + (bake.bakeAgain ? ' will-repeat' : ''),
    'data-id': bake.id,
  },
    el('header', { class: 'card-head' },
      el('h3', { class: 'card-title' }, bake.name),
      el('time', { class: 'card-date', datetime: bake.date }, formatDate(bake.date))),
    el('div', { class: 'card-rating', 'aria-label': 'Rated ' + bake.rating + ' out of 5' }, '\u{1F35E}'.repeat(bake.rating)),
    bake.note ? el('p', { class: 'card-note' }, bake.note) : null,
    el('footer', { class: 'card-foot' }, badge, actions));

  renderActions();
  return card;
}
