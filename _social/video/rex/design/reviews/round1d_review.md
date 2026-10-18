# Round 1d review: Rex v2 core (¾ view), fourth pass

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.3 (now amended to **v1.4**).

## Files opened
- `frames/round1d/r1d-face-zoom-color.png`: full size, with E2 and E3 zoomed 3×.
- `frames/round1d/r1d-mouthtest-color.png`: full size, with M4 zoomed 3× (small-size read).
- In the overview only: `r1d-face-zoom-bw.png`, `r1d-mouthtest-bw.png`.

## Round 1c blockers: status
| # | Status | Note |
|---|---|---|
| B2 lower lid / eye outline | **FIXED** | E2's eyes are now clean smiling half-moons and read happy at a glance. |
| B1 open-mouth shape | **Much better, not finished** | The S-kink at the chin is gone and the jaw bottom is round. But the snout still overhangs the mouth with a small inward hook under the tip, and the jaw front is a straight vertical of about 30 units (E3; M4 at s = 1.6). Part of the cause is **my v1.3 numbers**: the jaw front at x 64–68 sits about 13 units behind the snout tip (81), and the jaw rotation pulls it back about 4 more. Corrected in Bible v1.4 (see C1). |

## Polish from 1c
- The tick at (20,20) is fine.
- **E19 proud (new)** reads proud and content: closed happy eyes, a smug smile, blush. It is distinct from E4 (open mouth) and E3 (M4). **Approved.**

## All 7 heads
E1 ✓ · E2 ✓ · E3 ✓ (reads as a big laugh; shape polish C1) · E10 ✓ · E5 ✓ · E4 ✓ (C1 applies) · E19 ✓.
All read correctly in colour and in B&W at phone size.

## Scores
| Category | Score |
|---|---|
| Identity & appeal | **4** |
| Proportions & on-model | **4** |
| Expressions | **4** |
| Poses & silhouette | **4** |
| Style consistency | **4** |

## Decision
The round 1 scope is met: the core rig, the ¾ master view, the face kit, the line, colour and value rules, the contact shadow, the flip, and the closed-mouth and lid expressions. All 9 round 1 acceptance checks pass. The one remaining item only affects open mouths, and **all 16 mouths are reviewed in full in round 3**. So it does not hold up the turnaround: I am approving round 1 and **carrying it forward as a mandatory item**.

### Carried item C1 (must be fixed by round 3; I will re-check it then)
| What | Exact change (Bible v1.4 §6) |
|---|---|
| Overbite hook under the snout and a straight vertical jaw front | Judge the shape at open = 1, after the jaw transform. **(a)** The jaw front's foremost point is at x ≥ 72, so the overhang is ≤ 9 (≤ 5 at open ≤ 0.4). Pre-transform jaw front: F2 (72,29) → (78,35) → (75,43) → (62,49) → (40,51) → (18,52). Lerp each point from the closed outline by `open` (no pop at small openings). **(b)** Upper lip: (81,12) → (80,20) → (77,25) → F, with F ≤ (70, ≥ 25). The path only goes down and back, turning on a radius ≥ 6; no hook. **(c)** The jaw front is convex (a ≥ 4 bulge, no straight segment over 10). |

### Polish
- **P1.** A faint pale ghost line traces the lower half of each eye ellipse under the lower lid (E2, about 1 px, light). The eye-white fill or its anti-aliased edge is leaking below the lid. Clip the white fill to the region above the lid edge too, or draw the lower lid's skin fill 1 unit larger.

## Round 2 notes (beyond §4 and §12)
These are added to the Bible as **§12.2a**. In short:
- **API**: `pose.yaw` (0, 45, 90, 135, 180), with the §4 table as interpolated `VIEWS` keys; ¾ stays the master.
- **Draw order per view**: in the back views, draw the tail after the body (nearest the camera) and the arms behind it.
- **Light**: stays upper-left in screen space for every view, and so do the highlights.
- **Turnaround pose**: E1 + M1, arms at rest, tail neutral, look [0,0] in front and [0.4,0] in side.
- **Per-view checks**:
  - Front: eyes ≥ 8 inside the outline; symmetric M1; the snout is a soft muzzle.
  - Side: the snout is ≤ 40 % of the head length.
  - Back views: no face pieces; identity from the hat, spots, bumps and tail.
- **Layout**: s = 1.4, columns at x = 192 + i·384, ground y 900, body centres on the column centres.
- **Deliverables**: colour, B&W, silhouette and guides (with a per-view volume readout), plus the 9-step head-turn strip (yaw 0→90).

## Verdict
`APPROVED`. Round 1 is closed, with carried item **C1** due in round 3. Proceed to round 2 (turnaround).
