# Round 2 review: turnaround

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.4 §4 + §12.2a (now amended to **v1.5**, see the new §4.1).

## Files opened
- `frames/round2/r2-turnaround-color.png`: full size; the front, side and both back views each cropped and zoomed 2×.
- `frames/round2/r2-turnaround-silhouette.png`: full size.
- `frames/round2/r2-turnaround-guides.png`: full size, with the readouts.
- `frames/round2/r2-headturn-strip-color.png`: full size; yaw 78.75° and 90° zoomed 2×.
- In the overview only: `r2-turnaround-bw.png`, `r2-headturn-strip-bw.png`.

## Overall
A strong first turnaround. The **front view is adorable** and clearly the same Rex. The ¾ master is untouched. The hat, the hat width (63 in all views), the head top and the guide lines are consistent; there are 5 bumps in every non-front view; the eye height (ry) is 25–26 wherever an eye shows; and the light stays upper-left. The head-turn strip from 0° to 45° is smooth with no pops.

The problems are concentrated in the **side view** (the snout became a lizard cone; my §4 numbers caused it), the 78.75° head-turn frame, and the back views' tail and arms.

## Acceptance (Bible §12 round 2)
1. Every view touches the same guide lines (±2): **PASS**.
2. Front skull width (124) = side skull depth ± 6: **FAIL** (94). The cause is my §4 slope. The corrected outline is in §4.1.
3. Identical landmark counts: **PASS** (bumps 0/5/5/5/5 as expected; the visible spot counts are consistent with §4; the hat is the same in all views).
4. "Same creature?" with the other views covered: front ✓, ¾ ✓, ¾ back ✓, back ✓ (but see B3 and B4); **side ✗**: alone, it reads as a gecko or lizard.
5. No pops in the head-turn strip: **FAIL** at 78.75° (a black vertical bar where the far eye squashes).

## Scores
| Category | Score | Note |
|---|---|---|
| Identity & appeal | **4** | The front view is a highlight; the side view pulls it down. |
| Proportions & on-model | **4** | |
| Turnaround | **3** | Side head, back tail and arms. |
| Poses & silhouette | **3** | Side silhouette is a cone snout; the back silhouette has floating arm dots. |
| Style consistency | **4** | |

## Answers to the animator's questions
- **Front tail nub at (−58,−46)**: **APPROVED** (the Bible's −66…−80 detaches it, as you found).
- **¾-back tail thickness 36/28/20/14**: **APPROVED**, with a new centreline (§4.1).
- **Back tail 26/20/15/12 and its centreline**: **REPLACED** (B3).
- **Side snout**: you are right; my slope (30,−42) → (80,−12) cut the forehead. The corrected 25-point side outline is in §4.1, with skull depth 120 at y −20.
- **GPU clip bug and `--disable-gpu`**: excellent find, **APPROVED** as the standard for all renders. Tell Main: the Episode 1 glitch frames should be re-rendered with `--disable-gpu` (outside my scope).

## Blockers (4)
| # | What's wrong | Where | Why it matters | Exact change |
|---|---|---|---|---|
| B1 | **The side view head is a lizard cone.** The straight forehead-to-snout line makes a long wedge snout; the eye sits where the snout starts; the skull depth is 94, not 120. The 56–67° head-turn frames inherit the wedge. | side column of `r2-turnaround-color` and `-silhouette`; `r2-headturn-strip` frames 56.25–90° | The "gecko" read we removed in round 1 comes back in every profile and travel shot | Use the §4.1 side outline (25 points, round forehead down to (63,−20), round muzzle to the tip at 90). Side eye at HC(26,2), 15 × 25; brow (26,−32); nostril (85,−2); mouth A (30,24) with a tick to (27,20), B (56,33), F (84,25); face zone (40,8) 46 × 34. Every in-between yaw stays convex, with no straight forehead-to-snout run over 25 units. **Target readout: skull depth at y −20 = 120 ± 6.** |
| B2 | **Far eye at 78.75° is a black vertical bar** (the eye's width squashed to a sliver, with both outlines merging) | `r2-headturn-strip-color`, yaw 78.75 | It reads as a scar or slit pupil; a pop in every head turn | Don't shrink the width. **Occlude**: clip the far eye with the snout-bridge curve (the head outline offset 3 units inward between the brow and the nostril), so it slides behind the bridge. Only draw its outline and pupil while the visible width is ≥ 6 units, fading out over 6 → 3. The far brow fade (70–80°) is fine. |
| B3 | **The back-view tail reads as a belt or scarf**: a horizontal sausage across both legs. In ¾ back the tail is a thick club covering most of the near thigh. | back and ¾ back columns | It hides the legs, the tail stops reading as a tail, and it loses grounding | Back: the base ellipse at (0,−44), 22 × 18, then the centreline (0,−44) → (−12,−30) → (−34,−22) → (−56,−24) → (−70,−36), thickness 40/30/20/12 with an r 6 cap; it overlaps **only the left foot**, the right leg stays clear, and the tip is ≥ 10 above the ground. ¾ back: centreline (−14,−44) → (−40,−30) → (−66,−26) → (−86,−32) → (−96,−44), with your thickness 36/28/20/14; it overlaps ≤ 40 % of the near thigh, and the far foot stays visible. |
| B4 | **Back-view arms are floating dots**: small round hands at the body sides, barely connected (they become separate blobs in the silhouette) | back column, `r2-turnaround-silhouette` | Detached shapes break the silhouette and look like ears or balls | Show the hand plus 8 units of forearm coming from behind the body, (±48,−96) → hand (±56,−88), overlapping the body outline by ≥ 4, drawn before the body so the body outline crosses it. |

## Polish
- **P1. Front nostrils** sit between the eyes at eye level and nearly touch the inner eye rims. Move them to (±6,20), 2.2 × 1.6. Eyes at (±33,0), 20 × 26. Mouth corners (±22,32) with ticks up 4, middle (0,40). Muzzle arc: upper half of the ellipse (0,24), 30 × 20, at line 1.4, dark 0.35. (All in §4.1.)
- **P2. ¾-back cheek bump**: a stroke runs inside the skull at the top-right. Only outline the part outside the skull ellipse.
- **P3. ¾ back**: the belly crescent at the right edge is fine, but its bottom runs into the thigh with a tangent. End it 6 units above the thigh outline.
- **P4. Side view far foot**: only a small dark wedge of it shows at the heel. Either show its toe 12 units ahead of the near heel (per §4), or hide it completely; no slivers.
- **P5. Body view switching for animation** (needed by round 5): the body views are discrete. Switch only at yaw 22.5/67.5/112.5/157.5, on a blink or a fast-move frame, never during a hold (§4.1).

## For round 2b, re-render
- `r2b-turnaround-{color,silhouette,guides}.png`
- `r2b-headturn-strip-color.png`, plus the same strip continued from 90° to 180° in 9 steps (`r2b-headturn-back-strip-color.png`). This tests the back half of the turn, including the face pieces disappearing at 115° and the cheek bump.

## Verdict
`CHANGES NEEDED (4 blockers)`
