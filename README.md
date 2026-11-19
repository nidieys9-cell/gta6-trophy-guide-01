# Leonida Trophy Guide — GTA VI Platinum Tracker
[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/nidieys9-cell/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/nidieys9-cell/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline, open-source guide and tracker for all 55 PlayStation 5 trophies of
Grand Theft Auto VI. Static files only: open `app/index.html` in a desktop
browser (or run `node serve.ts` and visit http://localhost:8080). It makes no
network requests and shows no Rockstar logo or official artwork.

## What it does

- **Checklist** of all 55 official trophies with their official name, description
  and grade (1 platinum, 2 gold, 6 silver, 46 bronze), saved in the browser
  (localStorage), with export to a file and import back.
- **Filters** by kind (story, side missions, collectibles, activities,
  exploration, combat & heists, money, platinum & 100%), by grade, by search,
  plus missable-only and hide-earned switches.
- **Spoiler setting** (on by default): story trophies the player has not earned
  yet show as "Hidden story trophy" — name, description and guide hidden until
  earned.
- **Platinum roadmap**: six stages in recommended order, each with its
  trophies and per-stage progress, built from the official descriptions.
- **Missables page**: 25 trophies flagged as possibly missable. The official
  descriptions do not confirm any of them can be missed for certain, and story
  missions can usually be replayed — the flags are a precaution, and each one
  says so. Rule of thumb: keep a manual save before each.
- **A guide to every trophy**, written in our own words from the official
  description, with its sources shown beside it.

## Honesty about the guides

The game released the day this guide was built. Where the official description
names no place, step or trigger, the guide says so plainly — it is a plan drawn
from the description, not a route checked in the game. Nothing is presented as
verified in-game when it is not, and no other guide's text is copied.

## Sources

- Trophy names, descriptions and grades: the official list as published on
  Exophase (https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/)
  and PSNProfiles (https://psnprofiles.com/trophies/43531-grand-theft-auto-vi),
  which agree on every name, description and grade. PSN progress targets
  (such as 42 Shooting Range challenges) are from PSNProfiles.
- Guide text: our own advice, written from the official description for this
  guide; not yet checked in the game.

## Screenshots

Four real renders of the app, taken with headless Chromium at 1280x800 from
`node serve.ts`, with demo progress seeded via `?demo` (13 of 55 earned, so the
screenshots show a guide in use). `shots.json` lists the view each shot was
taken of. No placeholder images.

## Build

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to the output directory and writes `dossier.json` with the vendored
`vendor/makefun-frontend.ts` library.

## License

MIT — see `LICENSE`.

<sub>Entered on [make.fun](https://make.fun/?ref=zm33jpqc&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
