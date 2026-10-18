# Round 1b review: Rex v2 core fixes (¾ view)

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.1 (now amended to **v1.2**).

## Files opened (full size; faces zoomed 2×)
- `frames/round1b/r1b-face-zoom-color.png`: each of E1, E2, E3 and E10 cropped and zoomed 2×.
- `frames/round1b/r1b-model-34-color.png`: body, tail and feet zoomed 2×; pixel check under the soles.
- `frames/round1b/r1b-mouthtest-color.png`: the full row at 100 %.
- In the overview only: `r1b-face-zoom-bw.png`, `r1b-model-34-{bw,guides,silhouette}.png`, `r1b-mouthtest-bw.png`, `r1b-flip-{color,bw}.png`.

## Round 1 blockers: status
| # | Status | Note |
|---|---|---|
| B1 contact shadow | **FIXED** | The paper darkens from 244 to 194–200 grey under the feet (≈ 18 L*). Good root-cause find. |
| B2 mouth vs eye | **Partly** | Better, but in E1 the M1 tick ends about 2 units from the near eye's rim, and in E2 the corner lifted by `corners` + `cheek` nearly touches the far eye's lower-left rim (about 1.5 units). See new B2. |
| B3 laugh | **FIXED (shape)** | E3 is a lovely rounded "D", the teeth now read as two baby teeth, the tongue is good, and the closed happy eyes and pink blush all read instantly. The outline problem is in new B1. |
| B4 sad | **FIXED** | E10 reads sad at once: tilted arc lids, "/ \" brows, wet lower lids, a clean frown. |
| B5 tail tip | **FIXED** | Closed cap, no notch (see polish P4). |
| B6 far pupil | **FIXED** | Foreshortened and never clipped (checked in E1, E2, E5 and E10). |

Polish P1–P6 are all done (soft face zone, shade-coloured bumps, pink blush, thicker arms, overlapping feet, spots clear of the hat).

## Deviations
- (a) Blush alpha = 0.5 + 0.5 × blush: **APPROVED**, provided that blush = 0 draws nothing (true in E1).
- (b) The face zoom at s = 3.6: **APPROVED**.
- (c) cheek adds 0.3 to lidLo and to corners: **APPROVED**, but subject to the new cap in B3 and the near-corner lock in B2.

## Scores
| Category | Score | Note |
|---|---|---|
| Identity & appeal | **4** | |
| Proportions & on-model | **4** | |
| Expressions | **3** | E1, E3, E5 and E10 are good; E2 fails (B2, B3) and the open-mouth outline is broken (B1). |
| Poses & silhouette | **4** | |
| Style consistency | **4** | |

## Blockers (3)
| # | What's wrong | Where | Why it matters | Exact change |
|---|---|---|---|---|
| B1 | **The open-mouth silhouette is broken.** (1) In M2 and M4 the head outline stops at the snout front, above the far mouth corner, so the right side of the upper jaw has **no outline** (about 12 units in E3, about 6 in E2). (2) A leftover piece of the old chin outline hangs across the neck and ends in mid-air (E2 and E3, about 25 units under the near cheek). (3) In M2 the lower lip meets the jaw front in a sharp **hook** (E2, at the far corner). | `r1b-face-zoom-color.png` E2 and E3; the 3rd Rex in `r1b-mouthtest` | A closed silhouette is a core rule; the hook and the dangling line are visual knots | Build the open-head outline as **one path**: snout tip → upper lip → far corner (rounded, r ≥ 4) → jaw front → chin → back to the neck. Remove the old chin segment instead of clipping it. Cap the chin's extra drop so the chin moves ≤ 14 units in total (the M4 lower jaw is a little heavy). Bible v1.2 §6 "open-mouth outline rule". |
| B2 | **The mouth corner still crowds the eyes.** E1: the M1 tick ends about 2 units from the near eye. E2: the corner, lifted by corners + cheek, nearly touches the far eye's rim. | E1 and E2 zooms | It's the same knot as round 1 | **Lock A at y ≥ 22.** "corners" now raises F by up to 7 and deepens B by up to 4, rather than lifting A. The M1 tick ends at (21,19). Check: the stroke edges stay ≥ 6 units from both eye outlines in E1–E5 at full expression values. |
| B3 | **The happy lower lids look like eye bags or goggles.** In E2 the lower lid covers about 40 % of each eye (1.3 × (0.3 + 0.15) × ry), as a pale crescent with a heavy edge. The pupils sink into it, and the far eye reads as "a green ball in the eye". | E2 zoom | Happy must read happy at a glance, not tired | Coverage = **1.0** × lidLo × ry, with the effective lidLo (cheek included) **capped at 0.45** (about 22 % of the eye height). The lid fill matches the skin exactly (no lighter crescent). The edge line is 2.0 (lighter than the 2.6 eye outline). When lidLo > 0.2, lift the pupils by 0.15 × ry. |

## Polish
- **P1.** Brows clipped by the head outline (E5): the far brow now merges into the outline. Instead of clipping, **limit the lift** so the brow's highest point stays ≥ 6 units inside the outline (compute it per brow).
- **P2.** E10: the near upper-lid edge pokes about 2 units outside the eye's left rim. Clip the lid edge to the eye.
- **P3.** M7: the frown's far end touches the jaw outline. End it at (66,28). The sad lid tilt goes from 0.30 to **0.40** rad: at s = 1.6 (mouth test, 5th Rex) the lids still read a little "unimpressed".
- **P4.** Tail tip: the cap is closed, but the last segment ends blunt and square, a little like a paddle. Taper the thickness from 15 to 11 over the last 10 units before the r 6 cap.
- **P5.** The far hand peeks out **above** the near arm and reads like a third hand from the chest. Put it just below or behind the near forearm, overlapping it by 4 and showing only 2 claw nubs.

## Re-render for round 1c
- `r1c-face-zoom-{color,bw}.png`, with two more heads: E4 giggle (M2 + cheek 0.8) and E19 proud (M1, corners +0.9). These stress-test B2 and B3.
- `r1c-mouthtest-{color,bw}.png`.
- `r1c-model-34-color.png`.

If B1–B3 pass and nothing new breaks, round 1 is approved and we move to the turnaround (round 2).

## Verdict
`CHANGES NEEDED (3 blockers)`
