# Round 1c review: Rex v2 core (¾ view), third pass

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.2 (now amended to **v1.3**).

## Files opened
- `frames/round1c/r1c-face-zoom-color.png`: full size, with E1, E2 and E3 each zoomed 3×.
- `frames/round1c/r1c-mouthtest-color.png`: full size (the M4 jaw is checked at small size).
- `frames/round1c/r1c-model-34-color.png`: full size.
- `frames/round1c/r1c-model-34-silhouette.png`: full size.
- In the overview only: `r1c-face-zoom-bw.png`, `r1c-mouthtest-bw.png`, `r1c-model-34-bw.png`.

## Round 1b blockers: status
| # | Status | Note |
|---|---|---|
| B1 open-mouth outline continuity | **FIXED** (continuity) / **new shape problem** | It is now one closed path: no gaps, no dangling chin segment, no separate jaw line. But the *shape* of that path makes a beak and a box jaw (new B1). |
| B2 corners vs eyes | **FIXED** | A is locked; E2, E4 and E19 corners stay clear. The E1 tick is only about 4 units from the far eye; see polish. |
| B3 lower lids | **Half** | The coverage and colour are right (no pale bags, the pupils are not buried). But the eye outline is still drawn *below* the lid edge, so the eye looks like a pocket with a frown inside it (E2, E19). See new B2. |

Polish P1–P5 from 1b are all done: the brows stay inside the head, the lid edges are clipped, the sad tilt reads well, the tail cap is nice, and the far hand is tucked away. **E10 sad, E5 surprised and E4 giggle (eyes and blush) are now good.** The model sheet and silhouette are clean.

## The animator's question: E19 proud
I agree: with half upper lids, lower lids and slightly lowered brows it reads **"unimpressed"**, which is my spec error. New E19 (Bible v1.3):
- brows 0.5, −0.1, curve 0.5;
- **closed happy eyes (∩)**;
- M1 with corners +1, side +0.2;
- cheek 0.4, blush 0.3;
- chin up: headTilt −0.12 on the head sheet, −0.15 on the body.

The pride is carried by the chin-up and chest-out body (round 4). It stays distinct from E4 (open M2 mouth + hand at the mouth) and E3 (M4).

## Your F clamp (x ≤ 68, y ≥ 20 for open mouths)
**APPROVED in principle**, but tightened to **x ≤ 66, y ≥ 24** (see B1). It was the right instinct: an F level with the snout tip makes a beak.

## Scores
| Category | Score | Note |
|---|---|---|
| Identity & appeal | **4** | |
| Proportions & on-model | **4** | |
| Expressions | **3** | 5 of 7 read correctly; open mouths look like a beak, and E2's eyes look like pockets. |
| Poses & silhouette | **4** | |
| Style consistency | **4** | |

## Blockers (2)
| # | What's wrong | Where | Why it matters | Exact change |
|---|---|---|---|---|
| B1 | **The open mouth makes a beak and a box jaw.** (1) The snout comes down to (78,22) and then steps back to F, so the upper snout overhangs the mouth with a sharp cusp: a turtle or duck beak (E2, E3, E4; very visible on the M4 Rex at s = 1.6). (2) The jaw front is nearly vertical with a square bottom corner, so the jaw looks like a **box** (E3). (3) Where the dropped jaw meets the static neck there is an S-kink in the chin line (E3, about 30 units under the near cheek). | `r1c-face-zoom-color` E2, E3 and E4; `r1c-mouthtest` M4 | The croc and beak read is the thing we spent round 1 removing; the jaw must look soft and round | Use the v1.3 §6 "open-mouth silhouette shape". The upper path runs (79,0) → (81,12) → (79,20) → (74,25) → F, with F clamped to x ≤ 66, y ≥ 24, always going down (no step back up). The jaw front runs F2 (66,28) → (68,34) → (64,41) → (54,46) → (38,49) → (18,52) with the jaw transform. Fade the jaw transform's weight from 1 at x ≥ 18 to 0 at x ≤ −10, so the chin blends into the neck. No corner sharper than 100° (except the rounded mouth corners), and no straight jaw segment over 10 units. |
| B2 | **The eye outline is drawn under the lower lid.** In E2 and E19 the full eye ellipse is outlined, so the lower-lid edge sits inside a "pocket" and reads like a frown or a tear inside the eye. The lid edge also overshoots the eye outline on the near side by about 2 units. | E2 zoom (both eyes); E19 | Happy eyes must read as smiling half-moons at a glance | Below the lower-lid edge, **do not draw the eye outline**. The lid edge becomes the eye's lower boundary, at the eye-outline weight 2.6, and ends exactly where it meets the outline (no overshoot). Upper lids keep their outline (eyelid volume is fine for sad and sleepy). |

## Polish
- **P1.** The E1 M1 tick ends about 4 units from the far eye. End it at **(20,20)** (Bible v1.3).
- **P2.** E3 has a lot of open mouth plus the jaw; after B1, check that the chin moves no more than 13–14 units (the round jaw will look lighter anyway).

## For round 1d, re-render
- `r1d-face-zoom-{color,bw}.png`: the same 7 heads, with the new E19.
- `r1d-mouthtest-{color,bw}.png`.

If B1 and B2 pass, I will APPROVE round 1. Then build round 2 (turnaround).

## Verdict
`CHANGES NEEDED (2 blockers)`
