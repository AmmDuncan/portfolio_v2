# Extracting the Local Dictation site

This page lives in the portfolio for now, but is built to lift cleanly into a
standalone product site later (e.g. its own repo + `localdictation.app`, with a
commerce layer). Everything it needs is in **two places**:

- `components/local-dictation/` — `SignalPanel.jsx` + `SignalPanel.module.css`
  (the animated Signal Energy overlay, fully self-contained), `page.styles.jsx`
  (all section styled-components + the local `Wrap` container), and this file.
- `pages/local-dictation.js` — the page composition + copy.

It imports **zero portfolio components**. Only npm deps:
`styled-components`, `framer-motion`, `react-icons`.

## To lift it into a standalone app

1. Copy `components/local-dictation/` and `pages/local-dictation.js` into the new app.
2. Install the deps above.
3. Provide the three things the portfolio currently supplies (the page assumes
   them; without them it falls back to sane standalone defaults — see the
   EXTRACTION CONTRACT block at the top of `page.styles.jsx`):
   - **10px root font size.** The section styles use `rem` against a 10px root —
     set `html { font-size: 62.5%; }` (the portfolio does). Without it, every
     `rem` renders ~1.6× too large. `SignalPanel.module.css` uses `px`, so it is
     unaffected.
   - **Fonts.** Load **Inter** + **Crimson Text** (e.g. `@fontsource/inter`,
     `@fontsource/crimson-text`), or override `--ld-display` / `--ld-body`.
   - **Theme surface vars** (optional — fallbacks exist): `--color-text`,
     `--color-project-c-bg`, `--color-project-c-border`. The page reads them via
     `--ld-text` / `--ld-card-bg` / `--ld-card-br`, each with a light-mode
     fallback baked in. For dark mode, the portfolio toggles a `body.dark` class;
     a standalone app should do the same (or replace the `:global(body.dark)`
     rule in `page.styles.jsx` with `@media (prefers-color-scheme: dark)`).
4. Set a page background on `body` (off-white light / dark) — the page itself is
   transparent so it sits on the host background. The portfolio also paints a
   noise texture on `body::after`; copy that if you want the same grain.
5. The brand (emerald→teal Signal Energy) is **self-owned** via `--ld-*` tokens
   on the `Page` root — nothing to port, it travels with the component.

## What changes for commercialization (beyond placement)

- Own domain + brand identity separate from the portfolio.
- Paid distribution: Apple notarization + Developer ID so buyers skip Gatekeeper,
  plus license keys + a processor (Lemon Squeezy / Paddle handle VAT + licensing).
- A pricing section, checkout, and a privacy policy / terms.
- Decide the source license (the app repo is currently public).
