# Round 4 review: poses + silhouettes (and the arm decision)

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.6 §7 (now amended to **v1.7**).

## Files opened
- `frames/round4/r4-poses-color.png`: full size; P15 zoomed 2×.
- `frames/round4/r4-poses-silhouette-unlabelled.png`: full size. I named the poses **before** reading the key.
- `frames/round4/r4-c2-heads-color.png`: full size; E15, E17 and E22 zoomed.
- `frames/round4/r4-c3-front-color.png`: full size; E13 front zoomed.
- Not opened: `r4-poses-bw.png` and `r4-poses-silhouette.png` (the labelled version; the unlabelled one replaces it for this test).

## Design decision 1: arms → option (b) + staging (Bible v1.7 §2.6)
I'm rejecting (a) and taking (b) together with part of (c):
- **(a) is rejected.** Arms that change length between poses break the on-model rule, and kids notice. The only exception is motion smear frames (≤ 2 f, ≤ 1.25×).
- **(b), new arm spec.**
  - Near shoulder **(42,−98)** and far shoulder **(28,−100)**.
  - Upper arm **18** long (11 → 9 thick), forearm **16** (9 → 8), hand mitten **9 × 8**.
  - Total reach is about 43 (19 % of his height), still clearly a tiny T-Rex arm next to the 141-wide head.
  - At rest the hand ends near (70,−80), with ≥ 6 units of air from the belly.
- **Raised-arm rule.**
  - In the ¾ and side views, arms rise **forward-up only**, limited to 40° above the facing direction (−0.70 rad). At that limit the hand lands at about (75,−125), under the jaw and out in the open.
  - Every hand must end ≥ 6 units outside the head and body silhouettes, except for deliberate contacts (P19 hand to mouth, P12 peek, clasped hands). The rig must compute this and print it as `handClear` on the guides sheet.
- **(c) for above-shoulder gestures.** P13 reach up and P18 wave are now staged in the **front view** (yaw 0), where the hands clear the head beside it. Alternatively, use ¾ with headYaw ≥ 20° toward the camera plus head back. P20 cute roar stays in ¾ with both arms at the −0.70 forward-up limit.

## Design decision 2: P11 sleep curl → a dedicated shape (Bible v1.7 §7, P11)
Yes, the same kind of special case as the turnaround. Rotating the stand reads as "fallen over" (and in the silhouette, as a broken-off head). The spec:
- **Body**: a mound ellipse at (0,−42), rx 64, ry 42, flat on the ground.
- **Legs**: the near thigh tucked; the foot sole toward the camera at (36,−8).
- **Tail**: wraps round the front along the ground, with a little curled tip at (70,−20).
- **Head**: resting **on the tail**, HC (70,−60), rotated +0.25, with ∪ eyes, a soft smile and blush.
- **Hat**: tilted −0.55 but still on.
- **Breathing**: ±1.5 swell.

The full numbers are in the Bible.

## Silhouette test (unlabelled sheet, named blind, then checked against the key)
| Named correctly | Not nameable or confused |
|---|---|
| B scared crouch, D sit, F look up, G hop air, H peek, M shake-dry, Q sad slump, R hug-self (cold), S land | A, C, E, I, J, K, L, O, P, T: ten near-identical upright stands with a stub arm. I'd confuse P01 neutral, P02 curious, P03 excited, P06 proud, P07 hop wind-up, P13 reach up, P14 balance, P18 wave, P19 hand to mouth and P20 roar. N reads as "fallen", not asleep. |

**9 of 20.** The target is 20 of 20, or at least 18 with the remaining two explainable. The arm decision fixes about six of the ten. The rest need **stronger lines of action and tail shapes** (B2).

