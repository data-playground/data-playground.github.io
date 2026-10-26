# Roadmap

## Built so far
Single-player career with multi-league worlds, live text matches with substitutions and team talks, assistant advice, injuries, morale and fatigue, transfers with negotiation (offers, counters, part-exchange and loans in deals), contracts, finances with stadium and sponsors, club infrastructure, youth academy with loans, staff and coaches, press and media, player conversations, post-game review, manager career (goals, reputation, sackings, applying for jobs), domestic and continental cups, a real-date calendar, national teams (world pool, call-ups, qualifiers, tournaments you can manage), light/dark theme, desktop and phone layouts, and save files you can download and load.

## Next, discussed but not started
1. **Importer / editor.** Load or edit leagues and data (clubs, players, ratings) from a file, with a validator that explains problems. The world file format is the starting point (`js/data/world-build.js`, `js/data/world-file.js`).
2. **Multiplayer competition mode.** One league with several human managers. Needs a shared state (a small server or a hosted database) and a round-by-round "everyone is ready" flow; the single-player engine already plays rounds deterministically from state, which helps.

## Ideas
- Tests with real assertions for each system (today they mostly check that nothing breaks).
- Optional TypeScript types for the state object `G` (JSDoc types would be a gentle start).
- Localisation (the game text is English; names are Portuguese-friendly).
