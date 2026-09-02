import { el } from './dom.js';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Render one bake card with its delete control. */
export function renderBakeCard(bake, { onDelete }) {
  const confirmDelete = () =>
    globalThis.confirm ? globalThis.confirm('Toss this bake from the journal?') : true;

  return el('article', {
    class: 'bake-card' + (bake.bakeAgain ? ' will-repeat' : ''),
    'data-id': bake.id,
  },
    el('header', { class: 'card-head' },
      el('h3', { class: 'card-title' }, bake.name),
      el('time', { class: 'card-date', datetime: bake.date }, formatDate(bake.date))),
    el('div', { class: 'card-rating', 'aria-label': 'Rated ' + bake.rating + ' out of 5' }, '\u{1F35E}'.repeat(bake.rating)),
    bake.note ? el('p', { class: 'card-note' }, bake.note) : null,
    el('footer', { class: 'card-foot' },
      el('span', { class: 'badge' + (bake.bakeAgain ? ' yes' : ' no') }, bake.bakeAgain ? 'Would bake again' : 'One-and-done'),
      el('button', {
        type: 'button', class: 'btn-danger', 'aria-label': 'Delete ' + bake.name,
        onClick: () => { if (confirmDelete()) onDelete(bake.id); },
      }, 'Delete')));
}
