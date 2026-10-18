# Round 4d review: poses + silhouettes (fourth pass)

Reviewer: design expert. Date: 2026-10-18. Against REX_BIBLE v1.8 + v1.8a (round 4c §5).

## Files opened
- `frames/round4d/r4d-poses-silhouette-unlabelled.png`: full size, in two halves at 100 %. **Named blind, before the key.**
- Not opened: `r4d-poses-color.png` and `r4d-poses-guides.png`.

## 1. Blind names (written before the key)
| Letter | My name | Confidence |
|---|---|---|
| A | P10 sit (foot forward at the base) | high |
| B | **P17 shake-dry** (droplet ring) | high |
| C | P16 look up / wonder (lean back, chin up, arm forward) | medium |
| D | **P20 cute roar** (open-mouth notch, wide stance, tail straight back) | high |
| E | P06 proud (lean back, tail straight back, arms hidden) | medium |
| F | P13 reach up (front, both arms up) | high |
| G | **P03 excited** (tail standing straight up, wag arcs) | high |
| H | P15 hug-self (cold) (shiver ticks, breath puff) | high |
| I | P08 hop air (clear ground gap) | high |
| J | P04 sad slump (forward droop, tail low and straight) | high |
| K | P18 wave (front, one arm up) | high |
| L | P12 peek | high |
| M | P09 land (squashed low, arm forward) | medium |
| N | P02 curious lean (tail lifted, arm forward) | medium |
| O | P19 hand to mouth (upright, hand at the chin) | high |
| P | P07 hop wind-up (very low, head down, tail flat) | medium |
| Q | P01 neutral stand | medium |
| R | P11 sleep curl | high |
| S | P05 scared crouch (crouched, tail wrapped) | high |
| T | P14 balance (wide stance, arm level) | high |

**Please send the key.** Even before it arrives, the trio fix clearly worked: P03 (G), P17 (B) and P20 (D) were the **easiest** shapes on the sheet to name. Each one's unique feature (the vertical tail, the droplet ring, the mouth notch with the wide stance) pops out at a glance.

## 2. Notes
- The P08 label overlap is a sheet-layout issue only. It isn't blocking; fix it when convenient.
- My remaining medium-confidence reads are C/E (look up vs proud) and M/P (land vs wind-up). If the key shows a swap there, the fix is small:
  - E/P06 shows its arms behind its back (arms back 0.5, hands visible behind the body edge);
  - C/P16 keeps one arm forward;
  - P07 keeps both arms back;
  - P09 brings both arms forward and down.

## 3. Key result
Key: A P10, B P17, C P01, D P20, E P06, F P13, G P03, H P15, I P08, J P04, K P18, L P12, M P09, N P02, O P19, P P07, Q P16, R P11, S P05, T P14.

**Score: 18 of 20 (PASS).** P03, P17 and P20 are correct, and all six round 4b poses are still correct. The only miss is a P01/P16 swap.

### Carried item C4 (P01 / P16), due in the round 5 build
P16's head-back angle reads too weak, and P01 has a slight back-lean of its own.
- **P01 neutral**: bend 0, headTilt 0, look [0.15,0]. It is the **reference**: no lean, the arm at rest.
- **P16 look up / wonder**:
  - headTilt **−0.45** (was −0.35), so the snout points about 25° above the horizontal;
  - spine bend **−0.12**;
  - **both** hands lifted slightly forward-up (upper −0.3) with handClear ≥ 8;
  - tail down −0.15, so its tip sits on the ground side;
  - mouth M6, open 0.5.
  
  Its silhouette signature: **the snout points up at the sky**.
- Check on the round 5 sheet: P01 and P16 side by side, plus a silhouette pair.

## 4. Round 5 build notes (motion; Bible §8 + §12 round 5)

**Rendering**:
- 30 fps; `--disable-gpu`.
- Each clip is exported both as a frame strip PNG (`r5-<name>-strip.png`, every 2nd frame, on a ground line, with tick marks at each planted foot's x) and as a clip (`r5-<name>.webm` or `.mp4`, 1920 × 1080, Rex at s = 1.6, a plain paper background with the ground line).
- Add a `-guides` strip version that overlays:
  - the **head-top path**, the **tail-tip path** and the **hat-centre path** (thin coloured polylines, so arcs are visible);
  - the frame number under each frame.

**Clips, in build order**:
1. **Idle + blink**, 6 s: the §8.1 breathing (72 f), tail sway (96 f), arm lag and eye drift; blinks per §8.2 (random 60–180 f, 20 % doubles). It must never be fully static.
2. **Head turn**, yaw 45 → 0 → 90 → 45: §8.3 timings, eyes leading 2 f, a blink on every turn over 20°. Apply the round 2b rules: a **forced blink at 100–125°**, and body view switches only at 22.5/67.5/… on a blink frame.
3. **Walk**, 2 full cycles (56 f) plus a start and a stop:
   - 14 f per step, stride 40;
   - the per-foot `heels` from round 4c;
   - **foot lock** (the planted foot's x is fixed throughout its contact phase);
   - the tail lags 4 f, the arms are out of phase (the far arm 2 f later, at 80 %), and the hat wobbles on the down poses.
4. **Waddle-run**, 2 cycles: 9 f per step, a 2 f flight phase, arms flapping.
5. **Hop (small)**, 18 f, and **big jump**, 36 f: the §8.6 timings, volume-preserving squash, and a contact shadow that tracks the height.
6. **Startle**, 18 f (§8.8): the 1-frame jolt, the vibration hold, then easing into P05.
7. **Sneeze**, 48 f (§8.9): 3 inhales, a cross-eyed look, the release (head forward, hop back 6, 12 spray particles, the hat jumping), a double blink, then E4.
8. **Shake-dry**, 30 f (§8.7): head, body and tail in succession, droplets thrown on tangents at each reversal, ending in E2.

**Follow-through (§8.10)**: implement it as reusable springs, not per-clip keyframes.
- Tail: 5 segments, each lagging 1.5 f × i, with a 15 % overshoot.
- Hat: a damped spring at 3 Hz with damping ratio 0.35, clamped to ±0.15 rad and ±3 units.
- Arms: a 2 f lag, with one 10 % overshoot.
- Cheeks: a jiggle of 1.5 units for 4 f after landings.

**Boil**: keep the face boil on sixes and the body on threes. Check that it doesn't strobe in the clips; if it does, lower the jitter rather than changing the rate.

**Also include**:
- the re-render of the round 3 body expressions (E2, E3, E10, E12, E13, E22) with the corrected tail;
- the C4 P01/P16 pair (colour and silhouette).

**Acceptance (§12 round 5)**:
- frame counts and timings within ±1 f of §8;
- zero foot sliding (the tick marks stay put);
- the tail tip lags 6–8 f with an overshoot, and the hat settles in about 20 f;
- the head, tail tip and hops travel on arcs (judged from the guides paths);
- volume is kept in squashes (print the area ratio, which must stay within 0.97–1.03);
- no twinning, no pops, and a subtle face boil.

## Verdict
`APPROVED`. Round 4 is closed. Carried item **C4** (P01/P16) is due in the round 5 build. Proceed to round 5 (motion).
