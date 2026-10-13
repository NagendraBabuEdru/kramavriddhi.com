# Rex's Big Adventure promo videos

Makes `_social/videos/rex/rex-short.mp4` (1080×1920 Short), `rex-trailer.mp4` (1920×1080) and
`rex-thumbnail.png` (1280×720) from **real gameplay**. Upload notes: `_social/videos/rex/UPLOAD.md`.

| File | What it does |
|---|---|
| `capture.js` | Plays the game in headless Chrome and records every frame (1920×1080, 30 fps) to `take.mkv` + `take.jsonl` (game state per frame). |
| `inpage.js` | Injected into the game page: virtual time (frame-exact capture) and the autopilot (jump, climb, roar, continue). |
| `edit.js` | The cut list: which seconds of the take go into each video, plus the captions (English + Telugu). |
| `overlay.html` / `overlay.js` | Captions, frame, title and end cards (HTML, so Telugu shapes correctly). |
| `music.js` | Cheerful background music + game sound effects, synthesized locally (no downloaded audio). |
| `make_rex.js` | Puts it together with ffmpeg: gameplay clips + overlay + audio → MP4s and thumbnail. |
| `recording-build/` | The tiny hook added to a **copy** of the game for recording (`demo_hook.dart` + `rex_game.patch`). |

## Steps
1. **Recording build** (only needed again if the game changes). Copy the game source (`S:\Rex_adventure`, not
   the original) to a temp folder, add `recording-build/demo_hook.dart` to its `lib/`, apply
   `rex_game.patch` (3 lines: import, `dialogLineFull` getter, `registerDemoHook(this)` in `onLoad`), then
   `flutter build web --release --base-href /games/rex-adventure/`. The hook only exposes the game state and the
   same buttons a player presses; gameplay and graphics are unchanged. Never publish this build.
2. Serve it: copy `build/web` to `<tmp>/serve/games/rex-adventure/`, then `python -m http.server 8790` in `<tmp>/serve`.
3. Record: `node capture.js ../../videos/rex/take 9` (from this folder; slow, about 1 hour for the whole game).
4. Check the take (`take.jsonl` says where rescues, level-ups, swims and roars happen) and adjust `edit.js`.
5. `node make_rex.js --stills` writes sample frames to `_social/videos/rex/frames/`; `node make_rex.js` makes everything.

Node packages come from `_social/video/node_modules` (`puppeteer-core`). ffmpeg must be on PATH.
