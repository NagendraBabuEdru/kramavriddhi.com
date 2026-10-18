# Round 3 review: expressions, mouth chart, face kit

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.5 §5–§6 (now amended to **v1.6**).

## Files opened
- `frames/round3/r3-mouths-color.png`: full size; M3, M4, M9, M11 and M15 zoomed.
- `frames/round3/r3-expressions-heads-color.png`: full size; E12, E16, E17 and E20 zoomed.
- `frames/round3/r3-expressions-heads-360.png`: the phone test.
- `frames/round3/r3-expressions-body-color.png`: full size; E13 and E22 zoomed.
- `frames/round3/r3-front-color.png`: full size.
- `frames/round3/r3-facekit-1-color.png` and `r3-facekit-2-color.png`: full size.
- The B&W versions were not opened (they will be checked in round 3b).

## Overall
This is the biggest round so far, and most of it is excellent:
- **all 16 mouths and 24 expressions exist**;
- the front-view face kit works (E3 front is a real winner, and E10 front is touching);
- tears, streams, sparkles, the wet look, flare, wrinkle and blush all behave;
- the face-kit sheets prove every control is independent.

Two things stop approval:
- **(1)** the carried open-mouth item C1 still shows a beak-like overbite on M3, M4 and M15;
- **(2)** nearly closed eyes are drawn as **empty rings** (E15, E17, and lidUp 0.2 on the face-kit sheet).

## Mouth chart
| ID | Verdict | ID | Verdict |
|---|---|---|---|
| M0 | ✓ | M8 | ✓ (judge the 6 Hz wobble in round 5) |
| M1 | ✓ | M9 wail | ✓: the round jaw is good, no hook |
| M2 | ✓ (small notch, see B1) | M10 yawn | ✓ |
| M3 grin | ✗ B1 | M11 yuck | ✓, reads clearly |
| M4 laugh | ✗ B1 | M12 pucker | ✓ |
| M5 | ✓ | M13 smirk | ✓ |
| M6 | ✓ | M14 chatter | ✓ |
| M7 | ✓ | M15 cute roar | ✗ B1 (otherwise cute, not scary ✓) |

## Expressions (judged at full size and on the 360 px file)
- **Read correctly**: E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11, E12, E14, E16, E18, E19, E20, E21, E23, E24.
- **Weak**:
  - E13 scared reads more "worried" (see P2).
  - E15 sleepy and E17 sneeze fail because of B2.
  - E22 cold reads as "sleepy or unwell" without its body cue (P3).
- **Distinctness pairs (Bible §5.1)**:
  - E1/E2 ✓;
  - E5/E6/E14 ✓ (pupil size and sparkle clearly differ);
  - E10/E11/E12 ✓ (a clear progression);
  - E13/E14: the faces are too close. The difference must come from E13's crouch + tremble and its wobbly mouth (P2).
- **The 360 px phone test**: a 6 × 4 grid at 360 px is about 55 px per head, which is smaller than any real phone shot. Even so, open vs closed eyes, open vs closed mouths, tears and blush all still separate. **PASS.** From now on, export single heads at 120 px instead (the real size in a phone Short).
- **Head volume**: kept in M4, M9, M10 and M15 ✓.
- **Tears and blush on the surface**: ✓ (tilt test pending for round 4).
- **Brows never angry**: ✓ (E18 is determined, not angry).

## Deviations
- **Wrinkle at (63,−13), (67,−7), (60,−19)**: APPROVED.
- **Tail lift −1.5/−1.6 instead of a wrap (E13, E22)**: accepted for this round only. The real wrap is a **round 4 blocker** (P10 sit and P15 hug-self need it). Spec: the tail's segments 3–5 curl forward under the body, so the tip sits in front of the near foot at (30,−10), passing **in front of** the far foot.
- **Hands to the mouth or chin not visible in the head crop**: accepted; they are checked on the round 4 pose sheet (P19).
- **E22 chatter static at open 0.1**: accepted; animated in round 5.
- **Front mouth offsets scaled 0.6, D-shape with teeth at ±7**: APPROVED; it looks great.
- **The far brow fade only at yaw > 45**: APPROVED.

