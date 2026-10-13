# Kramavriddhi website (kramavriddhi.com)

Static site on GitHub Pages (repo NagendraBabuEdru/kramavriddhi.com, branch `main`, custom domain via `CNAME`). Pushing to `main` publishes in about a minute. The owner reads Telugu; explain things simply.

## How pages are made
Almost every HTML page is **generated**. Edit the generator, not the HTML:

- `_tools/gen.py` builds schemes (`SCHEMES` list + one `write(...article(...))` block per guide), collections (`/schemes/for-women/`, `/schemes/for-youth/`), state hubs, Telugu pages, tools (eligibility checker EN+TE, APY and SSY calculators), `/updates/` (`UPDATES` list), `/apps/` (`APPS_LIVE`, `APPS_SOON`), `/games/`, About/Contact/Privacy/Disclaimer, `404.html`, `sitemap.xml`, `robots.txt`.
- `_tools/parts.py` has the shared `head()` (Google Analytics G-S6RF0STQM2, hreflang, versioned CSS/JS), `nav()`, `footer()` and the `SOCIAL` list (YouTube; add Instagram there).
- `_tools/te_content.py` + `te_content2.py` hold Telugu versions keyed by scheme slug (`TE`).
- `_tools/home.py` builds `index.html` (reads `home_updates.html`, `home_cards.html`, `home_apps.html` written by gen.py).
- Rebuild: `python _tools/gen.py && python _tools/home.py`
- `assets/style.css` and `assets/site.js` (calculator suggestion pop-up card, per-path config) are hand-edited.
- `games/rex-adventure/` is a copied Flutter web build (source: private repo Rex_adventure). Rebuild with `flutter build web --release --base-href /games/rex-adventure/` from PowerShell, copy `build/web`, then re-add the Google Analytics snippet to its `index.html`.
- Folders starting with `_` (`_tools`, `_social`) are not published.

## Rules for content
- Verify scheme facts from official sources (portals, PIB, gazettes, district govt sites); cite them in `sources`. Update `UPDATED` / "Last updated" and `/updates/` when facts change.
- Be explicit when a scheme is stalled, ended or disputed; never present it as active.
- Keep the "not a government website" note and warnings about agents, Aadhaar, OTP and fees.
- When adding a scheme: add it to `SCHEMES`, write its article block, add a checker rule + reason text in both `CHECKER_TEXT["en"]` and `["te"]` if relevant, and link it from the right collection.

## Before publishing
1. `python -m http.server 8765` in the repo root and check pages; run the internal link check (every `href="/..."` returns 200).
2. Commit with the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, push, then confirm live with `curl`.
3. Never delete `google12eb8119c9ff72ef.html` (Search Console verification) or `CNAME`.

## Social
`_social/` holds the brand kit: `make_kit.py` (renders images with headless Edge so Telugu shapes correctly; PIL here has no raqm), `SOCIAL_KIT.md` (captions, Shorts scripts), `YOUTUBE_PLAYLISTS.md`, and `video/` + `videos/` for YouTube Shorts. YouTube: youtube.com/@kramavriddhi.
