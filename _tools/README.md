# Site generator

The pages under `schemes/`, `te/`, `tools/`, `updates/`, `apps/`, `games/index.html`, `about/`, `contact/`, `privacy-policy/`, `disclaimer/`, `404.html`, `sitemap.xml` and `robots.txt` are generated.

To add or edit a scheme, change `gen.py`, then run from the repo root (use **PowerShell**: headless Edge cannot write screenshots from the sandboxed Git Bash shell):

    python _tools/gen.py
    python _tools/home.py

`parts.py` holds the shared header (`head()`, with og:image tags), nav, footer and `share_bar()` (WhatsApp, copy link, phone share). Folders starting with `_` are not published by GitHub Pages.

## Last updated dates

Each guide shows its own "Last updated" date from `GUIDE_UPDATED` in `gen.py` (guides not listed use `UPDATED`). When you change a guide's facts, set its date there; the Telugu page, JSON-LD and sitemap use the same date.

## Link preview images (og:image)

`og.py` draws a 1200×630 preview card for every guide (English and Telugu), the checker, calculators, collections and the Updates page, plus a site card (`default.png`) for all other pages. Cards are HTML pages rendered with headless Microsoft Edge so Telugu shapes correctly, saved to `assets/og/` (`assets/og/te/` for Telugu).

- `gen.py` registers cards with `og_card(...)` and calls `og.build()` at the end. Only cards whose content changed are rendered again; hashes are kept in `og_manifest.json`.
- Image URLs carry `?v=<hash>`, so WhatsApp and Facebook fetch the new picture when a card changes.
- After changing the card design in `og.py`, bump `TEMPLATE_VERSION` to re-render all cards (about 3 minutes).
- Keep each image under 300 KB (WhatsApp may skip bigger previews). Cards are currently under 100 KB.
