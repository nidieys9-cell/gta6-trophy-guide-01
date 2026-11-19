// Progress store: the earned set lives in localStorage only, never on a server.
// Export writes a JSON file; import reads one back and keeps only known names.
export const STORAGE_KEY = 'leonida-trophy-guide-progress-v1';

// Demo progress for screenshots: ?demo seeds 13 earned trophies, only when
// nothing is saved yet. It is a display seed, not a claim about a real playthrough.
export const DEMO_EARNED = [
  'Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!',
  'Trust', 'Cunning Stunts', 'Earn Cash, Not Kudos', 'Stick Fiddler',
  'Whip It Good', 'The Goodtime State', 'Dime on the Dollar', 'Treat Yo Self', 'On the Spot',
];

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : parsed.earned ?? []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

export function seedDemoIfEmpty(earned) {
  const params = new URLSearchParams(location.search);
  if (params.has('demo') && earned.size === 0) {
    for (const name of DEMO_EARNED) earned.add(name);
    saveEarned(earned);
  }
  return earned;
}

export function exportProgress(earned) {
  const payload = { app: 'leonida-trophy-guide', exportedAt: new Date().toISOString(), earned: [...earned] };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file, knownNames) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('Not a progress file: no earned list found.');
  const kept = names.filter((n) => knownNames.has(n));
  return new Set(kept);
}
