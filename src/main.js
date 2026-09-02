import { readBakes, addBake, deleteBake } from './store/bakeStore.js';
import { renderBakeForm } from './components/BakeForm.js';
import { renderBakeList } from './components/BakeList.js';
import { renderSummaryBar } from './components/SummaryBar.js';
import { renderBanner } from './components/ErrorBanner.js';

function mount(root) {
  const bannerMount = root.querySelector('#banner-mount');
  const summaryMount = root.querySelector('#summary-mount');
  const formMount = root.querySelector('#form-mount');
  const listMount = root.querySelector('#bake-list-mount');

  function refresh() {
    const { bakes, error } = readBakes();
    summaryMount.replaceChildren(renderSummaryBar(bakes));
    listMount.replaceChildren(renderBakeList(bakes, { onDelete: remove, onLogFirst: focusForm }));
    if (error) showBanner(error);
  }

  function remove(id) {
    const result = deleteBake(id);
    if (result.ok) refresh();
    else showBanner(result.error);
  }

  function add(input) {
    const result = addBake(input);
    if (result.ok) refresh();
    else showBanner(result.error);
  }

  function showBanner(message) {
    // Persistent + prominent: a save/load failure means data was not written,
    // so it stays until the user dismisses it (no silent auto-hide).
    bannerMount.replaceChildren(renderBanner({ message, onDismiss: clearBanner }));
    bannerMount.querySelector('.banner-x').focus();
  }
  function clearBanner() {
    bannerMount.replaceChildren();
  }

  function focusForm() {
    const name = formMount.querySelector('#bake-name');
    name?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    name?.focus();
  }

  formMount.replaceChildren(renderBakeForm({ onAdd: add }));
  refresh();
}

const app = document.querySelector('#app');
if (app) mount(app);
