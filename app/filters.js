// Filters and the spoiler rule: which trophies a list shows, and what a
// spoiler-hidden story trophy looks like until it is earned.
export const KIND_LABELS = {
  story: 'Story',
  side: 'Side missions',
  collectibles: 'Collectibles',
  activities: 'Activities',
  exploration: 'Exploration',
  combat: 'Combat & heists',
  economy: 'Money',
  meta: 'Platinum & 100%',
};

// A story trophy the player has not earned yet, with spoilers hidden: its name
// and description stay hidden, and so does its guide.
export function isSpoilerHidden(trophy, earned, spoilerOn) {
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

export function visibleName(trophy, earned, spoilerOn) {
  return isSpoilerHidden(trophy, earned, spoilerOn) ? 'Hidden story trophy' : trophy.name;
}

export function visibleDescription(trophy, earned, spoilerOn) {
  return isSpoilerHidden(trophy, earned, spoilerOn)
    ? 'A story trophy. Earn it in the story to reveal its name and description.'
    : trophy.description;
}

export function applyFilters(trophies, earned, opts) {
  const query = opts.search.trim().toLowerCase();
  return trophies.filter((t) => {
    if (opts.kind !== 'all' && t.kind !== opts.kind) return false;
    if (opts.grade !== 'all' && t.grade !== opts.grade) return false;
    if (opts.missableOnly && !t.missable) return false;
    if (opts.hideEarned && earned.has(t.name)) return false;
    if (query) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

export function gradeCounts(trophies, earned) {
  const counts = {};
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const total = trophies.filter((t) => t.grade === grade).length;
    const got = trophies.filter((t) => t.grade === grade && earned.has(t.name)).length;
    counts[grade] = { got, total };
  }
  return counts;
}
