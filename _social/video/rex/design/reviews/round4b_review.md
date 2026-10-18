# Round 4b review: poses + silhouettes (second pass)

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.7.

## Files opened
- `frames/round4b/r4b-poses-silhouette-unlabelled.png`: full size, in two halves at 100 %. **Named blind, before the key**.
- `frames/round4b/r4b-poses-guides.png`: full size, with the handClear values.
- `frames/round4b/r4b-c3-front-color.png`: full size; E13's right eye zoomed 3×.
- `frames/round4b/r4b-c2-heads-color.png`: full size; E15, E17 and E22 zoomed.
- Not opened: `r4b-poses-color.png` and `r4b-poses-silhouette.png` (the guides sheet shows the same colour render).

## 1. Blind silhouette names (written before the key)
| Letter | My name | Confidence |
|---|---|---|
| A | P07 hop wind-up (low, head forward-down, tail low) | medium |
| B | P05 scared crouch (tail wrapped, hands at the chest, no shiver ticks) | high |
| C | P08 hop air (feet off the ground, shadow below) | high |
| D | P12 peek | high |
| E | P16 look up / wonder (head back, lean back) | medium |
| F | P01 neutral stand | high |
| G | P10 sit (foot forward at the bottom) | medium |
| H | P14 balance (wide stance, arm out level) | high |
| I | P19 hand to mouth (hunched, tail curled to the feet, hand at the chin) | medium |
| J | P18 wave (front view, one arm up) | high |
| K | P13 reach up (front view, both arms up) | high |
| L | P03 excited (upright, tail up, heels up) | high |
| M | P20 cute roar (upright, hands up at the jaw) | medium |
| N | P06 proud (lean back, chin up, tail up) | high |
| O | P11 sleep curl | high |
| P | P02 curious lean (head forward, tail lifted) | medium |
| Q | P17 shake-dry key (tail whipped diagonally, arm flung) | low (partly by elimination) |
| R | P04 sad slump (head down, arms hidden, tail low) | medium |
| S | P15 hug-self (cold) (shiver ticks, breath puff) | high |
| T | P09 land (squashed wide and low, arm forward) | medium |

**Please send the key.** I will score the test against it: it passes if at least 18 of 20 are right. Any I get wrong become pose fixes in round 4c.

From the shapes alone, my weakest reads are **Q, R and I**. They share an "upright, arms hidden, head slightly down" shape. If the key confirms any of them as wrong, these are the fixes:
- **P17 shake-dry**: a body twist of 0.12 against a head twist of 0.35, plus 6 droplet dots flying off the silhouette edges.
- **P04 sad slump**: head down 0.3 and spine bend +0.10, so the head drops in front of the chest line.
- **P19 hand to mouth**: the hand must poke **in front of** the snout outline, by ≥ 4 units.

## 2. Blockers from round 4: status
| # | Status | Note |
|---|---|---|
| B1 arms v1.7 | **FIXED** | The rest arms show clear negative space (P01: handClear 16.6). The front-view P13 and P18 read immediately. P20's hands are up at the jaw. See polish P1 for small values. |
| B2 lines of action | **Pending the key** | The upright group visibly separated: the lean-back (N), forward (P), wind-up (A) and balance (H) poses now each have their own shape. |
| B3 P11 curl | **FIXED** | It reads as a sleeping curl, not a fall: the mound, the head resting on the tail, the hat still on. Lovely. |
| B4 (C2) lid ring | **FIXED** | E15 and E17 are clean at 3× zoom. **C2 is closed.** (The thin line above the half-lids in E22 is the intended eyelid line, at 1.6 and dark 0.45.) |
| B5 (C3) front eye gap | **FIXED** | The zoom shows a clear skin band between the eye and the head outline. eyeGap prints 9 / 9 / 9 / 9 / 13. **C3 is closed.** |

## 3. handClear check
- P03 excited (near about 3) and P08 hop air (near 3.7 / far −3.8) are below the ≥ 6 rule; P03's spec asks for ≥ 10. Fix: raise the upper arm to the −0.70 limit and add +0.25 rad of forearm extension. A hand may only overlap the head in a pose listed as a contact.
- The deliberate overlaps (P04, P06, P07, P15) are accepted. Please label them "contact/behind" on the guides sheet rather than printing negative numbers.
- P20's handClear text is cut off by the cell. Please print it.

## 4. Polish (due in round 4c, or with round 5 at the latest)
- **P1.** P03 and P08 handClear must be ≥ 6 (≥ 10 for P03), as above.
- **P2.** P10 sole crease and nubs (still outstanding from round 4).
- **P3.** P14 uses heels 8 on both feet. Add a per-foot `heels: [near, far]` control, and give P14 near 0 / far 8. Round 5's walk cycle needs per-foot control anyway.

## Scores (provisional until the key arrives)
| Category | Score |
|---|---|
| Identity & appeal | **4** |
| Proportions & on-model | **4** |
| Expressions | **4** |
| Poses & silhouette | **4** (provisional) |
| Style consistency | **4** |

## 5. Key result (received after the blind names)
Key: A P07, B P19, C P03, D P12, E P16, F P01, G P10, H P14, I P05, J P18, K P13, L P08, M P20, N P04, O P11, P P02, Q P17, R P06, S P15, T P09.

**Score: 14 of 20** (target ≥ 18). The 6 misses are three **swapped pairs**. Each pair shares one silhouette idea, so each needs one clear shape difference:

| Pair | Why they swapped | The silhouette difference (Bible v1.8 §7) |
|---|---|---|
| **B/I: P19 hand to mouth vs P05 scared crouch** | Both are hunched with the tail wrapped round the feet and a hand at the chest | **P05** is the *only* one that crouches and wraps: squash 0.15, lean back −0.15, head pulled in 8, both hands up in front of the chest and held off the body (≥ 6), tail wrapped. **P19** is upright, with no crouch and **no tail wrap**: the tail is relaxed behind with the tip curled up +0.2, the head is down 0.2 and turned 10° to the camera, and the near hand pokes ≥ 4 units **in front of the snout outline**. |
| **C/L: P03 excited vs P08 hop air** | Both are upright with the arms up, and P03's heels-up lifted him so he looked airborne | **P03 is grounded**: soles on y 0, heels 0, tight shadow, arms in a wide V (handClear ≥ 10), tail up 0.6 with the tip curled. **P08 is clearly in the air**: a ≥ 30-unit gap under the soles, legs tucked together, stretch 0.10, tail trailing **down** −0.3, with a light wide shadow far below. **The ground gap alone separates them.** |
| **N/R: P04 sad slump vs P06 proud** | P04's tail tip curled up and its head drop was too small; P06's lean back was too weak, so it read as neutral | **P04** droops forward: head down 0.35, bend +0.12 (the head drops in front of the chest line), shoulders down, and the tail **low and straight with no upturned tip**. **P06** leans back: lean −0.14, chin up −0.25, belly +8, arms behind, the tail **up-back +0.35 and straight**. The lines of action are opposite: a forward C-curve vs a backward arc. |

Acceptance for round 4c:
- a **new re-shuffled** unlabelled sheet, with the key sent after my answers;
- ≥ 18 of 20 correct, **including all six of these poses**.

## Verdict
`CHANGES NEEDED (3 blockers)`: the three pairs above. Everything else from round 4 is fixed: arms, P11 curl, C2 and C3 are all closed. Polish P1–P3 also go into round 4c.

For round 4c, re-render:
- `r4c-poses-{color,guides}.png`
- `r4c-poses-silhouette-unlabelled.png` (re-shuffled)
