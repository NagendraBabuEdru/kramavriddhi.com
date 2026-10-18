# Rex design project: brief for the design expert

## Goal (from the owner)
Make **Rex** perfect before making more videos: his looks from every direction, all his facial expressions and moments, and how his body reacts to the forest (wind, rain, cold, water, ground). The result is a reusable **character kit** that makes new episodes and Shorts quick to build, with Rex always on-model.

## Who does what
- **Design expert (you, an agent)**: you own the *design decisions*. You write the spec (the "Rex Bible"), review every model sheet and test clip, and approve. Your skill pack is in `design/skills/` (01–05); read all five before starting, and follow 05 for every review.
- **Animator (the Rex videos session)**: builds everything in code (Canvas2D pencil-storybook style, `_social/video/rex/sketch/`), renders sheets and clips, and sends them to you.
- **Owner**: Telugu-speaking; audience is small children (YouTube @kramavriddhi, made for kids).

## Where things are
- Current puppet: `sketch/rex_puppet.js`, `A.rex(x, y, s, pose)`. It has only a ¾ view facing right (it mirrors with `flip`).
  - Pose fields: eye open|wide|happy|sad|closed|squeeze, brow, look, blink, mouth smile|grin|open|laugh|o|wail|sad|closed|sneeze, tears, headTilt, squash, lean, tail, tailSwing, step, arms, blush, shellHat, shiver.
- The drawing kit is `sketch/art.js` (pencil lines, hatching, fills); props are in `props.js` and `props2.js`; the world/camera is `film.js`.
- Round 0 frames (the current state) are in `design/frames/round0/`:
  - `sheet-0.0-*.jpg`: the current expression row;
  - `ep0-*.jpg` and `ep1-*.jpg`: Rex inside the finished Episode 0 and the Episode 1 test.
- Episode history and the earlier director's notes are in `director/`.

## Phases (the expert may reorder or split these)
1. **Audit + Rex Bible v1**: proportions with numbers, the landmarks list, the colour/value plan, line rules, the views needed, the expression list, the pose list, the motion cycles, and the forest-reaction list. Each item gets acceptance criteria.
2. **Turnaround sheet**: front, ¾ front, side, ¾ back and back, on guide lines.
3. **Expression sheet**: the full face kit and the core set (Skill 2), plus mouth shapes.
4. **Pose & silhouette sheet**: key poses, plus a black-silhouette version.
5. **Motion strips/clips**: idle breathing and blinks, walk, waddle-run, hop, head turn, shake-dry, startle, sneeze.
6. **Forest reaction clips**: wind gust, rain on the nose, heavy rain, cold, puddle splash, sunbeam, balancing on a slope or a raft.
7. **Forest atmosphere sheet**: layers, light, and prehistoric flora; Rex lit consistently within it.

Each phase: the animator builds it, then renders it to `design/frames/roundN/`; the expert reviews it into `design/reviews/`. Repeat until the expert writes APPROVED.
