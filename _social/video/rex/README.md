# Rex's Big Adventure videos

Two kinds of videos, both built from the game itself:

- **Promos** (real gameplay): `_social/videos/rex/rex-short.mp4` (1080×1920 Short), `rex-trailer.mp4` (1920×1080)
  and `rex-thumbnail.png` (1280×720). Upload notes: `_social/videos/rex/UPLOAD.md`.
- **Rex Stories** (funny cartoons, folder `stories/`): three Shorts and a 3-minute episode, animated with the game's
  own artwork. Upload notes: `_social/videos/rex/stories/UPLOAD.md`.

| File | What it does |
|---|---|
| `capture.js` | Plays the game in headless Chrome and records every frame (1920×1080, 30 fps) to `take.mkv` + `take.jsonl` (game state per frame). |
| `inpage.js` | Injected into the game page: virtual time (frame-exact capture) and the autopilot (jump, climb, roar, continue). |
| `edit.js` | The promo cut list: which seconds of the take go into each video, plus the captions (English + Telugu). |
| `overlay.html` / `overlay.js` | Promo captions, frame, title and end cards (HTML, so Telugu shapes correctly). |
| `music.js` | Cheerful music, game sound effects, cartoon effects and "dino chatter" voices, all synthesized locally. |
| `make_rex.js` | Promos: gameplay clips + overlay + audio → MP4s and thumbnail (ffmpeg). |
| `stories/engine.js` | Story engine: actors with keyframes, camera, speech bubbles (Telugu + English), captions, comic effects, sound cues. |
| `stories/episodes.js` | The story scripts (scenes are shared by the Shorts and the long episode). |
| `stories/classic.js` | The "Little Rex" Shorts in the black-and-white book style (Wren Can't See, Hide and Seek, Fire Sneeze). |
| `stories/make_stories.js` | Records the stories frame by frame (`--stills` for preview frames). `timeline.js` prints lengths and chapter times; `sheet.py` tiles preview stills. |
| `recording-build/` | What is added to a **copy** of the game for recording: `demo_hook.dart` + `rex_game.patch` (autopilot hook), `story_view.dart` + `main.patch` (the puppet theatre opened with `?story`). |

## Steps
1. **Recording build** (only needed again if the game changes). Copy the game source (`S:\Rex_adventure`, never
   change the original) to a temp folder. Add `recording-build/demo_hook.dart` to its `lib/` and
   `recording-build/story_view.dart` to `lib/story/`, apply `rex_game.patch` and `main.patch`, then
   `flutter build web --release --base-href /games/rex-adventure/`. The hook only exposes the game state and the same
   buttons a player presses; the theatre only draws with the game's painters. Never publish this build.
2. Serve it: copy `build/web` to `<tmp>/serve/games/rex-adventure/`, then `python -m http.server 8790` in `<tmp>/serve`.
3. Promos: `node capture.js ../../videos/rex/take 10` (about 1 hour for the whole game), check `take.jsonl`, adjust
   `edit.js`, then `node make_rex.js --stills` and `node make_rex.js`.
4. Stories: for the episode's gameplay outro, cut the montage from the take into numbered frames next to the page:
   `<tmp>/serve/games/rex-adventure/story-gameplay/0001.jpg …` (see `sceneGameplay` in `episodes.js` for the clips).
   Then from `stories/`: `node make_stories.js roar --stills`, look at the frames, and `node make_stories.js` for all.

Node packages come from `_social/video/node_modules` (`puppeteer-core`). ffmpeg must be on PATH.
