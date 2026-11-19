// Boot: load the trophy list, wire the controls, tabs and hash routing,
// and keep every view in sync with the earned set.
import { exportProgress, importProgressFile, loadEarned, saveEarned, seedDemoIfEmpty } from './store.js';
import { renderDetail, renderList, renderMissables, renderProgress, renderRoadmap } from './views.js';

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

let earned = seedDemoIfEmpty(loadEarned());
let selectedId = null;
let view = 'checklist';

const $ = (id) => document.getElementById(id);
const opts = () => ({
  search: $('search').value,
  kind: $('kind').value,
  grade: $('grade').value,
  missableOnly: $('missableOnly').checked,
  hideEarned: $('hideEarned').checked,
  spoilerOn: $('spoiler').checked,
});

function selectedTrophy() {
  return trophies.find((t) => t.id === selectedId) ?? null;
}

function renderAll() {
  renderProgress(trophies, earned);
  renderList($('trophyList'), $('resultLine'), trophies, earned, opts(), selectedId, toggleEarned, selectTrophy);
  renderDetail($('detail'), selectedTrophy(), earned, opts().spoilerOn, toggleEarned);
  renderRoadmap($('roadmapStages'), trophies, earned);
  renderMissables($('missableList'), trophies, earned, opts().spoilerOn, selectedId, toggleEarned, selectTrophy);
  document.getElementById('missableCount').textContent = String(trophies.filter((t) => t.missable).length);
}

function toggleEarned(trophy) {
  if (earned.has(trophy.name)) earned.delete(trophy.name);
  else earned.add(trophy.name);
  saveEarned(earned);
  renderAll();
}

function selectTrophy(trophy) {
  selectedId = trophy.id;
  showView('checklist');
  renderAll();
  document.getElementById('detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showView(next) {
  view = next;
  for (const button of document.querySelectorAll('.tabs button')) {
    button.classList.toggle('active', button.dataset.view === next);
  }
  for (const name of ['checklist', 'roadmap', 'missables']) {
    document.getElementById(`view-${name}`).hidden = name !== next;
  }
  if (next === 'checklist') renderList($('trophyList'), $('resultLine'), trophies, earned, opts(), selectedId, toggleEarned, selectTrophy);
  if (next === 'roadmap') renderRoadmap($('roadmapStages'), trophies, earned);
  if (next === 'missables') renderMissables($('missableList'), trophies, earned, opts().spoilerOn, selectedId, toggleEarned, selectTrophy);
}

function routeFromHash() {
  const hash = location.hash.replace(/^#\/?/, '');
  if (hash === 'roadmap' || hash === 'missables') {
    showView(hash);
    return;
  }
  const match = hash.match(/^trophy\/(\d+)$/);
  if (match) {
    const trophy = trophies.find((t) => t.id === Number(match[1]));
    if (trophy) {
      selectedId = trophy.id;
      showView('checklist');
      renderAll();
      return;
    }
  }
  showView('checklist');
}

for (const button of document.querySelectorAll('.tabs button')) {
  button.addEventListener('click', () => {
    location.hash = `#/${button.dataset.view}`;
  });
}
window.addEventListener('hashchange', routeFromHash);

for (const id of ['search', 'kind', 'grade', 'missableOnly', 'hideEarned', 'spoiler']) {
  $(id).addEventListener(id === 'search' ? 'input' : 'change', () => {
    renderList($('trophyList'), $('resultLine'), trophies, earned, opts(), selectedId, toggleEarned, selectTrophy);
    renderDetail($('detail'), selectedTrophy(), earned, opts().spoilerOn, toggleEarned);
  });
}

$('exportBtn').addEventListener('click', () => exportProgress(earned));
$('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    earned = await importProgressFile(file, new Set(trophies.map((t) => t.name)));
    saveEarned(earned);
    renderAll();
  } catch (error) {
    alert(`Could not import that file: ${error.message}`);
  }
  event.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (confirm('Clear all earned trophies? This cannot be undone.')) {
    earned = new Set();
    saveEarned(earned);
    renderAll();
  }
});

routeFromHash();
renderAll();
// Open the first trophy's guide by default so the detail pane is never empty.
if (!selectedTrophy()) {
  selectedId = trophies[0].id;
  renderDetail($('detail'), selectedTrophy(), earned, opts().spoilerOn, toggleEarned);
}
