import { el } from './dom.js';
import { averageRating } from '../utils/rating.js';

/** Compact stats line: total bakes + average rating. */
export function renderSummaryBar(bakes) {
  const total = bakes.length;
  const avg = averageRating(bakes);
  const crumbs = '\u{1F35E}'.repeat(Math.round(avg));
  return el('div', { class: 'summary', role: 'status', 'aria-live': 'polite' },
    el('span', { class: 'summary-total' }, total, total === 1 ? ' bake' : ' bakes'),
    total
      ? el('span', { class: 'summary-avg' }, ' \u00B7 avg ', String(avg), crumbs ? ' ' + crumbs : '')
      : null);
}
