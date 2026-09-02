import { listBakes, addBake, deleteBake } from './store/bakeStore.js';
import { renderBakeForm } from './components/BakeForm.js';
import { renderBakeList } from './components/BakeList.js';
import { renderSummaryBar } from './components/SummaryBar.js';

function mount(root) {
  const summaryMount = root.querySelector('#summary-mount');
  const formMount = root.querySelector('#form-mount');
  const listMount = root.querySelector('#bake-list-mount');

  function refresh() {
    const bakes = listBakes();
    summaryMount.replaceChildren(renderSummaryBar(bakes));
    listMount.replaceChildren(renderBakeList(bakes, { onDelete: remove }));
  }
  function remove(id) {
    deleteBake(id);
    refresh();
  }

  formMount.replaceChildren(renderBakeForm({ onAdd: (input) => { addBake(input); refresh(); } }));
  refresh();
}

const app = document.querySelector('#app');
if (app) mount(app);
