// Views: the checklist rows, the guide detail pane, the platinum roadmap
// and the missables page. All rendering is plain DOM, no framework.
import { KIND_LABELS, applyFilters, gradeCounts, isSpoilerHidden, visibleDescription, visibleName } from './filters.js';

// The platinum roadmap, built from the official descriptions: story first,
// then side strands, activities, collectibles, and the money goals last.
export const ROADMAP_STAGES = [
  {
    title: 'Play the story',
    note: 'Chapters 1–4 and the finale, plus the named story missions. Nothing here can be missed by exploring first — the missions wait for you. Do the named missions the moment they appear, with a save kept.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    title: 'Side strands',
    note: 'Stranger mission chains and the hunt for Bret. Strands unlock through the story; finish each strand\'s final mission to close it, and 8 finished strands earn the silver.',
    ids: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    title: 'Activities & challenges',
    note: 'The repeatable pastimes: stunts, races, the shooting range, fishing, arcade games, meditation and the 50 challenges. These fill in while you play, so clear the stubborn ones — gold medals at the range, drone races at all 14 spots — in one focused pass.',
    ids: [15, 16, 17, 18, 19, 20, 21, 28, 32, 36, 46, 49, 51],
  },
  {
    title: 'Collectibles & exploring',
    note: 'Cards, WAiNK spots, vehicles and every corner of the map. Collect as you travel instead of saving it all for the end: 3 card sets, 100 WAiNK locations, 100 vehicles and all 52 areas.',
    ids: [30, 31, 35, 42, 44, 50, 54, 55],
  },
  {
    title: 'Heists, combat & money',
    note: 'Vaults, trucks, gang operations and the economy goals. Plan getaways before robberies, and let the laundering and spending totals build in the background while you do the rest.',
    ids: [33, 34, 37, 38, 39, 40, 41, 43, 45, 47, 48, 52, 53],
  },
  {
    title: 'The platinum',
    note: '100% completion and the platinum itself. Both unlock when everything else is done — chase this stage only when the checklist is nearly empty.',
    ids: [1, 14],
  },
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function gradeTag(trophy) {
  return el('span', `tag grade-${trophy.grade}`, trophy.grade);
}

function metaTags(trophy, earned, spoilerOn) {
  const wrap = el('span', 't-meta');
  wrap.append(gradeTag(trophy));
  wrap.append(el('span', 'tag', KIND_LABELS[trophy.kind] ?? trophy.kind));
  if (trophy.target !== undefined) wrap.append(el('span', 'tag', `Target: ${trophy.target}`));
  if (trophy.missable) wrap.append(el('span', 'tag missable', '⚠ Possibly missable'));
  if (isSpoilerHidden(trophy, earned, spoilerOn)) wrap.append(el('span', 'tag spoilered', 'Spoilers hidden'));
  return wrap;
}

export function renderProgress(trophies, earned) {
  const counts = gradeCounts(trophies, earned);
  document.getElementById('earnedCount').textContent = String(earned.size);
  document.getElementById('progressBar').style.width = `${(earned.size / trophies.length) * 100}%`;
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const node = document.getElementById(`count${grade[0].toUpperCase()}${grade.slice(1)}`);
    if (node) node.textContent = `${counts[grade].got}/${counts[grade].total}`;
  }
}