## Carried items
- **C2, lid fill: still visible (now a blocker, as agreed).** The fill now matches, but a thin **pale ring** remains around each covered eye (the eye-white's anti-aliased edge leaks past the lid fill). It shows on E15, E17 and E22, including at phone size. Fix: (1) clip the eye-white fill itself to the visible region (between the lid edges), so no white is drawn under the lid at all, **and** (2) grow the lid fill path by 1.5 units outward (stroke it once in the same skin paint, width 3). Test: at 300 % zoom, there is no light ring.
- **C3, front wide eyes: still touching (now a blocker).** On `r4-c3-front-color`, E13 front's right eye still meets the head outline, so the gap is about 0 rather than 6. Fix: compute it rather than eyeballing it. Measure the outermost eye x (centre + rx at lidUp, plus the outline half-width) against the head outline at that y, and **shrink rx until the gap is ≥ 6**. Print `eyeGap L/R` on the front sheet.

## What works
- The rig additions are solid: the spine bend with planted feet, volume-preserving squash, tiptoe, tuck, sit, neckDrop and handFront.
- The **tail wrap** reads well in P05 and P15 (it passes in front of the far foot, with the tip in front of the near foot) ✓.
- P08 hop air (with a lighter, wider shadow), P09 land squash, P12 peek, P15 hug-self (cold) and P17 shake-dry are lovely and read immediately.
- The breath-puff fix and the open-mouth stub fix are both done ✓.

## Scores
| Category | Score | Note |
|---|---|---|
| Identity & appeal | **4** | |
| Proportions & on-model | **4** | |
| Expressions | **4** | |
| Poses & silhouette | **2** | 9 of 20 blind. |
| Style consistency | **4** | |

## Blockers (5)
| # | What's wrong | Exact change |
|---|---|---|
| B1 | Arms can't create negative space | Rebuild the arms to v1.7 §2.6 (shoulder, lengths, raised-arm rule, `handClear`). Re-stage P13 and P18 in the front view and P20 at the −0.70 limit, per v1.7 §7. |
| B2 | Ten upright poses share one silhouette | Push the line of action and the tail: <br>**P01**: keep as the reference. <br>**P02 curious**: bend +0.14, head forward 6, tail up 0.25 with the tip curling up. <br>**P03 excited**: v1.7 values, tail up 0.6, heels 4, arms forward-up out. <br>**P06 proud**: lean back −0.10, chin up −0.2, belly +6, tail up 0.3 and straight. <br>**P07 hop wind-up**: squash 0.18, bend +0.12, head down 0.15, tail down −0.25 (tip ≥ 10 above the ground), arms back −0.4 behind the body. <br>**P14 balance**: stance +16, arms out level, both handClear ≥ 10; bend −0.12 with the tail counter-swing +0.35, on one foot (the far heel up 8). <br>**P19 hand to mouth**: E4, head down 0.2, the hand at the mouth, shoulders up 4, tail curled toward the feet. <br>**Acceptance**: ≥ 18 of 20 named blind on a re-shuffled unlabelled sheet. |
| B3 | P11 reads as fallen over | The dedicated curl shape (v1.7 P11). |
| B4 (C2) | A pale ring around the lid-covered eyes | Clip the eye white to the visible region, and grow the lid paint by 1.5. |
| B5 (C3) | Front wide eyes touch the outline | Compute the gap and shrink rx to ≥ 6; print `eyeGap`. |

## Polish
- P10 sit: the near foot's sole faces the camera as a flat oval and reads like a club. Add the 3 nubs on the toe edge and a soft heel crease line (1.4).
- P04 sad slump: tail droop −0.55 (v1.7), and keep the hands ≥ 6 off the belly.

## For round 4b, re-render
- `r4b-poses-{color,silhouette}.png`
- `r4b-poses-guides.png`, with `handClear` per pose.
- `r4b-poses-silhouette-unlabelled.png`, **re-shuffled** with a new key, sent to me separately after my answers.
- `r4b-c2-heads-color.png`
- `r4b-c3-front-color.png`, with `eyeGap` printed.

## Verdict
`CHANGES NEEDED (5 blockers)`
