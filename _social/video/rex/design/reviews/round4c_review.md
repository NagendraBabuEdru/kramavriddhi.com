# Round 4c review: poses + silhouettes (third pass)

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.8.

## Files opened
- `frames/round4c/r4c-poses-silhouette-unlabelled.png`: full size, in two halves at 100 %. **Named blind, before the key.**
- `frames/round4c/r4c-poses-guides.png`: full size.
- Not opened: `r4c-poses-color.png` (the guides sheet shows the same render).

## 1. Blind names (written before the key)
| Letter | My name | Confidence |
|---|---|---|
| A | P03 excited (upright, tail high with the tip curled, arm forward) | medium |
| B | P04 sad slump (head forward and down, tail long and straight to the ground) | medium |
| C | P12 peek | high |
| D | P08 hop air (clear gap under the feet) | high |
| E | P01 neutral stand | high |
| F | P14 balance (feet apart, arm level, one heel up) | high |
| G | P19 hand to mouth (hand under the snout) | high |
| H | P10 sit | high |
| I | P06 proud (lean back, chin up, tail straight back) | medium |
| J | P15 hug-self (cold) | high |
| K | P20 cute roar (hands at an open mouth, tail up) | medium |
| L | P11 sleep curl | high |
| M | P16 look up / wonder | medium |
| N | P17 shake-dry key (tail whipped up and curled) | low |
| O | P09 land (squashed, arm forward and down) | medium |
| P | P05 scared crouch (crouched, tail wrapped, hands at the chest) | high |
| Q | P13 reach up | high |
| R | P07 hop wind-up (very low, head down, tail flat back) | medium |
| S | P02 curious lean (forward, tail lifted) | medium |
| T | P18 wave | high |

**Please send the key.** Before it arrives I can already say that the three round 4b pairs now separate clearly by shape:
- D (airborne) vs A (grounded);
- P (crouch + wrap) vs G (upright, hand under the snout);
- B (forward droop) vs I (back-lean).

My lower-confidence group is **A/S** (excited vs curious), **O/R** (land vs wind-up) and **N/K/M**.

## 2. The tail-inversion bug
Good catch: it explains the round 4b P04 and P06 confusion. Because every tail value used before this fix was inverted, the **round 3 body expressions (E10, E13 and E22) were approved on the wrong tail**. In the round 5 build, re-render `r5-expressions-body-color.png` (E2, E3, E10, E12, E13, E22) so I can re-check them. This is not a blocker now.

## 3. The animator's questions
- **P03 arms at [−0.35, −0.1] instead of −0.70 + 0.25: APPROVED.**
  - The big head overhangs the shoulder, so the forward-level V reads better and keeps the hands clear (near about 16).
  - I'm updating the rule for the ¾ view: the **upper arm range is −0.70…+1.2 rad, but the rig must reject any pose whose hand ends inside the head** (handClear < 6), whatever the angle.
- **P05 hands at −5.6 (overlapping the chest): ACCEPTED as a contact.**
  - "Clutching the chest" reads well in silhouette P and is natural for scared.
  - Label it `contact` on the guides sheet. The v1.8 "≥ 6 off the body" wording for P05 is waived.
- **P19 hand cannot reach in front of the snout tip: ACCEPTED.**
  - The hand poking out under the chin and snout reads clearly (G).
  - The rule becomes: the hand **breaks the head/chin silhouette by ≥ 4 units** (it is visible outside the outline), not "in front of the snout tip".

## 4. Polish
- **P1.** Guides sheet layout: P08's raised body overlaps the P03 label ("P03 …ited", handClear cut off). Give the airborne row more top margin, or draw labels last with a paper-coloured backing.
- **P2.** P04's far hand is hidden; that's fine. On the guides sheet, print `contact/behind` instead of negative numbers for P04, P06, P07, P15 and P05 (as asked in round 4b).
- **P3.** Per-foot heels and the P10 sole (nubs and crease) are done ✓.

## Scores (provisional until the key)
| Category | Score |
|---|---|
| Identity & appeal | **4** |
| Proportions & on-model | **4** |
| Expressions | **4** (E10, E13 and E22 to be re-checked in round 5) |
| Poses & silhouette | **4** (provisional) |
| Style consistency | **4** |

## 5. Key result (received after the blind names)
Key: A P17, B P04, C P12, D P08, E P01, F P14, G P19, H P10, I P06, J P15, K P03, L P11, M P16, N P20, O P09, P P05, Q P13, R P07, S P02, T P18.

**Score: 17 of 20.** The misses form one cycle: P17 → read as P03, P03 → read as P20, P20 → read as P17. The cause is that all three are "upright ¾, tail up and curled, a hand forward near the snout". Each now gets **one unmistakable feature that no other pose has**, and their three tail shapes are made mutually exclusive.

| Pose | Unmistakable feature | Exact spec (round 4d) |
|---|---|---|
| **P03 excited** | **A tail standing straight up behind him, like a wagging puppy** | Tail lift so the centreline rises steeply: tip at about (−70,−170), **above the S (chin) line**. This is the only pose allowed to do that (a stated exception to §2.7). No tip curl. Two short wag arcs (length 10, line 1.6) beside the tip. Feet grounded, near heel up 6 (bouncing). Arms in the approved forward V. M4 open 0.6. Spine bend −0.04 (chest up). |
| **P20 cute roar** | **An open-mouth notch in the head silhouette + a forward step with claws out** | M15 at jaw 0.9, so the dark mouth gap breaks the snout/jaw outline by ≥ 8 units (the only pose with an open notch). Spine bend **+0.10** toward the camera side, the near foot stepped forward 14 (stance +14). Both hands forward-up at handClear ≥ 8, 3 spread nubs each. **Tail straight back and horizontal** (tail.straight, lift 0, tip at about y −45). |
| **P17 shake-dry key** | **A ring of flying droplets + the head turned away** | 10 droplets (r 3–5, 6–24 units outside the outline, along tangents) all around the head and tail. They are part of the silhouette and drawn in the silhouette render too. Head counter-twisted: headYaw **+40° away** (toward ¾ back, so the eyes are mostly hidden; the face is squeezed > <). Body twist 0.12. **Tail whipped low in an S**: mid-tail at y −20, the tip flicked up to y −40, never above the hip. Arms flung out and back. |

Tail exclusivity check (a guides-sheet readout, `tailTipY`): P03 tip ≤ −150; P20 tip −40…−55, horizontal; P17 tip ≥ −45, S-curve. **No other pose may put its tail tip above −120** (P02 and P06 stay below that).

### Round 4d deliverables and acceptance
- `r4d-poses-{color,guides}.png` (with `tailTipY`), and a newly re-shuffled `r4d-poses-silhouette-unlabelled.png`. Send the key after my answers.
- Pass: **≥ 18 of 20**, with **P03, P17 and P20 all correct**, and all six round 4b poses still correct.

## Verdict
`CHANGES NEEDED (1 blocker: the P03/P17/P20 trio)`. Round 4d gets the specs above. Everything else in round 4 is done.