export function renderList(listNode, resultNode, trophies, earned, opts, selectedId, onToggle, onSelect) {
  const shown = applyFilters(trophies, earned, opts);
  resultNode.textContent = `Showing ${shown.length} of ${trophies.length} trophies — ${earned.size} earned.`;
  listNode.replaceChildren();
  for (const t of shown) {
    const li = el('li');
    if (earned.has(t.name)) li.classList.add('earned');
    if (t.id === selectedId) li.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Earned: ${visibleName(t, earned, opts.spoilerOn)}`);
    box.addEventListener('change', (event) => {
      event.stopPropagation();
      onToggle(t);
    });
    const body = el('div');
    body.append(el('div', 't-name', visibleName(t, earned, opts.spoilerOn)));
    body.append(el('div', 't-desc', visibleDescription(t, earned, opts.spoilerOn)));
    body.append(metaTags(t, earned, opts.spoilerOn));
    li.append(box, body);
    li.addEventListener('click', () => onSelect(t));
    listNode.append(li);
  }
  if (shown.length === 0) {
    listNode.append(el('li', null, 'No trophies match these filters. Clear the search or a filter to see the full list.'));
  }
}

export function renderDetail(detailNode, trophy, earned, spoilerOn, onToggle) {
  detailNode.replaceChildren();
  if (!trophy) {
    detailNode.append(el('p', 'empty', 'Select a trophy on the left to read its guide, with its sources and — where it applies — its missable warning.'));
    return;
  }
  const hidden = isSpoilerHidden(trophy, earned, spoilerOn);
  const row = el('label', 'earn-row');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.name);
  box.addEventListener('change', () => onToggle(trophy));
  row.append(box, document.createTextNode(earned.has(trophy.name) ? 'Earned — ticked off' : 'Mark as earned'));
  detailNode.append(row);
  detailNode.append(el('h2', null, visibleName(trophy, earned, spoilerOn)));
  detailNode.append(el('p', 'd-desc', visibleDescription(trophy, earned, spoilerOn)));
  const flags = el('div', 'd-flags');
  flags.append(gradeTag(trophy));
  flags.append(el('span', 'tag', KIND_LABELS[trophy.kind] ?? trophy.kind));
  if (trophy.target !== undefined) flags.append(el('span', 'tag', `PSN target: ${trophy.target}`));
  if (trophy.missable) flags.append(el('span', 'tag missable', '⚠ Possibly missable'));
  detailNode.append(flags);
  if (trophy.missable) {
    detailNode.append(el('p', 'warn', 'Missable warning: this is a one-off moment, a single choice or a stunt that may not repeat. The official description does not confirm it can be missed — the flag is a precaution. Keep a manual save before attempting it.'));
  }
  if (hidden) {
    detailNode.append(el('p', 'd-guide', 'The guide is hidden with the spoilers. Earn this trophy — or switch the spoiler setting off — to read it.'));
  } else {
    detailNode.append(el('p', 'd-guide', trophy.guide));
  }
  const sources = el('p', 'd-sources');
  const strong = el('strong', null, 'Sources: ');
  sources.append(strong, document.createTextNode(trophy.sources));
  detailNode.append(sources);
}

export function renderRoadmap(stagesNode, trophies, earned) {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  stagesNode.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const items = stage.ids.map((id) => byId.get(id)).filter(Boolean);
    const done = items.filter((t) => earned.has(t.name)).length;
    const li = el('li');
    li.append(el('h3', null, stage.title));
    li.append(el('p', 'stage-progress', `${done} of ${items.length} earned in this stage`));
    li.append(el('p', 'stage-note', stage.note));
    const chips = el('div', 'stage-trophies');
    for (const t of items) {
      const chip = el('span', earned.has(t.name) ? 'done' : null, `${earned.has(t.name) ? '✓ ' : ''}${t.name} (${t.grade})`);
      chips.append(chip);
    }
    li.append(chips);
    stagesNode.append(li);
  }
}

export function renderMissables(listNode, trophies, earned, spoilerOn, selectedId, onToggle, onSelect) {
  const missables = trophies.filter((t) => t.missable);
  listNode.replaceChildren();
  for (const t of missables) {
    const li = el('li');
    if (earned.has(t.name)) li.classList.add('earned');
    if (t.id === selectedId) li.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Earned: ${visibleName(t, earned, spoilerOn)}`);
    box.addEventListener('change', (event) => {
      event.stopPropagation();
      onToggle(t);
    });
    const body = el('div');
    body.append(el('div', 't-name', visibleName(t, earned, spoilerOn)));
    body.append(el('div', 't-desc', visibleDescription(t, earned, spoilerOn)));
    body.append(metaTags(t, earned, spoilerOn));
    li.append(box, body);
    li.addEventListener('click', () => onSelect(t));
    listNode.append(li);
  }
}
