# Round 5 review: motion strips and clips

Reviewer: design expert. Date: 2026-10-20. Against REX_BIBLE v1.8b §8 and §12 (round 5), plus the round 4d build notes.

## Files opened (full size)
- **Strips**:
  - `r5-walk-strip-p1.png`
  - `r5-hop-strip.png`
  - `r5-shake-strip.png`
  - `r5-sneeze-strip.png`
  - `r5-turn-strip-p1.png`
  - `r5-startle-strip.png`
- **Paths**: `r5-walk-paths.png`, `r5-jump-paths.png`, `r5-run-paths.png`.
- **Sheets**: `r5-p01-p16-silhouette.png`, `r5-expressions-body-color.png`.
- **Not opened**:
  - the `.mp4` clips (I have no video player here; motion was judged from the every-2nd-frame strips and the path plots);
  - `r5-walk-strip-p2.png`, `r5-turn-strip-p2.png` and the idle strips;
  - the guides pages, and the remaining paths (`hop`, `idle`, `shake`, `sneeze`, `startle`, `turn`).
  
  The idle clip is accepted on the builder's numbers. I'll spot-check it in round 5b.

## Overall
A strong first motion pass:
- **Walk**: textbook. Foot lock drift is 0.000, the contacts land on the 14 f grid, and the head and hat travel on soft wave arcs with the right 2 f lag. The tail-tip path shows a clear offset wave lagging the hips.
- **Run**: has a readable flight phase. Its head path has sharp corners at the landings, which is correct for impacts (Skill 3: impacts are sudden).
- **Hop**: reads light and bouncy, with a nice squeezed-eyes landing at f22.
- **Shake-dry**: the head → body → tail order reads, the droplets fly on tangents and splat, and it ends on a happy E2.
- **Sneeze**: the build-up is charming (three inhales, a cross-eyed look), and the release, double blink and giggle land well.
- **Head turn**: 45 → 0 → 90 → 45 with no pops, the eyes leading, and a blink on each turn.
- **Squash area ratio**: 1.000 everywhere ✓.

## Carried items
- **C4 (P01/P16): ACCEPTED.** In silhouette, P16 now separates from P01 by the tilted-back head and the diagonal forward-up arm. The snout doesn't yet point "at the sky". Polish only: in round 5b, add headTilt −0.55 with the snout tip rising ≥ 30 units above the eye line.
- **Round 3 body expressions with the corrected tail: APPROVED.**
  - E10's tail is low and straight (reads sad);
  - E13's and E22's tails are low and tense;
  - E2's and E3's tails are relaxed.
  
  All six read correctly.

## Deviations
| Deviation | Ruling |
|---|---|
| Hat pops of 8 (startle) and 6 (sneeze), keyed on top of the spring | **APPROVED.** Keyed story pops may exceed the ±3 clamp; the spring clamp only limits passive wobble. The hat must still overlap the skull by ≥ 4 at the peak of the pop (it does at s 1.6). |
| Shake tail spring at 6 Hz | **APPROVED** for shake-dry only. Add it to the Bible as `spring.fast`. |
| Droplets only at the 4 strongest reversals (10–14 total) | **APPROVED.** |
| Walk heels kept to 6 because per-foot heels raise the body | **APPROVED for now.** The fix is **due before round 6**, because slopes need per-foot heights. Each foot's heel/height offsets that foot only; the hip height comes from the planted foot. |
| Run head and hat paths zigzag at landings | **APPROVED.** Impacts may be sharp. Smooth only the hat, by giving its spring 1 f more lag in the run. |

## Scores
| Category | Score | Note |
|---|---|---|
| Motion (clips/strips) | **4** | Except the two blockers below. |
| Style consistency | **4** | The boil isn't visible as strobing in the strips; confirm in the mp4 spot-check. |
| Poses & silhouette | **4** | |

## Blockers (2)
| # | What's wrong | Where | Why it matters | Exact change |
|---|---|---|---|---|
| B1 | **Startle floats.** After the f11 jolt, Rex stays about 10 units off the ground for f12–f18 (no foot ticks, a shadow under empty space), then drops. A 7-frame hover reads as levitating. | `r5-startle-strip.png`, f12–f18 | Gravity (Skill 4): nothing floats | The jolt is a **2-frame hop**: f11 up 10 (stretch 0.12), f12 up 6, f13 back on the ground (soles at y 0, a squash of 0.06 for 1 f). The **±1 vibration hold (f13–f18) happens with the feet planted** and the foot ticks visible. The hat pop of 8 lands 2 f after the body (spring). |
| B2 | **The jump tail pops up at take-off.** The tail-tip path jumps about 90 units, from its rest low behind the body (f12) to high up (f16), in a straight segment. It leads the body instead of trailing it. | `r5-jump-paths.png`, blue path, f12 → f16 | Follow-through (§8.10): the tail lags 6–8 f; a pop breaks the arc | Drive the jump tail from the same lag spring as everywhere else. At take-off (f12–f16) the tip must **drag low** (lift −0.25, trailing below the hip). It should reach its highest point **after** the body's apex (about f26–28) and whip up on landing (+0.2, overshoot 15 %), then settle within 10 f. The path must be one continuous arc, with no segment longer than 25 units per frame. |

## Polish
- **P1.** Sneeze spray: the 12 particles drift horizontally and hang in the air for about 14 frames (f42–f54), like smoke. Give them a launch speed of 400 units/s in the ±20° cone, a drag of 6 /s, gravity 600 units/s², and fade them out over 10 f. They must be gone by release + 12 f.
- **P2.** P16 head tilt: as noted under C4.
- **P3.** On the mid-turn frames at 90° (turn f54–f56), the blink-opening half-lid reads as smug for 2 frames. Open the lid faster on the way back up (closing takes 1 f, opening 2 f, i.e. f2 → f4 at 0.5 → 1), or put the blink entirely before the turn's midpoint.

## For round 5b, re-render
- `r5b-startle-{strip,paths}.png` + `.mp4`
- `r5b-jump-{strip,paths}.png` + `.mp4`
- `r5b-sneeze-strip.png`
- `r5b-p16-silhouette.png`
- **Spot-check frames from the clips**: `r5b-idle-frames.png`, with frames 0, 36, 72, 108 and 144 of the idle clip side by side, to confirm the moving hold and the boil.

## Verdict
`CHANGES NEEDED (2 blockers)`
