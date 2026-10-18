# Round 1 review: Rex v2 core (¾ view)

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1, round 1 acceptance list (§12).
Code read: `sketch/rex2.js` (all of it) and `sketch/design.js`.

## Files opened (full size; faces zoomed 3×)
- `frames/round1/r1-model-34-color.png`: zoomed on the face (crop 800–1130 × 350–660) and the body/tail/feet (580–1060 × 620–910); also checked pixel rows below the ground line.
- `frames/round1/r1-model-34-guides.png`: readout and guide lines.
- `frames/round1/r1-model-34-silhouette.png`
- `frames/round1/r1-model-34-bw.png`
- `frames/round1/r1-mouthtest-color.png`: zoomed on M4, M5 and M7.
- `frames/round1/r1-mouthtest-bw.png`
- `frames/round1/r1-flip-color.png`: both pairs of eyes zoomed side by side.
- `frames/round1/r1-flip-bw.png`: checked in the overview only.

## Overall
A huge step up from round 0. He now reads instantly as a **cute baby T-Rex**: a big round head, low big eyes, a short round snout, a warm lime colour, a clean closed outline, a lovely belly, and tiny arms in negative space. The rig numbers match the Bible exactly. The remaining problems are mostly in the face's small parts, and one is my own spec error (the mouth corner position).

## Scores (1–5; categories not covered by this round are marked n/a)
| Category | Score | Note |
|---|---|---|
| Identity & appeal | **4** | Hug-able; not a gecko any more. |
| Proportions & on-model | **4** | The readout is spot on (head 49.5 %, eyes, snout 81, width 141, hat −247.6). Small landmark crowding (bumps and spots, a spot under the hat rim). |
| Turnaround | n/a | round 2 |
| Expressions | **3** | M0, M1 and M5 read well. The mouth collides with the near eye; the M4 laugh is a V-wedge with "braces" teeth; the M7 face reads grumpy, not sad. |
| Poses & silhouette | **4** | The neutral silhouette reads: big head, snout, arm in negative space, tail. There's a notch at the tail tip. |
| Motion | n/a | round 5 |
| Nature interaction | n/a | (contact shadow: see B1) |
| Atmosphere | n/a | round 7 |
| Style consistency | **4** | Clean pencil line, colour and B&W both work, highlights correct on flip. The face light zone has a visible hard edge. |

## Acceptance checklist (Bible §12, round 1)
1. Readout matches §2.1 within ±2 and head % = 49.5 ± 1: **PASS**.
2. Eye centres, sizes and snout tip: **PASS**.
3. No mouth pixel outside the silhouette in M4: **PASS** (the jaw extends the outline; the skull is intact).
4. Soles on y = 0: PASS. Contact shadow present: **FAIL**. The rows under the feet (y 904–916, x 600–1200) are pure paper (L ≈ 240), so the shadow doesn't render.
5. Outline closed: **PASS**, except for the tail-tip notch (B5).
6. No hatching in the face zone or belly: **PASS**.
7. Flipped highlights stay upper-left: **PASS** (zoomed both).
8. B&W separation: **PASS** (belly, body, spots, face and hat all separate).
9. Silhouette reads as a baby T-Rex: **PASS**.

## Deviations the animator asked about
1. **Jaw rotate 0.7 × open × 0.38 + drop open × 12**: **APPROVED, with a change**. Use a 10-unit drop and the new hinge HC(14,26). The near corner must stay attached. Bible v1.1 §5 is updated.
2. **Only M0–M7 so far**: OK for round 1. All 16 are needed by round 3.
3. **Lower lid not drawn below lidLo 0.15**: **APPROVED**. E1 now uses lidLo 0 (Bible updated).
4. **Tail spots offset toward the top edge**: **APPROVED** (it reads better).