## Scores
| Category | Score | Note |
|---|---|---|
| Identity & appeal | **4** | |
| Proportions & on-model | **4** | |
| Expressions | **4** | Except B1 and B2. |
| Poses & silhouette | **3** | Body cues are approximations (tail wrap, arms to the chest). |
| Style consistency | **4** | |

## Blockers (2)
| # | What's wrong | Where | Why it matters | Exact change |
|---|---|---|---|---|
| B1 (= C1) | **The open-mouth overbite still reads as a beak.** The upper lip turns into the mouth with a concave notch under the snout tip, and the jaw front sits about 8–10 units behind the tip, so M3, M4 and M15 show a hooked upper snout over a chin. (M9's jaw front is aligned and reads soft, which proves the fix.) | `r3-mouths-color` M3, M4 and M15; E2, E3 and E24 heads | Croc/beak read; this item has been carried since round 1d | Bible v1.6 §6 amendment: the upper lip (81,12) → (80,22) → F, with F ≤ (76, ≥ 26), turns into the mouth on a radius ≥ 5 with no concave notch. The pre-transform jaw front is F2 (78,30) → (82,37) → (78,45) → (64,50) → (40,51) → (18,52); its foremost point is at x ≥ 76 after the transform, so the overbite is ≤ 5. **Test**: at s = 1.75 the muzzle reads as one rounded shape split by the mouth. |
| B2 | **Nearly closed eyes are drawn as empty rings.** At lidUp 0.2 the lid fill covers the white, but the full eye outline is still stroked, giving hollow "goggles" (E15 sleepy, E17 sneeze wind-up, the lidUp 0.2 cell on facekit-1). | E15 and E17 heads; facekit-1, row 2, cell 1 | Sleepy and sneeze are key story beats; the rings read as glasses or blank eyes | Bible v1.6 upper-lid outline rule: above the lid edge, draw the outline only as an eyelid line (1.6, dark 0.45), and only while lidUp ≥ 0.5. Below 0.5, nothing above the lid edge; the 2.6 lid edge is the only line. |

## Polish
- **P1. Wide eyes in the front view** (E13 front): at lidUp 1.1 the eyes touch the head outline. Keep them ≥ 6 units inside it; shrink rx if needed (v1.6).
- **P2. E13 scared**:
  - pupils 0.36 → **0.32**;
  - brows lift 0.6 → **0.8** with tilt +1;
  - mouth M8 open 0.12, so the teeth gap shows a little;
  - add sweat 1 (currently invisible: see P5).
  
  The arms-to-chest hands currently cross at the throat like a **bow tie**. Instead, put the hands side by side under the chin with a 4-unit gap, touching the belly patch top.
- **P3. E22 cold**:
  - make the snout-tip blush stronger (alpha 0.8);
  - add the breath puff to the static sheet (a white ellipse 16 × 10 at the mouth, alpha 0.7);
  - add 3 short shiver ticks (length 6) on each side of the body outline.
  
  The arms show the same bow-tie problem as E13; use P2's hand position.
- **P4. Wail streams (E12)**: the drops scatter like rain across the forehead and over the hat. Tears must only leave from the **outer eye corners**, on two arcs going sideways and down (apex ≤ 12 units above the eye centre), 4–5 drops per arc, never crossing the head interior.
- **P5. Sweat**: the drop at HC(−52,−30) hides under the hat rim and reads as a tiny blue dot. Move it to HC(−56,−8), size 5 × 7, with a white highlight dot and a 1.4 outline.
- **P6. E17 sneeze wind-up**: after B2, also add a head tilt back of −0.12 in the heads sheet, so the wind-up reads even as a still.

## For round 3b, re-render
- `r3b-mouths-{color,bw}.png`
- `r3b-expressions-heads-{color,bw}.png`
- `r3b-expressions-body-color.png`
- `r3b-front-color.png`
- `r3b-facekit-1-color.png`
- `r3b-heads-120.png`: E2, E3, E10, E13, E15, E17 and E22 as single heads, each scaled to 120 px tall, in one row.

## Verdict
`CHANGES NEEDED (2 blockers)`
