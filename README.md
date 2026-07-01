# smruti.samskruti.info

A static progressive web app (PWA) for studying Bhagavad Gita and Vishnu Sahasranama in Telugu, IAST (Roman), and Devanagari scripts.

## Features

- **Reader** — browse shlokas by chapter, navigate with keyboard, Today's Verse (☀️), last-visited verse restored on reload
- **Avadhānam (Practice)** — 9 test modes (pada recall, verse#, first letter, speaker/uvāca, first/last verse of chapter)
- **Vishnu Sahasranāmam** — 108 shlokas, 1000 names, nakshatra grouping with badge details
- **Search** — text search across Telugu/IAST/Sanskrit, filter-aware number search, `ch2` / `#42` shortcuts
- **BG Meta Panel** — names of Kṛṣṇa & Arjuna with verse chips, Gita in Telugu cinema, chapter summaries
- **Settings** — script, UI language, meaning language, font size (scales all text), lipi colour presets, light/dark/auto theme
- **Help panel** — collapsible sections, live search, Telugu + English, embedded YouTube walkthrough

## Tech stack

- Vanilla JS (IIFE modules, no bundler, no framework)
- CSS custom properties for theming and font scaling
- Static JSON data files served directly
- Service worker for offline support

## Project structure

```
/
├── index.html              # Single-page app shell
├── assets/
│   ├── css/main.css        # All styles
│   └── js/
│       ├── constants.js    # C — shared constants, config, labels
│       ├── i18n.js         # applyI18n(), window._uiLang
│       ├── app.js          # Top-level init: tabs, help, SW, keyboard shortcuts
│       └── modules/
│           ├── reader.js   # Reader + BG meta panel
│           ├── search.js   # Search tab
│           ├── avadhanam.js
│           ├── calendar.js
│           ├── meanings.js
│           └── settings.js # Persistent prefs via localStorage
├── data/
│   ├── gita-index.json     # Chapter list with titles & verse counts
│   ├── bg-meta.json        # BG about panel: speakers, names, films
│   ├── chapters/
│   │   └── ch01.json … ch18.json  # Shloka data
│   ├── vsn-index.json      # VSN shloka index
│   └── texts/vsn/
│       ├── nakshatras.json
│       └── *.json          # VSN shloka data
└── scripts/                # Data generation scripts (Python)
```

## Running locally

Serve the root directory with any static file server:

```bash
python3 -m http.server 4242
# or
npx serve . -p 4242
```

Then open `http://localhost:4242`.

## Asset versioning

All asset URLs use `?v=N` query strings (e.g. `main.css?v=19`). Bump the version number in `index.html` when deploying changes to CSS or JS files to bust browser cache.

## Key globals

| Variable | Set by | Purpose |
|----------|--------|---------|
| `window._script` | `settings.js` | Active script: `'te'` / `'ro'` / `'dn'` |
| `window._uiLang` | `settings.js` | UI language: `'te'` / `'en'` |
| `window._meaningLang` | `settings.js` | Meaning language: `'te'` / `'en'` / `'sa'` |
| `C` | `constants.js` | All constants (loaded first) |

## Custom events

| Event | Detail | Purpose |
|-------|--------|---------|
| `scriptChange` | script string | Script pill clicked |
| `uiLangChange` | — | UI language changed |
| `meaningLangChange` | lang string | Meaning language changed |
| `searchNavigate` | `{text, ch, s}` | Jump to a specific verse |
| `readerNavigate` | `{text, ch, s}` | Reader tab: navigate to verse |
| `showHelp` | — | Open help panel |
