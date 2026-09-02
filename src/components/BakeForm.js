import { el } from './dom.js';
import { LIMITS } from '../utils/sanitize.js';
import { MIN_RATING, MAX_RATING } from '../utils/rating.js';

const today = () => new Date().toISOString().slice(0, 10);
const DEFAULT_IDX = 2; // default to a 3-star rating

/**
 * Build the "log a bake" form.
 * @param {{onAdd: (input: {name:string,date:string,rating:number,note:string,bakeAgain:boolean}) => void}} opts
 */
export function renderBakeForm({ onAdd }) {
  const nameInput = el('input', {
    type: 'text', id: 'bake-name', name: 'name', required: true,
    maxlength: String(LIMITS.NAME_MAX), placeholder: 'Honey Oat Sandwich Loaf',
    'aria-label': 'Bread name', autocomplete: 'off',
  });
  const dateInput = el('input', {
    type: 'date', id: 'bake-date', name: 'date', required: true,
    'aria-label': 'Date baked',
  });
  dateInput.value = today();

  const ratingInputs = [];
  for (let i = MIN_RATING; i <= MAX_RATING; i++) {
    const input = el('input', {
      type: 'radio', name: 'rating', value: String(i), id: 'rating-' + i,
      required: true, 'aria-label': i + ' out of 5',
    });
    ratingInputs.push(input);
  }

  const noteInput = el('textarea', {
    id: 'bake-note', name: 'note', rows: '2', maxlength: String(LIMITS.NOTE_MAX),
    'aria-label': 'Key tweak or note', placeholder: 'added 10 min steam',
  });
  const bakeAgain = el('input', {
    type: 'checkbox', id: 'bake-again', name: 'bakeAgain',
    'aria-label': 'Would bake again?', checked: true,
  });

  // WAI-ARIA radiogroup: one tab stop (the selected control), arrow keys move.
  function setRating(idx) {
    ratingInputs.forEach((input, i) => {
      input.checked = i === idx;
      input.tabIndex = i === idx ? 0 : -1;
    });
  }
  function moveRating(from, delta) {
    const next = Math.min(MAX_RATING, Math.max(MIN_RATING, from + delta));
    setRating(next - 1);
    ratingInputs[next - 1].focus();
  }
  function onRatingKeydown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { event.preventDefault(); moveRating(Number(event.target.value), 1); }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') { event.preventDefault(); moveRating(Number(event.target.value), -1); }
  }
  ratingInputs.forEach((input) => {
    input.addEventListener('change', () => setRating(Number(input.value) - 1));
    input.addEventListener('keydown', onRatingKeydown);
  });
  setRating(DEFAULT_IDX);

  const form = el('form', { class: 'bake-form', 'aria-label': 'Log a bake' },
    el('label', { class: 'field', for: 'bake-name' }, 'Bread name', nameInput),
    el('label', { class: 'field', for: 'bake-date' }, 'Date baked', dateInput),
    el('fieldset', { class: 'field rating-field' },
      el('legend', {}, 'Crust rating'),
      el('div', { class: 'rating', role: 'radiogroup', 'aria-label': 'Crust rating' },
        ...ratingInputs.map((input, idx) =>
          el('label', { class: 'rating-opt' }, input, '\u{1F35E}'.repeat(idx + 1))))) ,
    el('label', { class: 'field', for: 'bake-note' }, 'Key tweak or note', noteInput),
    el('label', { class: 'field switch' }, bakeAgain, el('span', {}, 'Would bake again?')),
    el('button', { type: 'submit', class: 'btn-primary' }, 'Log this bake'),
  );

  function resetForm() {
    form.reset();
    setRating(DEFAULT_IDX);
    dateInput.value = today();
    nameInput.focus();
  }
  function onSubmit(event) {
    event.preventDefault();
    onAdd({
      name: nameInput.value,
      date: dateInput.value,
      rating: Number(ratingInputs.find((r) => r.checked)?.value ?? (DEFAULT_IDX + 1)),
      note: noteInput.value,
      bakeAgain: bakeAgain.checked,
    });
    resetForm();
  }
  form.addEventListener('submit', onSubmit);

  return form;
}
