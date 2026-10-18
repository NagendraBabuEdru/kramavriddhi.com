# Round 3b review: expressions, mouth chart, face kit (second pass)

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.6.

## Files opened
- `frames/round3b/r3b-mouths-color.png`: full size; M3, M4, M15 and M9 zoomed.
- `frames/round3b/r3b-expressions-heads-color.png`: full size; E15, E17 and E22 zoomed.
- `frames/round3b/r3b-heads-120.png`: the real phone-size test.
- `frames/round3b/r3b-expressions-body-color.png`: full size.
- `frames/round3b/r3b-front-color.png`: full size.
- Not opened this pass: `r3b-mouths-bw`, `r3b-expressions-heads-bw`, `r3b-expressions-heads-360` and `r3b-facekit-1-color`. The face-kit controls were already proven in round 3; only the lid rule changed, and it is visible in E15 and E17.

## Round 3 blockers: status
| # | Status | Note |
|---|---|---|
| B1 (C1) open-mouth beak | **FIXED** | M3, M4 and M15 now read as one rounded muzzle split by the mouth: the jaw front comes forward level with the snout, and there is no hooked beak. M9 has a slight underbite, which is cute and fine for a wail. **C1 is closed.** |
| B2 empty-ring eyes | **FIXED (rings) / one residue** | No more hollow rings: E15 is sleepy, E17 reads as a wind-up and the cold squint reads. But the lid fill is a flat colour, while the face has a gradient glow, so **pale ghost ovals** show where the eyes are under the lids (E15, E17, E22; visible even at 120 px on E17). See C2. |

Polish P2–P6 are done: the E13 face and hands (no bow tie), the E22 blush, puff and shiver ticks, wail streams from the eye corners, sweat at the cheek, the E17 head tilt.
**P1 is not visible**: on `r3b-front-color` the E13 front eyes still reach the head outline on the right side. Please check that the sheet was re-rendered.

## Phone test (`r3b-heads-120.png`, the real Short size)
| Head | Reads at 120 px? |
|---|---|
| E2 happy | ✓ |
| E3 laugh | ✓ |
| E10 sad | ✓ |
| E13 scared | ✓ (now clearly scared, distinct from E14) |
| E15 sleepy | ✓ |
| E17 sneeze wind-up | ✓, but the ghost ovals are visible (C2) |
| E22 cold | ✓ (the blush, puff and ticks sell it) |

**PASS.**

## Scores
| Category | Score |
|---|---|
| Identity & appeal | **4** |
| Proportions & on-model | **4** |
| Expressions | **4** |
| Poses & silhouette | **4** (E13 and E22 bodies now read; the tail wrap is still due in round 4) |
| Style consistency | **4** |

## Decision
Every expression and mouth reads correctly and is distinct, at full size and at phone size. The remaining residue is purely a fill-matching bug, with one precise fix. So **round 3 is approved**, and it is carried as C2, which every round 4 frame will be checked against.

### Carried item C2 (must be fixed in the round 4 build; a blocker if it is still visible in round 4)
**Lid skin must match the face exactly, including the glow.** Don't fill the lids with a flat `#b4da82`. Instead, clip to the lid region and **re-draw the same head fill + face light-zone gradient + jaw glow** that sits under it (call the same fill routine with the lid clip). **Test**: in E15 and E17 at 300 % zoom, no oval outline or value step is visible above the lid edges, in colour or B&W.

### Carried item C3 (polish, due in round 4)
Front view, wide eyes: they must keep ≥ 6 units from the head outline (Bible v1.6). If rx × 0.88 isn't enough, also reduce the wide-eye growth in the front view to 1.05 instead of 1.1.

### Small polish
- **M4/M15**: a short dark vertical stub remains where the upper lip meets the far mouth corner. Round it off, or end the snout-front stroke 3 units above the corner.
- **E22 breath puff**: it is cut by the cell edge on the heads sheet. On sheets, keep each cell's contents inside it; the puff may shrink to 12 × 8 there.

## Round 4 (poses + silhouettes, Bible §7 and §12) notes
- Fix C2 and C3 first.
- The **tail wrap** is a blocker in round 4: segments 3–5 curl forward under the body; the tip sits at (30,−10), in front of the near foot, passing in front of the far foot. It is used by P05, P10 (variant), P11 and P15, and by E9, E13 and E22.
- Rig needs for the poses: spine bend (§7 rig rules), volume-preserving squash (head gets 40 % of q), heels-up/tiptoe, a sitting hip, lying on the side (P11), and hands reaching the mouth (P19).
- Deliver `r4-poses-{color,silhouette}.png` (P01–P20, 5 × 4 grid). Also deliver `r4-poses-silhouette-unlabelled.png`, a shuffled order with no labels: I will name each pose from the black shapes only.

## Verdict
`APPROVED`. Round 3 is closed. C1 is closed. **C2** (lid fill matching) is due in the round 4 build and becomes a blocker there if it is not fixed. **C3** and the small polish are also due in round 4. Proceed to round 4.