## Blockers (6)
| # | What's wrong | Where | Why it matters | Exact change |
|---|---|---|---|---|
| B1 | The contact shadow doesn't appear in the render | `rex2.js` line 226; under the feet in `r1-model-34-color.png` | Weight, grounding (Skill 4) | Debug: it is filled with `ctx.scale(s,s)` after `translate`; check that the paper or ground pass isn't drawn over it, and that `fill()`'s `globalAlpha *= alpha` isn't starting from 0. **Target: at y +6 under the soles, the paper must darken by 18–25 L* levels.** Draw it after the ground line and before Rex. |
| B2 | The mouth line starts **on the near eye's rim** (a visual knot); M0, M1 and M7 all touch the eye | face, all mouth frames; my spec error in v1 (A at (14,20) is on the eye edge) | A tangent between the two most important face features | Use the v1.1 anchors: A (22,24), B (44,34), F (70,26); M1: A(22,22) with a tick to (18,17), B(44,36), F(70,24); the other shapes per §6 v1.1. Rule: every mouth point is ≥ 6 units from both eye outlines. |
| B3 | M4 laugh: a V-wedge with sharp corners (crocodile echo), and the teeth are tiny grey rings that read like braces | `r1-mouthtest-color.png`, the 3rd Rex | Appeal; never a croc | A rounded "D": limit the upper-lip dip to 4 units when open > 0.5, give the corners a radius ≥ 4, end the far corner at x ≤ 66, and make the lower edge one deep round curve. Teeth 6 × 6 in `#fbf6e8` with a 1.2 outline, hanging from the upper lip at x 36 and 50, or leave them out if they don't read at 360 px wide. |
| B4 | M7 / sad face reads **grumpy**: the upper-lid edges are straight horizontal bars across the eyes, the brows barely tilt, and the frown line is wobbly | `r1-mouthtest-color.png`, the 5th Rex | Sad vs grumpy is a story-critical distinction for kids | The lid edge must be an arc (sag 0.25 × rx) that tilts with the brow (browTilt × 0.30 rad, inner end up). Brow tilt range 12 units (was 8). M7 must be a clean arc (wobble is only for M8). Expected result: "/ \" brows and drooping outer lid corners. |
| B5 | The tail tip has a notch or fork (a little spur pointing up-left) | the tail tip in every frame and in the silhouette | The silhouette reads like a fish tail; there's a sharp point | End the tail outline with a true semicircular cap (radius 7) centred on the last centreline point; there must be no concave turn in the last 12 units. |
| B6 | The far-eye pupil is clipped by the eye's front edge (it looks cut off) | far eye, all frames (zoomed in `r1-flip`) | The "mask" read; the eye looks damaged | Foreshorten the far pupil and its highlights like the eye: rx = 0.70 × the pupil radius, the same ry. It must never be clipped when look ≤ 0.5. |

## Polish (do these in the same pass if you can)
- **P1. Face light zone**: the oval has a visible hard edge (in colour and B&W). Feather it: use a radial gradient, solid to 55 % and fading to 0 at the ellipse edge.
- **P2. Back bumps**: they read as a cluster of dark grapes merged with the spots. Use the `rexShade` colour, ry = 0.75 × r, a ≥ 2 unit gap between bumps, and skip any bump within 4 units of the head outline (the top one peeks beside the chin). Move S1–S3 inward to (-22,-110), (-26,-90), (-30,-66).
- **P3. Blush** reads **tan or muddy**, not pink. Use `#f7a1a6` at alpha 0.7 × blush, feathered, at the new positions near HC(-22,30) 12 × 7 and far HC(60,12) 7 × 5. It must not touch the mouth (in M4 the far blush sits on the mouth corner).
- **P4. Arms**: the near arm is about 5 units thick (stick-like); the spec is 10 → 8 → 7. The far arm is invisible; its hand should peek about 6 units behind the near arm.
- **P5. Feet**: the two feet touch at a single point (a tangent). Use a far foot from x −50 to −2, so the near foot overlaps it by 4.
- **P6. Head spot C** is half-hidden under the hat rim. Move C to HC(-46,-28), P1 to (-53,-8) and P2 to (-48,14).

## Bible
I updated `REX_BIBLE.md` to **v1.1** with all the numbers above; there's a changelog at the end. Please build from v1.1.

## For round 1b, re-render the same three sheets
Plus `r1b-face-zoom-{color,bw}.png`: the head only at s = 4, with E1, E2 (M2), E3 (M4), E10 (M7 sad) and E5 (M5) in a row. I'll judge the face at that size.

## Verdict
`CHANGES NEEDED (6 blockers)`
