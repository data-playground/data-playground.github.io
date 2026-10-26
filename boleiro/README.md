# Boleiro

A text-only football (soccer) management game that runs entirely in the browser. It aims for the middle ground between deep modern management sims and the light, fast, text-only Brazilian classics: lots of leagues, players and club-management areas, but a lightweight, text-based match experience.

*Boleiro* is Brazilian slang for someone who lives and breathes football.

- No server, no accounts, no build step, no dependencies. It is plain HTML, CSS and JavaScript.
- Works on desktop and phone (the layout switches to a bottom bar and larger text on small screens).
- Every club and player name is invented ("parallel world"): the data looks like real football (ages, ratings, nationalities, values) but no real names are shipped.

## Play it

**Online:** once published, the game is at `https://<your-user>.github.io/<repo-name>/` (see below).

**Locally:** open `index.html` in a browser (double-click works), or run a tiny local server:

```bash
npm start        # http://localhost:8080  (needs Node 18+, no packages to install)
```

**As one file:** `npm run build` creates `dist/boleiro.html`, a single self-contained page you can e-mail or host anywhere.

## Publish on GitHub Pages

1. Create a new GitHub repository (for example `boleiro`) and push this folder to the `main` branch.
2. In the repository go to **Settings, Pages**.
3. Pick **one** of the two options:
   - **Simplest:** *Source: Deploy from a branch*, branch `main`, folder `/ (root)`. Done.
   - **With tests:** *Source: GitHub Actions*. The included workflow (`.github/workflows/pages.yml`) runs the tests and only publishes if they pass.
4. After a minute the site is live at the URL shown on that page. All paths are relative, so it works under `https://user.github.io/repo/`.

## Saving games

- The game autosaves after every round and has three manual slots (stored in the browser, per device).
- **Save / Load page, Download save file:** gets a `.boleiro` file. **Load from file** restores it on any device or browser. This is how you move a game between your phone and computer, or send a save to a friend.
- Older "save codes" (copy and paste text) still load.

## Project layout

```
index.html              page shell; lists the CSS and every script in load order
css/                    styles, split by purpose (tokens, base, layout, components, mobile)
js/
  core/                 game state, helpers, round loop, season rollover, saves, migrations
  data/                 name pools, world builder, embedded world file (world.js)
  engine/               match engine, lineups and tactics, live-match controls
  systems/              game rules, one file per area:
                          transfers, negotiation, deals, finance, facilities, youth,
                          cups, calendar, career, AI coaches, staff, press, conversations,
                          review, inbox, progression
    international/      world player pool, windows, tournaments, playable national team, qualifiers
  templates/            everything that turns state into HTML (one file per page area)
  ui/                   render(), click/input handling, drag and drop, theme, start-up
tests/                  headless tests (Node only) and the harness that runs them
tools/                  local server and single-file build
docs/                   roadmap and notes
```

### How the code is organised

- **Plain scripts, shared global scope.** There is no module system on purpose: the game keeps one state object, `G`, and the files share it. `index.html` loads the scripts in dependency order. Function declarations can be called from any file at runtime; only top-level `const`/`let` initialisers need their dependencies loaded first, which is why the order matters.
- **Rules vs. HTML.** Files under `systems/`, `engine/` and `core/` hold logic and never build markup. Files under `templates/` return HTML strings from the current state (`clubHTML`, `marketHTML`, `careerHTML`, ...).
- **One click handler.** `ui/render.js` renders the page into `#app` and handles clicks by data attributes: `data-v="squad"` switches view, `data-a="buy"` runs an action. To add a button, add the attribute in a template and a branch in that handler.
- **Adding a file:** create it under the right folder, add a `<script src>` line to `index.html` after the files it depends on at start-up, and run `npm test`.
- **Saves are versioned lazily.** Old saves are upgraded in `core/migrate.js` (`mig()`), so new state fields must be defaulted there.
- Save storage keys still begin with `bfo_` (the project's former working name) so existing saves keep working.

## Tests

```bash
npm test             # quick headless checks (about a minute)
npm run test:long    # adds multi-season simulations
```

They load the real scripts into a Node `vm` context with a fake DOM, start a game and exercise the systems (transfers, part-exchange, national teams, sackings, save round trip, and so on). They check for crashes and broken invariants; they are not a replacement for playing.

## Name

"Boleiro" won over the earlier working title. Alternatives kept for later: **Pelada** (a casual pick-up game), Boleirão, Resenha. If you change the name, search `index.html` and `js/ui/render.js` for the title and header, and the save file name in `js/core/saves.js`.

## Roadmap

See [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Legal note

The game is a personal project. No real club, player or league names ship with it, and no real logos or kits. Before publishing widely, check any third-party fonts (IBM Plex via Google Fonts) and pick a licence for the code (none is included yet).
