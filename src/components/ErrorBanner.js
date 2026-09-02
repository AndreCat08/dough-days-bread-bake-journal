import { el } from './dom.js';

/**
 * Prominent, persistent error banner. Role=alert so screen readers announce it.
 * @param {{message: string, onDismiss: Function}} opts
 */
export function renderBanner({ message, onDismiss }) {
  return el('div', { class: 'banner', role: 'alert' },
    el('span', { class: 'banner-msg' }, message),
    el('button', { type: 'button', class: 'banner-x', 'aria-label': 'Dismiss message', onClick: onDismiss }, '\u2715'),
  );
}
