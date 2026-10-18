# Round 2b review: turnaround, second pass

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.5 §4 + §4.1.

## Files opened
- `frames/round2b/r2b-turnaround-color.png`: full size; the side and both back views zoomed 2×.
- `frames/round2b/r2b-turnaround-silhouette.png`: full size.
- `frames/round2b/r2b-headturn-front-color.png`: full size; yaw 67.5° and 78.75° zoomed 2×.
- `frames/round2b/r2b-headturn-back-color.png`: full size; yaw 112.5° and 123.75° zoomed 2×.
- In the overview only: `r2b-turnaround-bw.png`, `r2b-turnaround-guides.png`, `r2b-headturn-*-bw.png`.

## Round 2 blockers: status
| # | Status | Note |
|---|---|---|
| B1 side head | **FIXED** | The round forehead and short round muzzle read as a cute baby dino in colour and in silhouette. Depth 123 at y −20 is within 120 ± 6. The 56–90° strip frames are now soft as well. |
| B2 far-eye bar | **FIXED** | The far eye now slides behind the snout bridge (67.5°, 78.75°); there is no sliver or bar. |
| B3 back tails | **FIXED** (it reads as a tail, not a belt; the right leg is clear in the back view; the silhouette shows a clear tail hook) | Polish P2 and P3 below. |
| B4 back arms | **FIXED** | The forearms connect; the silhouette shows attached nubs, not floating dots. |

The previous polish is all done: front nostrils, cheek-bump stroke, ¾-back belly crescent, side far heel.

## Acceptance (Bible §12 round 2)
1. Shared guide lines: **PASS**.
2. Front width 124 vs side depth 123: **PASS**.
3. Landmark counts: **PASS**.
4. "Same creature?" with the other views covered: **PASS** for all 5.
5. Head turn 0→90→180 without pops: **PASS**, with polish P1.

## Scores
| Category | Score |
|---|---|
| Identity & appeal | **4** |
| Proportions & on-model | **4** |
| Turnaround | **4** |
| Poses & silhouette | **4** |
| Style consistency | **4** |

## Polish (not blocking; fix in the round 3 build)
- **P1. Head-turn eyes at the edge.**
  - At 112.5° the near eye sits on the silhouette edge, clipped, and the brow fuses with the top lid, so it reads like a fish eye.
  - At 67.5° the far brow lies on the far eye's top rim.
  - Rule: any automated head turn that passes through **yaw 100–125°** must have the eyes closed (blink) on those frames. This matches §8.3, "blink on turns > 20°".
  - The far brow keeps ≥ 4 units of gap above the far eye outline. Below that, fade it out over 4 → 1 unit.
- **P2. Back-view tail root.** The full outlined ellipse at (0,−44) reads like a separate round lump. Only stroke its **lower half-arc** (from 200° to 340°), so the root flows out of the body; keep the fill.
- **P3. ¾-back tail base.** The tail outline crosses the body as a straight cut where the tail starts. Start the centreline 8 units inside the body silhouette, at (−10,−50), and **don't stroke** the first 12 units of the tail outline (on both edges).
- **P4.** In the back strip, the far spots fading in at 146–168° show as half-alpha ghosts at the edge for 2 frames. Use clip-by-outline (as for the eyes) instead of an alpha fade.

## Notes for round 3 (expressions + mouth chart + face-kit demo, Bible §12)
- Include carried item **C1** (open-mouth shape, Bible v1.4 §6). I will check it on M2, M3, M4, M6, M9, M10, M11 and M15.
- Build all 16 mouths and all 24 expressions in the ¾ view. In addition, show **E1, E2, E3, E10 and E13 at yaw 0° (front)**, so the front face kit is proven too.
- The face-kit sheet: each control at its minimum, middle and maximum, on one neutral head per row (brows, lids, pupil, look, mouth controls, cheek, blush, flare, wrinkle, tears, sweat).
- Phone test: also export `r3-expressions-heads-360.png` (the heads sheet downscaled to 360 px wide). I'll judge readability from that file.

## Verdict
`APPROVED`. Round 2 is closed. Polish P1–P4 are due in the round 3 build. Proceed to round 3.
