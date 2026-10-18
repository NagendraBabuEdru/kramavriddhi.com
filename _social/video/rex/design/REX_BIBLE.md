# REX BIBLE v1: the master spec for Rex, the baby T-Rex

Owner of this document: the design expert. The animator implements it; the expert reviews against it.
Status: **v1.8 (2026-10-18)**, written after the round 0 audit (`design/reviews/round0_audit.md`) and amended after the round 1–4 reviews. See the changelog at the end.
If code and Bible disagree, the Bible wins, unless the expert changes the Bible.

---

## 0. Conventions (read first)

- **Units** are puppet code units at `s = 1`. The foot point is (0,0), **+x is the facing direction** (screen-right in the default ¾ view), and **y up is negative** (canvas convention). Rex is about 250 units tall including the hat.
- **HC** = head centre. Head-local points are written `HC(x, y)` with the same axes. Default HC in world = **(18, -166)**. The neck pivot (head rotation centre) stays at world **(14, -116)**, as now.
- **Views**: yaw 0° = front (looking at the camera), 45° = ¾ front (the default view), 90° = side profile, 135° = ¾ back, 180° = back. Facing left = the same drawing mirrored in x, **except** the eye highlights and the light/shadow sides, which follow the scene light (see §3.8).
- **Build Rex v2 as a new function** `A.rex2(x, y, s, pose)` in a new file `sketch/rex2.js`. Leave `A.rex` untouched so Episodes 0–1 still render. Switch episodes over after approval.
- Frame rate is **30 fps** everywhere. "f" = frames.

---

## 1. Identity in one paragraph
Rex is a **newborn**: a huge round head with a big forehead, two huge shiny eyes set low and close to a short, rounded snout, a chubby pear body, a cream belly, stubby legs, comically tiny arms, a thick puppy-like tail and the cap of his own eggshell worn as a hat. Everything is round and soft; the only "points" are tiny rounded claw nubs and at most two rounded baby teeth. He is curious first, scared for a moment, then comforted. **Hug-able, never scary.**

---

## 2. Proportions and landmarks (¾ front view, yaw 45°, s = 1)

### 2.1 Guide lines (identical in every view)
| Guide | y | What touches it |
|---|---|---|
| **H**: hat top | -248 | top of the eggshell cap |
| **T**: head top | -222 | top of the skull |
| **E**: eye line | -164 | centres of both eyes (HC y +2) |
| **S**: chin/neck | -112 | bottom of the head (chin underside) |
| **B**: belly centre | -66 | centre of the belly patch |
| **K**: knee | -30 | centre of the thighs |
| **G**: ground | 0 | soles of the feet, exactly |

Key ratios:
- Head height = 222 - 112 = **110**, which is **49.5 %** of the 222 standing height without the hat. The allowed range is 46–50 %, never below 44 % at any time, even when squashed.
- Head width (back of the skull to the snout tip, ¾ view) = **141**. Body width = **108**. Thigh about 56. Arm about 30. This gives the big–medium–small contrast.

### 2.2 Head (¾ view)
Draw the head outline as one closed polygon through these points (HC-relative, clockwise from the back, to be smoothed by `trace`). This replaces the `blobPts` snout formula.

```
(-60,0) (-57,-20) (-48,-38) (-33,-51) (-14,-56) (6,-55) (24,-49) (38,-39)
(50,-27) (62,-17) (72,-10) (79,0) (81,12) (78,24) (70,33) (56,40)
(38,46) (18,52) (-2,54) (-22,52) (-40,44) (-52,32) (-58,16)
```
- The **snout** is the bump from x +50 to the tip at **x +81**. The tip is round (about radius 20, never pointed). Snout length from the far-eye centre to the tip is 43; from the near eye to the back of the skull is 54. The snout must always be shorter than the skull behind the eye.
- **Jaw split** (for open mouths): the upper head is the outline above the mouth line; the jaw is the part below it, from the near mouth corner (22,24) round the chin to the snout underside (70,33). The jaw hinge is at **HC(14,26)**. See §6.
- **Face light zone**: a soft lighter wash `#bfe08f` (alpha 0.6) on the ellipse HC(22,8), rx 56, ry 36 (the cheeks, the snout and around the eyes). **No hatching inside this ellipse, ever.**

### 2.3 Eyes (¾ view, neutral)
| | Centre | rx × ry | Rotation | Notes |
|---|---|---|---|---|
| Near eye | HC(-6,+2) | 22 × 26 | 0 | Its width is 31 % of the head width |
| Far eye | HC(+38,0) | 15 × 22 | +0.08 rad | Foreshortened (it wraps around the form) |
- The gap between the eyes is 7 units (the snout bridge shows between them).
- Eye white `#ffffff`; outline 2.6 (§3.6), drawn only where the lids don't cover it.
- **Pupil**: a disc, radius **0.58 × ry** (near 15, far 12.8); in the far eye it is an ellipse foreshortened like the eye (rx = 0.70 × the radius), so it is never clipped by the eye's front edge at look ≤ 0.5, default `look` [0.15, 0] (a little forward, toward the facing direction). The pupil is clipped to the eye white.
- **Highlights** (always exactly two, plus an optional sparkle): the main one has radius 0.36 × the pupil radius, offset (-0.35, -0.38) × the pupil radius toward the key light; the small one has radius 0.16 × the pupil radius, offset (+0.38, +0.34) × the pupil radius. They are `#ffffff`, and both eyes use the same light-relative offset.

### 2.4 Brows, nostrils, mouth (¾ view, neutral)
- **Brows**: near brow centre HC(-6,-32), length 34; far brow centre HC(+38,-30), length 24. Neutral curve: arch height 3. Line 3.0, round caps. A brow must stay ≥ 6 units from the head outline and from any spot.
- **Nostrils**: near HC(64,-4), 2.6 × 1.8, rotated -0.3; far HC(74,-2), 2.0 × 1.4. Colour `#2a2724`, alpha 0.85.
- **Mouth line (neutral smile M1)**: corner A HC(22,22) with a small upturned tick to (18,17), middle HC(44,36), far end HC(70,24) (it disappears around the snout). Length about 48, which is 34 % of the head width; never longer than 45 %. **Every mouth point must stay ≥ 6 units from both eye outlines** (v1 put corner A on the near eye's rim; fixed in v1.1).

### 2.5 Body, belly, back bumps, spots
- **Body**: a pear centred at (0,-74). Upper half rx 44, ry 58; lower half rx 54, ry 60. It spans y -132 to -14. Flatten the front-lower quarter by 6 units (a straighter belly line against the round back).
- **Belly patch**: centre (16,-66), rx 30, ry 42, offset toward the near-front so it wraps. Colour `#f7edcc`. **3** plate lines (not 4), each bowing downward by 4 units, line 1.4 at dark 0.3; they stop 4 units short of the patch edge.
- **Back bumps**: exactly **5** on the body, never on the head or tail. Their centres sit on the back contour; draw the outer half-outline only. Colour **`#78ad57` (rexShade)**, so the bumps differ from the spots; ry = 0.75 × r; a gap of ≥ 2 units between neighbours; a bump closer than 4 units to the head outline is not drawn.
  `(-36,-114) r7.5`, `(-43,-100) r7`, `(-47,-85) r6.5`, `(-50,-70) r5.5`, `(-50,-55) r5`
- **Spots** (all fixed; no random placement; the pattern is mirror-symmetric left/right, so flipping never shows a different pattern). Colour `#5f9a4c`, clipped to the part they sit on:
  - Head, per side (3): C HC(-46,-28) 7×5 (fully clear of the hat rim: no spot may be half-covered by the hat); P1 HC(-53,-8) 6×4.5; P2 HC(-48,14) 5×4. In ¾ view only the near three show (the far ones are hidden by the hat and the curvature).
  - Body, per side (3): S1 (-22,-110) 7×5; S2 (-26,-90) 6×4.5; S3 (-30,-66) 5×4 (≥ 5 units from any bump).
  - Tail (3, on top): at 30 %, 55 % and 75 % of the tail length, sizes 6×4.5, 5×4, 4×3.
  - Delete the clover clusters from round 0.

### 2.6 Legs, feet, arms
- **Near thigh**: an ellipse at (24,-30), rx 28, ry 30, colour main. **Far thigh**: (-22,-32), rx 24, ry 27, colour shade `#78ad57`.
- **Near foot**: the sole runs along **y = 0** from x 2 to x 54, the toe is rounded up to (56,-8), the top is at (40,-14) and the heel at (4,-12). **Far foot**: x -50 to -2, height 12, shade colour; the near foot overlaps it by 4 units (no point-touch tangent between the feet).
- **Claws**: 3 cream nubs `#fbf6e8` per foot at the toe front, each 5 wide × 6 tall, rounded. Their bottoms sit on y = 0 (never below the ground). Hands have 2 nubs, 3 × 4.
- **Arms**: they are parented to the **body**, not the head, and drawn after the body but **before the head** (the chin may overlap the far shoulder, never the reverse).
  - **(v1.7)** Near shoulder **(42,-98)**, on the front contour about 14 units below the chin. The upper arm is **18** long (11 → 9 thick), the forearm **16** long (9 → 8), and the hand a mitten **9 × 8** with 2 claw nubs. The total reach is about 43, which is 19 % of his height and still a tiny T-Rex arm next to the 141-wide head.
  - Rest pose: the upper arm points 55° below the facing direction and the forearm 15° below it; the hand ends near (70,-80). That leaves **≥ 6 units of air** between the hand and the belly outline.
  - The far shoulder is at **(28,-100)**; the far arm is scale 0.85, shade colour, and drawn behind the near arm.
  - Reach: hand to mouth works with `headTilt ≥ +0.2` (chin down) and the upper arm at -1.4 rad. The hand may overlap the head here (a deliberate contact).
  - **Raised-arm rule (v1.7)**:
    - In the ¾ and side views, arms rise **forward-up**, never straight up into the head. The upper-arm elevation is limited to 40° above the facing direction (−0.70 rad).
    - The hand must end **≥ 6 units outside the head silhouette** and ≥ 6 outside the body outline, except for deliberate contacts (P19, P12, hands clasped at the chin). The rig computes this; the guides sheet prints a per-pose value `handClear` (in units, negative = inside).
    - Poses that need hands **above the shoulders** (reach up, wave, both arms up) are staged in the **front view (yaw 0)**, or in the ¾ view with the head turned to yaw ≥ 20° toward camera plus a head-back tilt, so the hand clears the head.
    - **No arm stretching** on held poses. Only motion smear frames (≤ 2 f) may stretch an arm, up to 1.25×.

### 2.7 Tail (¾ view)
- Centreline: (-30,-40) → (-62,-36) → (-94,-36) → (-118,-42) → tip (-132,-52).
- Full thickness at those points: **44, 32, 22, 15**, and a round tip of radius 7.
- Length about 106, which is no more than the body width (108).
- Neutral rules: the tip is never higher than the S line (-112), and it stays ≥ 10 units above the ground (no tangent with the ground line).
- Rig it as **5 segments** (each one rotates relative to the previous) for lag and follow-through (§8).

### 2.8 Shell hat
- The top cap from `A.shell(top = true)` (60 × 32 at scale 1), at **scale 1.05**, placed at **HC(-16,-48)**, rotated **-0.28 rad** (tilted back, cheeky). It sits on the back of the crown so the forehead stays clear.
- The jagged rim **overlaps the skull by 8 units** (no tangent with the head outline).
- Colour `#f5ecd6`, with 2 fixed lilac spots `#c9a8d8` at cap-local (-10,-18) and (8,-14). They are not random.
- The hat is parented to the head. Its spring wobble is limited to **±0.15 rad and ±3 units** of offset (§8.10). It only comes off in a deliberate story beat (`hat.on = false` with a falling animation).

---

## 3. Colour, value and line

### 3.1 Colour palette (colour version)
| Token | Hex | L* | Use |
|---|---|---|---|
| `rex` | `#a3d16e` | 79 | main body, head, near limbs |
| `rexShade` | `#78ad57` | 65 | far limbs, shadow-side wash, inside the tail curl |
| `rexSpot` | `#5f9a4c` | 58 | spots, back bumps |
| `rexFace` | `#bfe08f` | 86 | face light zone (§2.2) |
| `belly` | `#f7edcc` | 94 | belly patch |
| `claw` | `#fbf6e8` | 97 | claw nubs, teeth |
| `eyeW` | `#ffffff` | 100 | eye whites, highlights |
| `pupil` | `#221e1c` | 12 | pupils |
| `blush` | `#f4a7a0` | 76 | blush, at alpha 0.55 × the blush value |
| `mouth` | `#b9525a` | 48 | mouth interior |
| `tongue` | `#ee8f8f` | 69 | tongue |
| `tear` | `#a9d6f5` | — | tears and water lines, with a white highlight dot |
| `hat` | `#f5ecd6` | 94 | shell cap |
| `hatSpot` | `#c9a8d8` | 73 | 2 spots on the cap |
| `line` | `#2a2724` | 16 | all graphite lines on Rex |

Notes:
- Rex's old green `#8cc77d` is retired: it matched the jungle (see the audit, B1).
- The `rex` hue is a **warm lime (88°)**. All flora must be **cool blue-green (hue ≥ 135°)** and darker (§10).

### 3.2 Value rules (these also drive B&W)
1. Value order on Rex, light to dark: eye white 100 > claw 97 > belly/hat 94 > face 86 > body 79 > shade 65 > spot 58 > mouth 48 > line 16 > pupil 12.
2. The **face is the brightest area with the highest contrast**: eye whites against pupils plus the face light zone. Nothing else on Rex may have white next to near-black.
3. Rex against his background: **ΔL* ≥ 12 and Δhue ≥ 40°** around his silhouette. Where that fails (for example a pale sky), add the rim line (§3.7).
4. **B&W mode**: every token maps to grey of the same L*. Check: belly vs body ΔL* = 15 (OK), body vs spot 21 (OK), body vs shade 14 (OK). The B&W silhouette must separate from the background without relying on hue; if the local background is within ±12 L* of 79, use the rim line.

### 3.3 Shading
- One key light per scene (default from the upper-left, 35° above the horizontal; the scene can change it). Shade with hatching **only on the side away from the light**, as a band covering at most 35 % of each shape, at dark ≤ 0.22 and gap 6.
- **No hatching in the face light zone, the belly patch, the eye whites or the hat.**
- `A.shape`'s fixed "lower-left" band must take a light direction parameter for Rex.

### 3.4 Contact shadow (always on)
- An ellipse under the feet, centred at (2,0), rx 58, ry 8, colour `#3a3328`, alpha 0.22, drawn before Rex.
- When Rex is h units above the ground: rx × (1 + h/200), alpha × max(0, 1 - h/150).
- On water, use a darker, wider ripple-shadow (rx 70, alpha 0.15).

### 3.5 Line weights (code units at s = 1)
| Line | Weight |
|---|---|
| Outer silhouette, light side | 3.0 |
| Outer silhouette, shadow side (lower and back edges) | 3.6 |
| Overlap lines inside the silhouette (thigh over body, arm over body, jaw line) | 2.2 |
| Interior detail (belly plates, spot edges, bump outlines) | 1.4–1.6 |
| Eye outline | 2.6 |
| Brows | 3.0 |
| Closed-eye lines (∩, ∪, > <) | 3.2 |
| Mouth line | 2.6 (open mouth outline 2.6) |
- **Screen clamp**: the drawn width on screen = clamp(w × s, 1.6 px, 6 px) at 1080p. Divide by s inside the scaled context.

### 3.6 Line character
- For Rex outlines, **no gaps**: set the `A.line` break chance to 0. The weight may vary by piece (0.85–1.15), but the outline must stay closed.
- Boil (wobble between frames): body lines jitter ≤ 1.2 and boil **on threes** (redraw every 3 f). Face lines (eyes, brows, mouth, nostrils) jitter ≤ 0.6 and boil **on sixes**. The pupils and highlights never jitter.
- Second-pass lines (the `passes: 2` ghost line) are allowed on the body silhouette only, not on face features.

### 3.7 Rim and special light
- **Rim** (`A.rim`) on the light side: width 3, `#fff3c4`, alpha 0.8 in sunbeams; `#ffffff`, alpha 0.6 when separating him from a pale background; off in shade.
- **Wet**: fills 8 % darker, plus 2–3 white specular strokes (length 10–16, width 2.5) on the head top, snout top and belly. They last 4 s after the rain stops, then fade over 2 s.
- **Mud**: the feet and lower shins are tinted `#8a6a43` (alpha 0.6) up to y -10, and fade over 10 s.

### 3.8 Flip rule
When `flip = true` the geometry mirrors, but these are recomputed in screen space: highlight offsets, the shading side, rim side and dapple. **Light never mirrors with Rex.**

---

## 4. Turnaround: five views

All views share the guide lines in §2.1, the same volumes and the same landmarks. Values are HC-relative for the head and world-relative for the body (front and back views use HC x = 0 and body centre x = 0).

| Element | Front 0° | ¾ front 45° (§2) | Side 90° | ¾ back 135° | Back 180° |
|---|---|---|---|---|---|
| Skull | ellipse rx 62, ry 56 | 23-point outline | circle-ish: back -60, top -56; snout top slopes (30,-42)→(80,-12) | ellipse rx 60, ry 56 | ellipse rx 62, ry 56 |
| Snout | ellipse HC(0,22), rx 38, ry 26, merges into the lower outline; outline only where it sticks out | tip x +81 | tip x **+90** (the full length shows), round radius 16 | far-cheek bump only: (54,-6)→(66,10)→(52,30) | hidden |
| Eyes | HC(±31,+2), 21 × 26, identical | near (-6,2) 22×26; far (38,0) 15×22 | one eye HC(+26,+2), 15 × 25; pupil look +0.4 | **none** | none |
| Brows | HC(±31,-32), length 34, inner ends at x ±16 | §2.4 | HC(26,-32), length 22 | none | none |
| Nostrils | HC(±8,+10), turned outward 0.3 | §2.4 | one at HC(84,-6) | none | none |
| Mouth | corners HC(±24,30), middle (0,40), corner ticks up 5 | §2.4 | (22,22) → (52,32) → (88,22) | none | none |
| Head spots | none visible | near C, P1, P2 | near C(-34,-36), P1(-50,-16), P2(-54,6) | near (-20,-36), (-34,-14), (-30,8) + far C (22,-40) | all 6: (±22,-34), (±40,-14), (±44,8) |
| Hat | HC(-8,-50), rot -0.12 | HC(-16,-48), rot -0.28 | HC(-20,-46), rot -0.35 | HC(2,-50), rot -0.18 | HC(8,-50), rot +0.12 |
| Body pear | centre (0,-74), width 108 | §2.5 | centre (-4,-74); front rx 46, back rx 48 (depth 94) | centre (0,-74) | centre (0,-74) |
| Belly | centre (0,-66), 34 × 44 | §2.5 | front band 26 deep, y -108 to -24 | thin crescent x +38…+48, y -100 to -36 | hidden |
| Back bumps | hidden (maybe 1 tip at the shoulder edge) | 5 on the back contour | 5 on the back contour | 5 along a spine line from (-14,-120) to (-22,-56) | 5 down the centre, x 0, y -122/-106/-90/-74/-58 |
| Body spots | none | S1–S3 near | S1–S3 near | S1–S3 near, larger | all 6 mirrored: (±22,-110), (±30,-90), (±28,-66) |
| Legs | thighs (±30,-30) 26 × 28; feet face the camera: ovals (±32,-7) 20 × 7, 3 nubs at the front | §2.6 | near thigh (4,-30) r 28; far foot toes peek 12 behind | heels, round, toes hidden | heels (±30,-6) |
| Arms | shoulders (±40,-106), hands (±46,-86), ≥ 6 units of air | §2.6 | near arm only; far hand peeks 6 behind | near elbow peeks at (+46,-98) | hands peek at the sides (±52,-92) |
| Tail | tip peeks behind the left thigh: rounded nub at (-66…-80, -36…-52) | §2.7 | full: (-40,-40)→(-76,-36)→(-110,-38)→(-134,-46)→(-148,-56) | toward the viewer, lower-left: (-18,-40)→(-50,-30)→(-76,-26)→(-92,-32)→(-100,-42) | curls to screen-left: base (0,-40), tip (-62,-34) |

### 4.1 View overrides (v1.5, after the round 2 review). Where these differ from the table above, they win.
- **Side head outline** (HC-relative, 25 points, clockwise from the back):
  ```
  (-60,0) (-57,-20) (-48,-38) (-33,-51) (-14,-57) (6,-57) (26,-52) (44,-44) (56,-33) (63,-20)
  (68,-10) (78,-6) (87,0) (90,10) (88,22) (80,32) (66,40) (48,46) (28,51) (8,54)
  (-12,54) (-32,49) (-46,40) (-56,24) (-60,12)
  ```
  The forehead is round down to (63,-20). The snout is a short round **muzzle** from x 68 to the tip at 90; it is never a cone or wedge.
  - Skull depth at y −20: 120.
  - The snout adds 22 units, about 15 % of the 150 head length.
  - Side eye at HC(26,2), 15 × 25, so it sits on the cranium. Brow HC(26,−32).
  - Nostril HC(85,−2).
  - Mouth: A (30,24) with a tick up to (27,20), then B (56,33), then F (84,25).
  - Face light zone: HC(40,8), rx 46, ry 34.
- **The head-turn keys** use this new side outline. All in-between yaws must stay convex on top, with no straight forehead-to-snout line longer than 25 units.
- **Front face** (HC-relative):
  - eyes at (±33,0), 20 × 26, so the outer edges are 9 units inside the outline and the inner edges at ±13;
  - nostrils at (±6,20), 2.2 × 1.6, so they never sit between the eyes at eye level;
  - mouth corners (±22,32) with ticks up 4, middle (0,40);
  - the muzzle arc is the ellipse (0,24), 30 × 20, upper half only, at line 1.4 dark 0.35.
- **Far eye in head turns, 65–80°**: the far eye slides behind the **snout-bridge curve**. Clip it with the near-side bridge silhouette, i.e. the head outline offset 3 units inward between the brow and the nostril; do not shrink its width. Its outline and pupil are only drawn while its visible width is ≥ 6 units, fading out over 6 → 3 units. A thin vertical sliver of eye must never show.
- **Tail in the back views**:
  - Back 180°: the base ellipse at (0,−44), rx 22 ry 18 (the root seen from behind), then the centreline (0,−44) → (−12,−30) → (−34,−22) → (−56,−24) → (−70,−36), thickness 40 / 30 / 20 / 12, ending in an r 6 cap.
  - The tail overlaps the **left foot only**. The right foot and leg stay fully clear. The tip stays ≥ 10 units above the ground.
  - ¾ back 135°: centreline (−14,−44) → (−40,−30) → (−66,−26) → (−86,−32) → (−96,−44), thickness 36 / 28 / 20 / 14 (approved), r 6 cap. It overlaps the near (left) thigh by ≤ 40 % of the thigh's width, and the far foot stays visible.
- **Arms in the back view**: each arm shows the hand **plus 8 units of forearm** coming out from behind the body outline at (±48,−96) → hand (±56,−88). The arm overlaps the body outline by ≥ 4 units, so it never reads as a floating dot. It is drawn before the body, so the body outline crosses it.
- **¾ back cheek bump**: draw its outline only on the part that sits outside the skull ellipse; no stroke inside the head.
- **Body view switching (for animation)**: the body uses discrete views; the head interpolates continuously. Body switches happen at yaw 22.5 / 67.5 / 112.5 / 157.5, only on a frame where the head is mid-turn and the eyes are closed (a blink) or the move is fast (≥ 15° per frame). Never let the body switch during a hold.

Volume checks the reviewer will measure:
- The front skull width (124) must equal the side skull depth without the snout (back -60 to forehead front about +60 = 120) ± 6.
- Eye ry stays 25–26 in every view where an eye shows.
- The hat's size is identical in all views.

**Head turns between views**: use key tables (the columns above) and interpolate positions and sizes linearly by yaw. Features fade over 10° at their visibility limits: the far eye shows from 0–80° (fading out 70–80°); the near eye, mouth and nostrils show from 0–115°; the belly from 0–150°. A head turn of more than 20° always has a blink (§8.2).

---

## 5. Face kit (independent controls)

Pose field `face: { ... }`. Each control is per side where it says L/R ("near/far" in ¾). Ranges are clamped.

| Control | Range | Meaning and implementation |
|---|---|---|
| `browLift` (L, R) | -1…1 | moves the brow ∓: -1 = 6 units down, +1 = 10 units up |
| `browTilt` (L, R) | -1…1 | the **inner end** (toward the snout bridge) moves up (+) or down (−) by **12** units. + = sad or worried, − = determined. **Clamp at −0.6** so he never looks angry. |
| `browCurve` (L, R) | -1…1 | arch height, ±6 units |
| `lidUp` (L, R) | 0…1.15 | upper lid: 1 = default (the lid edge just touches the eye top), 0 = closed, 1.15 = wide (the eye white grows 10 % taller, the lid goes up). Implement the lid as a skin-coloured shape clipped to the eye, with its edge drawn at 2.6. The lid edge is an **arc** (sag 0.25 × rx, following the eye's curve), never a straight line, and it **tilts with the brow**: angle = browTilt × **0.40** rad, with the inner end up for +. The lid edge never extends outside the eye outline. **Upper-lid outline rule (v1.6)**: above the upper-lid edge the eye outline is drawn only as an eyelid line at weight 1.6, dark 0.45, and only while lidUp ≥ 0.5. Below 0.5 nothing is drawn above the lid edge; the lid edge (2.6) is the only line. A nearly closed eye must never read as an empty ring. When lidUp ≥ 1.1 (wide), the eye must still keep ≥ 6 units inside the head outline (front view included); shrink rx if needed. |
| `lidLo` (L, R) | 0…0.6 | lower lid pushing up by `lidLo × ry` (coverage factor 1.0, not more), with an upward-curved edge (smile squint, Duchenne). The effective value (including cheek) is **capped at 0.45**. The lid fill matches the skin under it exactly (no lighter crescent). The edge line is 2.0. When the effective lidLo > 0.2, the pupils shift up by 0.15 × ry so they are never half-buried. Not drawn below 0.15. **Outline rule**: below the lower-lid edge the eye outline is **not drawn**; the lid edge becomes the eye's lower boundary, at the eye-outline weight 2.6, and it meets the outline ends exactly (no overshoot). The visible eye becomes a clean crescent or half-moon. (Upper lids keep the eye outline above the lid edge; that reads as eyelid volume.) |
| `closed` | `'down'`/`'happy'`/`'squeeze'` | shape of a fully closed eye: ∪ relaxed (sleep), ∩ happy, > < squeeze |
| `pupil` | 0.30…0.72 | pupil radius × ry. 0.3 = shock, 0.58 = default, 0.7 = love or wonder |
| `look` | [-1…1, -1…1] | pupil offset up to 0.32 × ry. The eyes **lead** the head by 2–4 f. |
| `cross` | 0…1 | the pupils converge toward the snout (nose-drop gag) |
| `sparkle` | 0…2 | extra small highlights (0.10 × the pupil radius), for wonder and love |
| `wet` | 0…1 | a water line on the lower lid (blue crescent 0.9 × rx) + a third highlight + slightly bigger highlights |
| `mouth` | `M0`…`M15` | the shape (§6) |
| `open` | 0…1 | jaw angle = open × 0.27 rad (0.7 × 0.38) about the hinge HC(14,26) **plus** a straight drop of open × 10 units (approved round 1 deviation). The near corner stays attached; the mouth reads as a rounded "D". |
| `corners` | -1…1 | mouth corners up (+) or down (−). The **near corner A never rises above y 22** (it sits between the eyes); a positive value raises F by up to 7 units and deepens B by up to 4. A negative value lowers A and F by up to 7. |
| `width` | 0.7…1.3 | mouth width scaled about its middle |
| `side` | -1…1 | slides the mouth along the snout by ±10 (for smirks and yuck) |
| `wobble` | 0…1 | the lip line gets a 3-wave sine of amplitude 2 × wobble, animating at 6 Hz |
| `teeth` | 0/1 | two rounded nubs hanging from the upper lip at HC(36,·) and (50,·), **6 × 6**, white `#fbf6e8`, outline 1.2 at dark 0.6. They must read as teeth at 360 px wide; if not, leave them out. |
| `tongue` | 0…1 | how much tongue shows inside the open mouth |
| `cheek` | 0…1 | the cheek outline bulges up to 5 units near the mouth corner; adds 0.3 × cheek to `lidLo` and +0.3 to `corners` |
| `blush` | 0…1 | **feathered** ellipses (radial gradient, solid to 60 %, fading to 0 at the edge): near HC(-22,30) 12 × 7, far HC(60,12) 7 × 5 (front view: HC(±40,16)). Colour `#f7a1a6`, alpha 0.7 × blush. It must read **pink, not tan**, over the green. It never touches an eye or the mouth. Cold: an extra 10 × 6 on the snout tip. |
| `flare` | 0…1 | nostril scale 1 + 0.6 × flare |
| `wrinkle` | 0…1 | 2–3 short arcs (length 6, width 1.6) on the snout bridge at HC(56,-14) and (60,-8) |
| `tears` | 0…1 | drops form at the outer lower lid and run **along the cheek surface** (path: lid corner → HC(-10,30) → off the chin). They never cross the mouth. |
| `stream` | 0…1 | wail tears: two arcs of drops shooting out sideways |
| `sweat` | 0…1 | one drop at HC(-52,-30) |

Every feature sits on the head surface and moves with `headTilt`, the head squash and the yaw.

### 5.1 Expression list (24) with control values
Format: brows (lift, tilt, curve) · lids (up/lo or closed) · pupil, look · mouth (shape, open, corners) · extras · body cue.

| # | Expression | Face | Body cue |
|---|---|---|---|
| E1 | Neutral-content | brows 0, 0, 0.3 · lids 1/0 · pupil 0.58, [0.15,0] · M1, 0, +0.3 | breathing idle, tail relaxed |
| E2 | Happy | 0.3, -0.1, 0.5 · 1/0.3 · 0.6 · M2, 0.35, +0.8 · cheek 0.5, blush 0.3 | head up -0.05, tail wag 2 Hz |
| E3 | Big laugh | 0.6, 0, 0.6 · closed happy · — · M4, 0.9, +1, tongue 0.6, teeth · cheek 1, blush 0.6 | head back -0.2, bouncing on the spot (squash ±0.08 at 4 Hz), arms in to the belly |
| E4 | Giggle | 0.2, +0.3, 0.4 · closed happy · — · M2, 0.25, +1, side +0.2 · cheek 0.8, blush 0.8 | one hand at the mouth, shoulders up, head tilt 0.15 |
| E5 | Surprised | 1, 0, 0.8 · 1.15/0 · 0.45 · M5, 0.4 | head back -0.1, stretch 0.06 |
| E6 | Wonder/amazed | 0.8, +0.2, 0.6 · 1.1/0.15 · 0.70, sparkle 2, look up · M6, 0.55, +0.3 · blush 0.3 | head up -0.15, arms lifted a little, tail still |
| E7 | Curious | near 0.9 curve 0.6; far -0.1 · 1/0.1 · 0.6, look at the object · M0, 0, 0, side +0.3, width 0.8 · flare 0.3 (sniff) | head tilt 0.18 sideways, lean 0.08 forward |
| E8 | Confused | near 0.8 tilt +0.4; far -0.4 tilt -0.3 · near 1, far 0.85 · 0.55, look [0.5,-0.6] · M8, 0.05, -0.2, wobble 0.3, side -0.3 | head tilt 0.25, double blink, hand to the chin |
| E9 | Shy/bashful | 0.2, +0.6, 0.3 · 0.75/0.3 · 0.6, look [-0.5,0.6] · M1, 0, +0.4, width 0.7 · blush 1 | head down 0.15, shoulders up, hands together, tail curled round the feet, one foot twists |
| E10 | Sad | -0.2, +1, 0 · 0.8/0 · 0.62, look [0,0.5], wet 0.3 · M7, 0, -1 | head down 0.2, tail droop -0.35, arms hang, slow breathing |
| E11 | About to cry | -0.1, +1, 0 · 0.85/0.35 (trembling) · 0.66, wet 1 · M8, 0.1, -0.8, wobble 0.8 · blush 0.3, flare (sniffs) | shoulders up, two sniffs, chin trembles |
| E12 | Crying/wail | -0.3, +1 · closed squeeze · — · M9, 0.9, -1 · tears 1, stream 1 | head back -0.15, arms out low, sob bounce 2.5 Hz, tail limp |
| E13 | Scared | 0.6, +0.8 · 1.1/0 · 0.36, look at the threat · M8, 0.05, -0.6, wobble 0.4 · sweat 1 | crouch (squash 0.1), arms to the chest, tail wrapped, lean back 0.1, tremble |
| E14 | Startled | 1, 0 · 1.15/0 · 0.30 · M6, 0.6 | jolt (§8.8): everything stiff, tail straight |
| E15 | Sleepy | -0.2, +0.2, 0 · 0.4/0.1 · 0.55, look down · M0, 0, +0.1 | slow head nods (1.2 s), gentle body sway |
| E16 | Yawn | 0.4, +0.3 · closed squeeze · — · M10, 1.0 · tears 0.3 at the end | head back -0.25, arms out, stretch 0.08 |
| E17 | Sneeze | antic: 0.5→0.8, +0.3 · 0.6→0.2 · cross 0.6 · M12, 0.2 · wrinkle 1, flare 1 → release: squeeze, M6 0.8 | see §8.9 |
| E18 | Determined/brave | -0.4, -0.5, 0 · 0.85/0.2 · 0.6, forward · M0, 0, +0.2, width 0.8 | chest out, arms down, lean 0.06, tail straight back |
| E19 | Proud | brows 0.5, -0.1, 0.5 · **closed happy (∩)** · — · M1, 0, +1, side +0.2 · cheek 0.4, blush 0.3 | chin up -0.15 (on the head-only sheet: headTilt -0.12), belly forward 4, tail up 0.2. (v1.3: half-lids read "unimpressed".) |
| E20 | Yuck/disgusted | near -0.4 tilt -0.3; far 0.2 · 0.7/0.4 · 0.5, look away · M11, 0.3, -0.6, side -0.3, tongue · wrinkle 1 | head pulled back 0.1 and turned away (yaw -10°), palms out |
| E21 | Mischievous | near 0.5 curve 0.2; far -0.3 tilt -0.4 · 0.7/0.3 · 0.55, look [0.8,0] · M13, 0, +0.8, side +0.5 · blush 0.2 | shoulders up, hands rubbing, tail-tip flick 3 Hz |
| E22 | Cold/shivering | -0.1, +0.6 · 0.8/0.2 · 0.55 · M14, chattering 0.05↔0.15 at 10 Hz · cold blush 0.5, breath puff | hunched (squash 0.06), arms tight, tail around the feet, shiver (§8.11) |
| E23 | Love/adoring | 0.5, +0.4, 0.5 · 1/0.35 · 0.72, sparkle 2 · M1, 0, +0.8 · blush 0.9 | head tilt 0.15, hands clasped under the chin, slow tail wag |
| E24 | Cute roar | -0.2, -0.3 · 0.9/0.3 · 0.55 · M15, 0.8, +0.4, teeth · blush 0.4 | arms up with tiny claws out, stretch 0.06, tail up, a small hop. The eyes stay round, so it reads as playing. |

**Distinctness rules** (each is checked on the sheet):
- E1/E2: happy must show teeth or an open mouth plus cheek; content is a closed mouth.
- E5/E6/E14: surprised = small o with medium pupils; wonder = big pupils with sparkle; startled = tiny pupils, big O and a body jolt.
- E10/E11/E12: the mouth goes closed → wobble → wail and the eyes go open → wet → squeezed.
- E13/E14: scared is sustained and crouched; startled is a 6-frame stiff jolt.

---

## 6. Mouth shapes (¾ view, HC-relative)
Base points: near corner A (22,24), middle B (44,34), far end F (70,26). **Every mouth is clipped inside the head + jaw silhouette.** Open shapes rotate the jaw down (the lower lip and the chin outline move together), so the skull never shrinks.

| ID | Name | Shape |
|---|---|---|
| M0 | closed neutral | A(22,28) – B(44,32) – F(70,26), no tick |
| M1 | smile | A(22,22) with a tick to **(20,20)** – B(44,36) – F(70,24) |
| M2 | open smile | M1 upper lip; jaw open 0.3; interior `mouth`, tongue in the bottom 40 % |
| M3 | grin | open 0.2, corners up, 2 teeth |
| M4 | laugh | open 0.9, corners at max, tongue 50 %, 2 teeth. Shape = a rounded **"D"**: the upper lip is the M1 curve flattened (its middle dip is limited to 4 units when open > 0.5), the lower edge is a deep round curve, and both corners are rounded (radius ≥ 4); the far corner ends at x ≤ 66. No V-wedge, no pointed corners. |
| M5 | small o | ellipse at (44,32), 6 × 7, jaw 0.15 |
| M6 | big O | ellipse (42,36) 11 × 14 (moves down with the jaw), jaw 0.5, tongue at the bottom |
| M7 | frown | A(22,32) with a tick down to (18,36) – B(44,28) – F(66,28) (it ends ≥ 4 units inside the jaw outline). A **clean** arc: no wobble, no jitter beyond face boil 0.6 (wobble belongs to M8) |
| M8 | wobbly frown | M7 + wobble |
| M9 | wail | jaw 0.9; the upper lip arches up in the middle (B y 26), corners down (A y 34); a rounded-trapezoid interior wider at the bottom, tongue at the bottom, no teeth |
| M10 | yawn | tall oval (42,38), 14 × 20, jaw 1.0, tongue, no teeth |
| M11 | yuck | jaw 0.3, corners down, tongue tip out at the far side (62,38), 8 × 6 |
| M12 | pucker | tight circle (48,30), r 4, line 2.6, + wrinkle |
| M13 | smirk | A(22,32) flat – B(46,32) – F(70,20) with a tick at F |
| M14 | eee/chatter | flat wide A(20,30) – F(72,28); open 0.05–0.15; 2 small teeth |
| M15 | cute roar | jaw 0.8, corners +0.4, 2 teeth, tongue 40 % |

**Open-mouth silhouette amendment (v1.6)**: this overrides the v1.4 numbers below where they differ.
- At any open value the upper-lip path from the snout tip to F is **convex or straight**: no concave notch and no inward hook under the tip.
- Upper lip: (81,12) → (80,22) → F, with F clamped to x ≤ 76 and y ≥ 26. It turns into the mouth with a radius ≥ 5, not a cusp.
- The jaw front's foremost point is at x ≥ 76 after the transform, so the overbite is ≤ 5 at every open value.
- New pre-transform jaw front: F2 (78,30) → (82,37) → (78,45) → (64,50) → (40,51) → (18,52).
- Test it on M3, M4 and M15 at s = 1.75: the snout front and the jaw front must read as **one rounded muzzle split by the mouth**, not as a beak over a chin.

**Open-mouth silhouette shape (v1.4)**: this replaces v1.3, whose numbers still left a small overbite.
- Judge the shape **at open = 1, after the jaw transform**.
- (a) **Overbite**: the jaw front's foremost point is at x ≥ 72 (the snout tip is at 81), so the upper snout overhangs the jaw by ≤ 9 units, and by ≤ 5 at open ≤ 0.4. Pre-transform jaw front: F2 (72,29) → (78,35) → (75,43) → (62,49) → (40,51) → (18,52). The jaw rotation pulls the front back about 4, which lands it near x 74. To avoid a pop at small openings, **lerp** each jaw-front point from its closed-outline position (open = 0) to these positions (open = 1) by `open`.
- (b) **Upper lip**: snout tip (81,12) → (80,20) → (77,25) → F, with F clamped to x ≤ 70, y ≥ 25 when open. The path only goes down and back, turning on a radius ≥ 6; there is no inward hook or cusp under the snout tip.
- (c) **Jaw front**: convex. Its middle bulges forward ≥ 4 units beyond the straight line between its ends, and no straight segment is longer than 10 units.
- (d) **Chin**: the jaw-weight blend into the neck (1 at x ≥ 18 → 0 at x ≤ −10) stays as in v1.3.

**Open-mouth outline rule**: with any open mouth, the silhouette outline must run unbroken from the snout tip, along the upper lip to the far mouth corner, and down the jaw front to the chin. No open gaps, no dangling segments of the old skull outline, and no hooks where the lower lip meets the jaw. The extra jaw drop is capped so the chin moves ≤ 14 units below the closed chin.

Teeth: **at most 2 visible**, rounded 5 × 5 (or 5 × 6 for the roar), white `#fbf6e8`. Never a row of points.
Front and side view versions follow the same rules using the mouth anchors in §4.

---

## 7. Key poses (pose sheet)
Each pose has a named line of action (LoA) and must read as a solid black silhouette.

| # | Pose | Key numbers |
|---|---|---|
| P01 | Neutral stand | LoA a gentle C; headTilt 0; tail per §2.7; arms at rest |
| P02 | Curious lean | spine bend +0.10 (forward); head yaw +10°, tilt 0.18; the near arm lifts 0.4; tail up 0.1 for counterweight |
| P03 | Excited | **(v1.8) Grounded**: both soles on y 0, heels 0, tight contact shadow. Stretch 0.06; **arms in a wide V**, forward-up at the −0.70 limit with the forearm +0.25 open, handClear ≥ 10; head up −0.1; mouth M2/M4; **tail up 0.6, tip curling up**; a little bounce in animation |
| P04 | Sad slump | **(v1.8)**: head down **0.35**, spine bend forward **+0.12**, so the head drops in front of the chest line; squash 0.05; shoulders down 4; arms hang; **tail droop −0.55, straight and low, no upward tip curl** (tip ≥ 10 above the ground) |
| P05 | Scared crouch | **(v1.8)**: squash 0.15; **lean back −0.15** (away from the threat); head pulled in (neckDrop 8); **both hands up in front of the chest, held out ≥ 6 from the body** (handClear ≥ 6); tail wrapped forward around the feet; eyes wide; tremble in animation |
| P06 | Proud | **(v1.8)**: **lean back −0.14**, chin up −0.25, belly +8; arms back 0.3 (behind the body); **tail up +0.35, straight, pointing up-back** (no curl); feet planted wide (stance +6) |
| P07 | Hop anticipation | squash 0.15; head down 0.1; tail down -0.15; arms back |
| P08 | Hop air | **(v1.8) Clearly airborne**: the soles are **≥ 30 units** above the ground (air 30–36); legs tucked together (tuck 10); stretch 0.10; arms up and out; **tail trailing down −0.3 (tip below the hip)**; a light, wide contact shadow far below |
| P09 | Land | squash 0.18 (head squash 0.07); arms forward and down; tail whip up +0.2 |
| P10 | Sit | hip y -26 → the bottom on the ground; legs forward (feet at x +40, soles toward the camera 30 %); tail flat on the ground behind with **a visible gap** at the ground line (no tangent) |
| P11 | Sleep curl | **(v1.7) A dedicated curled shape, not a rotated stand.** Side-on view (facing right), lying on his belly, curled: **Body**: a mound ellipse at (0,−42), rx 64, ry 42, flattened 6 at the bottom on y 0. · **Legs**: near thigh oval (10,−26), 26 × 22; foot tucked forward, sole toward the camera at (36,−8), 3 nubs visible. · **Tail**: wraps round the front along the ground. Centreline (−60,−22) → (−70,−8) → (−36,−5) → (14,−5) → (58,−9) → tip curled up at (70,−20); thickness 34 → 12; it lies in front of the foot. · **Head**: resting **on the tail**, HC at (70,−60), rotated +0.25 (chin down); closed 'down' eyes (∪), M0 with corners +0.3, blush 0.3. · **Hat**: tilted −0.55, still on, overlapping the skull 8. · **Arms**: hidden except the near hand under the chin, on the tail. · **Breathing**: the body ry swells ±1.5 every 2.4 s; the head rises 1, lagging 6 f. · **Contact shadow**: a long ellipse, rx 90. · **Silhouette**: a round mound with a head bump and a tail curl. |
| P12 | Peek | only the head (above the eyes) + 2 hands show over an object's edge; the hands overlap the edge by 4 |
| P13 | Reach up | **front view (yaw 0)**: on tiptoe (heels up 8); stretch 0.08; both arms up beside the head (upper −2.4 / +2.4 rad from down in front space), hands ≥ 6 outside the head outline at about (±70,−150); head up −0.3 (the features shift up 6), look up; tail tip peeks out on one side |
| P14 | Balance | arms straight out; lean ±0.15; the tail counter-swings ∓0.3; stance width +12 |
| P15 | Hug-self (cold) | arms crossed at the chest; squash 0.06; tail curled round the feet; head down 0.1 |
| P16 | Look up (wonder) | head up -0.35; spine bend back -0.08; arms slightly up; tail down -0.1 |
| P17 | Shake-dry key | head rotated 0.35 the other way to the body (counter-twist); tail whipped up |
| P18 | Wave | **front view (yaw 0)**, or ¾ with headYaw ≥ 20° toward the camera: the near arm raised out to the side beside the head (hand at about (+72,−148), handClear ≥ 8), forearm waving ±0.35 rad; the far arm at rest; E2 face; head tilt 0.1 toward the waving hand |
| P19 | Hand to mouth | **(v1.8)**: upright (bend 0, **no crouch**); head down 0.2 and turned 10° toward the camera; the near hand pokes **≥ 4 units in front of the snout outline**, at the mouth; the far arm at rest; **tail relaxed behind, tip curled up +0.2 (no wrap)**; one foot turned in |
| P20 | Cute roar | ¾ view: E24 face; head back −0.15; stretch 0.06; **both arms forward-up at the −0.70 limit** with claws spread (3 nubs per hand), handClear ≥ 8; tail up 0.5; one heel up 4 |

Rig rules used by the poses:
- **Spine bend** replaces the old rigid `lean`: the body rotates about the hip (0,-40) by the bend amount, the head counter-rotates by 50 % of it, and the feet stay planted.
- **Squash** keeps volume: sy = 1 − q, sx = 1/(1 − q). The head gets 40 % of the body's q.

---

## 8. Motion cycles (30 fps)

### 8.1 Idle breathing (moving hold)
- A 72 f cycle (2.4 s): body sy 1 + 0.012·sin, with sx compensating to keep the volume.
- The head bobs 1.2 units, lagging 4 f.
- The tail sways ±0.05 rad on a **96 f** cycle (out of sync with the breath); the arms move ±0.04 rad, lagging 6 f.
- The eyes drift by `look` ±0.08 every 2–4 s.
- Never fully static.

### 8.2 Blink
- 4 f: f0 lidUp 1 → f1 0.4 → f2 0 → f3 0.5 → f4 1 (it closes faster than it opens).
- Random interval of 60–180 f; 20 % of blinks are doubles (4 f apart).
- Always blink on head turns > 20° and in surprise and confusion.

### 8.3 Head turn
- 8 f (6–10). The pupils move first (f0–2).
- The head yaw eases f2–8, with a blink at f3–6.
- The body follows with 30 % of the yaw, f4–10. The tail settles f8–14.

### 8.4 Walk
- **14 f per step** (28 f cycle). Stride 40 units per step, so the speed is 86 units/s × s.
- f0 contact (heel touches, body y 0) → f2 down (body +4, squash 0.03) → f7 passing (body -3, swing foot lifted 9) → f10 up (body -4) → f14 next contact.
- The head bob follows the body, 2 f later, at 70 % amplitude.
- The tail swings opposite the hips (±0.10 rad, lag 4 f). The arms swing ±0.25 rad opposite the legs; the far arm is 2 f later at 80 % (no twinning).
- The hat wobbles about 1.5° on each down pose.
- **Foot lock**: the planted foot's world x is fixed for its whole contact phase. Mark it on the strip.

### 8.5 Waddle-run
- **9 f per step** (18 f cycle). Stride 46, so the speed is 153 units/s × s.
- Spine bend +0.12 (forward); a 2 f flight phase per step (both feet up, body -6).
- The arms flap ±0.5 rad at the step rate, with a 1 f near/far offset.
- The tail points straight back, bobbing ±0.15. The head lags 1 f.

### 8.6 Hop (small)
- 3 f anticipation: squash 0.12, head down 0.1, tail -0.15.
- 8 f in the air on a parabola: apex 36 units at air-f4; stretch 0.08 at take-off, 0 at the apex.
- 2 f landing: squash 0.15.
- 5 f settle: overshoot to -0.03, then 0. Total 18 f.
- The tail lags 4 f and the hat 3 f (spring).
- Big jump: 5 f anticipation (squash 0.2), 20 f in the air (apex 90), 3 f squash 0.2, 8 f settle.

### 8.7 Shake-dry (30 f)
- f0–3 anticipation: crouch 0.06, eyes squeezed.
- f3–12 head: ±0.35 rad, 3 swings, decaying.
- f8–20 body: ±0.12 rad, with alternating squash.
- f14–26 tail: ±0.5 rad.
- At every direction reversal, 3–4 droplets fly off the outer edge, tangentially, under a gravity of 1200 units/s² (10–14 in total).
- f26–30 settle, then a blink and a fluffy happy face (E2). The wet speculars are removed.

### 8.8 Startle
- f0 normal. **f1 jolt**: body y -10, stretch 0.12, lids 1.15, pupils 0.3, arms stiff out, tail straight, hat jumps 8 up.
- f1–6 hold, with a ±1 unit vibration.
- f6–18 ease out into the scared crouch (P05). The contact shadow tracks the height.

### 8.9 Sneeze (48 f)
- f0–24 build-up: 3 inhales at f0, f8 and f16, each one head back -0.06, flare +0.33 and lids down a step; mouth M12; eyes cross 0.6.
- f24–28 freeze (squeezed eyes).
- **f28–30 release**: head forward +0.3, squash 0.12, the body hops back 6 units, and 12 spray particles come out of the nose in a ±20° cone; the hat jumps 6.
- f30–42 recover. f42–48: a surprised double blink, then E4 giggle.

### 8.10 Follow-through (applies everywhere)
- **Tail**: segment i lags the body by 1.5 f × i (total 6–8 f at the tip), overshoots 15 % and settles within 10 f.
- **Hat**: a damped spring with a natural frequency of 3 Hz and a damping ratio of 0.35 (it settles in about 20 f); clamp at ±0.15 rad and ±3 units.
- **Arms**: they flop 1 overshoot (10 %) after a stop, lagging 2 f.
- **Cheeks**: a jiggle of 1.5 units for 4 f after a landing.

### 8.11 Shiver
- Its own timer `shiverT` (not `tearT`). The body offset is ±1.5 units, alternating **every frame** (15 Hz).
- The head lags 1 f. The teeth chatter at 10 Hz (M14).
- The amplitude decays to 0 over 3 s as he warms up.

---

## 9. Forest reactions (adapted from Skill 4)

| Event | Rex's response (numbers) |
|---|---|
| Wind gust | lidUp 0.6 + lidLo 0.3 (squint); spine bend into the wind 0.08 × gust; hat rot +0.12 × gust downwind (spring); tail swings downwind 0.3 × gust, lagging 6 f; arms tucked in. When gust > 0.8: one stumbling step back (14 f) plus E13 for 10 f. |
| Cold | E22 + P15; breath puff every 2.4 s (a white ellipse 10 × 6 that grows to 30 × 18 and fades over 30 f, coming out of the mouth). |
| Raindrop on the nose | f0 the drop hits the snout tip (a splash of 4 droplets); f0–4 hard blink; f4–14 cross 1 (eyes look at the nose); f14–18 snout wrinkle; then the sneeze (§8.9) **or** a giggle (E4), picked by the story. |
| Heavy rain | hunched (squash 0.06, head down 0.15); squint lids 0.6; wet look (§3.7); the drips at the snout tip and tail tip fall every 20 f; afterwards the shake-dry (§8.7). |
| Puddle or mud | the foot sinks 4 units; a crown splash of 8 drops on arcs (apex 20–30); rings expanding to r 60 over 24 f; muddy feet (§3.7); footprints (dark ovals 20 × 6 that fade over 8 s). |
| Sun warmth | E15-lite: lidUp 0.5, lidLo 0.3, corners +0.6; chin up -0.12; squash 0.02 (relaxed); a warm rim on the sun side; optional yawn after 2 s. |
| Thunder | startle (§8.8) → hide (P05 behind the nearest object) **or** freeze 20 f; tail stiff. Never more than 3 s of fear before a comfort beat. |
| Slope / uneven ground | the body stays vertical (gravity), so the feet adapt: the uphill foot y is raised by the slope; arms out 0.4; tail counter-tilts −slope × 1.5; spine bend toward uphill 0.05. |
| Falling leaf or insect | eyes track first (2–4 f ahead of the head) on its arc; the head follows with 70 % amplitude; pawing with the near arm at the end (3 quick swipes of 6 f). |
| Floating on a raft | the raft bobs (±4 units, ±0.06 rad, 1.6 s); Rex follows **6 f late** with 120 % rotation; stance width +12; arms out (P14); the tail counter-balances. |
| Sunbeam / dappled shade | 4–7 dapple spots (soft ellipses 20–40 units, `#fff3c4` at alpha 0.25) drifting 6 units/s, clipped to Rex's silhouette; in shade, fills × a cool tint `#dfe8f0` at alpha 0.25. |
| Bump into a small object | the object moves (pebble rolls 20 units, fern sways 0.2 rad); Rex gets a 4 f squash of 0.05 and a surprised blink. |

---

## 10. Forest atmosphere rules

1. **Layers** (parallax factor, value range in L*):

   | Layer | Parallax | L* | Rules |
   |---|---|---|---|
   | Sky | 0 | 85–95 | |
   | Far hills | 0.1 | 70–82 | tinted toward the sky, line dark ≤ 0.35 |
   | Mid forest | 0.35 | 48–64 | cool blue-green |
   | Rex's ground | 1.0 | 70–82 | warm |
   | Foreground leaves | 1.4 | 30–50 | darkest; may soft-blur |

2. **Flora palette** (cool, so warm Rex pops):

   | Token | Hex | L* |
   |---|---|---|
   | jungle | `#6f9f86` | 62 |
   | jungleDark | `#4d7d68` | 49 |
   | fern | `#5f9478` | 57 |
   | leaf | `#6aa27e` | 62 |
   | farFlora | `#9fb7b0` | 73 |

   Ground keeps `#d9c49f`. The big story leaf may stay brighter, but its hue must be ≥ 130°.
3. **Prehistoric plants only**: tree ferns (a tall trunk with a crown of arching fronds), cycads (a short stout trunk with a stiff rosette), horsetails (jointed vertical stalks), conifers (araucaria-style tiers) and ginkgo (fan leaves). **No grass lawns and no dominant flowers.** The ground cover is moss, fallen fronds, roots, pebbles and shell bits.
4. **Light**:
   - One key light per scene; its direction drives Rex's hatch side, highlight offset, rim side and contact-shadow offset (the shadow shifts 6 units away from the light).
   - Times of day: dawn `#f6d9c4` warm pink-gold; noon neutral; rain `#c9d3dc` cool; sunset `#f2b98a` warm.
   - Light shafts through the canopy are soft diagonal quads at alpha 0.12; there are dust motes in the shafts.
   - Morning mist is a low band (alpha 0.25) at ground level of the mid layer.
5. **Wind is gusts**:
   - Gust strength g(x,t) = G · env(t − x/v), with v = 500 units/s; envelope: rise 0.4 s, hold 0.6 s, decay 1.2 s.
   - Sway = g × flex (tall ferns 0.25 rad, cycads 0.08, trunks 0.01), plus a flutter of ±0.06 rad × g at 6–9 Hz on leaves.
   - Things further downwind react later.
6. **Breathing room**: within 40 units around Rex's head, the background must be low-detail and within ±8 L* of one flat value (no busy hatching behind the face).
7. **Creatures react to Rex**: dragonflies and beetles flee from a stomp (within 80 units) and approach when he holds still for more than 3 s; pterosaurs only far away and small.
8. **Gravity**: everything falls at 1200 units/s² (leaves are slowed by drag to a 40 units/s terminal velocity and swing as they fall); nothing floats except in water.

---

## 11. Never do
1. Never make the head smaller than 44 % of his height, the snout longer than the skull behind the eye, or the mouth longer than 45 % of the head width.
2. Never put sharp teeth, rows of teeth, slit pupils, scales drawn as spikes, angry inner-down brows beyond −0.6, or a red mouth bigger than his eye area. Nothing scary, even in the roar.
3. Never let a mouth, tear, blush or brow cross outside the head silhouette, and never draw the face features on top of the head outline.
4. Never leave a gap in Rex's outline, and never put hatching on the face, belly, eye whites or hat.
5. Never move the spots, change the number of back bumps, resize the hat, or let the hat float off the head.
6. Never sink the feet below or float them above the ground line; never omit the contact shadow.
7. Never mirror the eye highlights or the light side when he flips.
8. Never freeze him completely (always a moving hold), never twin the arms or legs, and never slide the feet.
9. Never use the foliage green on Rex or Rex's green on the foliage.
10. No speech or text bubbles from Rex. Sounds and acting only.
11. No downloaded or AI-generated images; everything is Canvas2D shapes and numbers.

---

## 12. Build order (phase 2+) and acceptance criteria

General delivery rules for every round:
- Render to `design/frames/roundN/` as **PNG** at 1920 × 1080 on the paper background, in a **colour** and a **B&W** version.
- Add a `-guides` version with the §2.1 guide lines drawn as thin red lines with labels, plus a numeric readout (head %, eye centres, snout tip x) printed in a corner. The readout is computed from the rig, not typed in.
- Add a `-silhouette` version (Rex filled `#000`, no lines) where the rubric needs it.
- Send a short note listing what changed and any deviations from this Bible.

### Round 1: Rex v2 core in the ¾ view (build this first)
Build `sketch/rex2.js` → `A.rex2`. It contains:
- the new head outline + jaw split;
- the eyes with lids, the brows, the pupils with world-fixed highlights;
- the mouth set M0, M1, M5, M7 (enough to prove the jaw rig, plus M4 open);
- the body, belly, bumps and spots at fixed coordinates, the legs, feet and claw nubs on the ground, and the 2-segment arms parented to the body;
- the 5-segment tail; the hat parented to the head with a spring;
- the contact shadow, the line rules (no gaps, weights, clamp, boil rates) and the new palette tokens;
- the light-direction parameter for the hatching.

Deliverables:
- `r1-model-34-{color,bw,guides,silhouette}.png`: Rex ¾ neutral (E1, P01) at s = 2.2, centred.
- `r1-mouthtest-{color,bw}.png`: M0, M1, M4, M5, M7 side by side (s = 1.6).
- `r1-flip-{color,bw}.png`: Rex facing right and left side by side, with the key light upper-left.

Acceptance (all must pass):
1. The guides readout matches §2.1 within ±2 units, and head % = 49.5 ± 1.
2. The eye centres, sizes and snout tip match §2.2–2.3 within ±2.
3. No mouth pixel is outside the silhouette in M4 (checked on the silhouette image: the outline is unchanged except for the jaw drop).
4. The soles are on y = 0 and the contact shadow is present.
5. The outline is closed (zoom 200 %: no gaps).
6. No hatching inside the face zone or belly.
7. In the flipped Rex, the highlights stay upper-left.
8. In B&W, the belly, body, spots and face separate.
9. The silhouette reads as a baby T-Rex (big head, tiny arm visible in negative space, tail).

### Round 2: Turnaround
- `r2-turnaround-{color,bw,guides}.png`: the five views of §4 on shared guides at s = 1.6.
- `r2-headturn-strip.png`: the head yawing 0→45→90 in 9 steps (every 11.25°).

Acceptance:
1. Every view touches the same guide lines (±2).
2. The front skull width equals the side skull depth ± 6.
3. The landmark counts are identical: 5 bumps, 6+6+3 spots where visible, one hat of the same size.
4. No view looks like a different animal (the reviewer covers the other views and asks "same creature?").
5. The head-turn strip has no pops: features fade in and out over 10°.

### 12.2a Round 2 implementation notes (added after round 1 approval)
- **API**: add `pose.yaw` in degrees (0 front, 45 ¾ default, 90 side, 135 ¾ back, 180 back). `flip` still mirrors. Store the §4 table as `VIEWS[yaw]` keys and interpolate linearly between the neighbouring keys. The ¾ view (round 1) is the master; do not change it.
- **Draw order per view**:
  - Front and ¾ front: tail → far leg → far arm → body → near leg → near arm → head → hat.
  - Side: the same, but the far arm and far leg are mostly hidden.
  - ¾ back and back: arms → body → legs → **tail drawn after the body** (it is nearest the camera) → head → hat.
- **Light**: stays upper-left in screen space for every view; recompute the hatch side per view. The eye highlights stay upper-left too.
- **Pose for the turnaround**: E1 face (M1), arms at rest, tail neutral, look [0,0] in the front view and [0.4,0] in the side view; same hat, same spots, same 5 bumps.
- **Front view**: both eyes the same size (21 × 26), with the outer eye edges ≥ 8 units inside the head outline; mouth M1 symmetric (corners at x ±24); blush (±40,16); the snout reads as a soft muzzle bump with nostrils, not a second head.
- **Side view**: the cranium must still dominate (the snout is ≤ 40 % of the total head length); the single eye sits on the cranium, not on the snout.
- **Back views**: no face pieces at all; the identity comes from the hat rim, the 6 head spots, the bumps down the spine and the tail curl. The ¾ back shows only the far-cheek bump and no eye.
- **Sheet layout**: 1920 × 1080; s = 1.4; view centres at x = 192 + i·384 (i = 0…4); ground y 900. Offset each view's foot point so its **body centre** sits on its column centre (the side view shifts +20 to fit the tail). Label each view.
- **Extra deliverables**:
  - `r2-turnaround-silhouette.png`: every view must be recognisable alone;
  - `r2-turnaround-guides.png`: plus a per-view readout of skull width/depth, eye ry, hat width and the number of bumps and spots visible, computed from the rig;
  - `r2-headturn-strip.png`: 9 heads at yaw 0, 11.25, …, 90, at s = 1.6.

### Round 3: Expressions + mouth chart + face-kit demo
- `r3-expressions-heads-{color,bw}.png`: E1–E24, head-and-shoulders, 6 × 4 grid, s = 1.4.
- `r3-expressions-body-{color,bw}.png`: E2, E3, E10, E12, E13, E22, full body.
- `r3-mouths.png`: M0–M15 at s = 2.
- `r3-facekit.png`: each control at its minimum, middle and maximum.

Acceptance:
1. Each expression reads in < 0.5 s at phone size (the reviewer views it downscaled to 360 px wide).
2. The §5.1 distinctness pairs are clearly different.
3. Head volume is kept in M4, M9, M10 and M15.
4. The tears, blush and sweat sit on the head surface when tilted ±0.25.
5. The brows never look angry.

### Round 4: Poses + silhouettes
- `r4-poses-{color,silhouette}.png`: P01–P20.

Acceptance:
1. Each pose reads in silhouette (the reviewer names it from the black version).
2. Arms and tail have negative space in P02, P03, P13, P14 and P18.
3. P19's hand reaches the mouth.
4. No tangents at the ground (P10's tail) or between the hands and the belly.

### Round 5: Motion strips and clips
- For each of idle+blink, walk, waddle-run, hop, big jump, head turn, shake-dry, startle and sneeze: `r5-<name>-strip.png` (every 2nd frame, with a ground line and foot-lock tick marks) **and** `r5-<name>.webm` (or an mp4 clip).

Acceptance:
1. The frame counts and timings match §8 ±1 f.
2. No foot sliding (the foot-lock marks stay put).
3. The tail lags 6–8 f with an overshoot, and the hat spring settles in about 20 f.
4. The head, tail tip and hops travel on arcs.
5. Volume is kept in squashes; no twinning.
6. The face boil is subtle.

### Round 6: Forest reactions
- Clips + strips for: wind gust, raindrop on the nose, heavy rain → shake-dry, cold, puddle splash, sunbeam, raft balance, slope.

Acceptance:
1. Every §9 response is present with its numbers.
2. Gust phase delay is visible across the scene.
3. The wet and mud looks appear and fade on schedule.
4. The contact shadow is always correct.

### Round 7: Forest atmosphere
- `r7-atmos-{dawn,noon,rain,sunset}.png` with Rex placed mid-ground, plus `r7-atmos-shade-vs-sunbeam.png`.

Acceptance:
1. The §10 layers and L* ranges are met (a measured sample point per layer is printed on the guides version).
2. Rex vs the background has ΔL* ≥ 12 and Δhue ≥ 40° (or a rim).
3. Only prehistoric flora.
4. Rex's shading side matches the scene light in every image.
5. The breathing room around the face is respected.

After round 7 is APPROVED: migrate the episodes from `A.rex` to `A.rex2` (the expert reviews one re-rendered shot per episode before the full re-render).

---

## Changelog
- **v1.1 (round 1 review)**:
  - mouth anchors moved right (A x 14 → 22) so the mouth clears the near eye, and the jaw hinge → HC(14,26);
  - the jaw rotation + drop approved (0.7 × 0.38 rad + 10 units);
  - the M4 "D" shape rule; teeth 6 × 6;
  - brow tilt 8 → 12 units; lid edges are arcs that tilt with the brow;
  - M7 is a clean arc;
  - blush is feathered, `#f7a1a6` at alpha 0.7, with new positions;
  - E1 lidLo 0 (a lower lid below 0.15 is not drawn, as approved);
  - §2.3 adds a far-eye pupil rule (below);
  - §2.5 changes the bumps, spot C and S1–S3;
  - §2.6 changes the far foot overlap.
- **v1.2 (round 1b review)**:
  - the near mouth corner is locked at y ≥ 22, and corners act on F and B; the M1 tick ends at (21,19);
  - lower-lid coverage 1.0 × lidLo, capped at 0.45, with pupils lifted;
  - sad lid tilt 0.40;
  - M7's far end is at (66,28);
  - §6 open-mouth outline continuity rule (below).
- **v1.3 (round 1c review)**:
  - the open-mouth silhouette shape (rounded snout underside, round jaw, blended chin);
  - no eye outline below the lower lid;
  - E19 proud is now closed happy eyes;
  - the M1 tick ends at (20,20).
- **v1.4 (round 1d review)**:
  - the open-mouth silhouette now has overbite ≤ 9 at open = 1, the jaw front comes forward, the jaw front is convex, and the upper lip has no cusp;
  - §12 round 2 notes added (§12.2a).
- **v1.5 (round 2 review)**: added §4.1 view overrides:
  - a new side head outline (round muzzle, depth 120);
  - the front face layout;
  - far-eye occlusion in head turns;
  - back and ¾-back tail paths;
  - back-view arms;
  - ¾-back cheek stroke;
  - body view-switch rule.
- **v1.6 (round 3 review)**:
  - open-mouth amendment (no lip notch, overbite ≤ 5, a new jaw front);
  - upper-lid outline rule (no empty rings; wide eyes stay ≥ 6 inside the outline);
  - E13 and E22 body cue for the arms (§7 note).
- **v1.7 (round 4 decision)**:
  - arms: option (b) + staging; shoulder (42,−98), arm 18 + 16 + hand 9 × 8; raised-arm rule; no stretch on holds;
  - P11 is a dedicated curl shape;
  - P03, P04, P13, P18 and P20 re-specified.
- **v1.8 (round 4b key)**: the confused pairs P03/P08, P04/P06 and P05/P19 have new, distinct silhouette rules.
- **v1.8a (round 4c key)**: P03 / P17 / P20 have unique silhouette features (see `reviews/round4c_review.md` §5); these override the P03, P17 and P20 rows in §7. Only P03's tail may rise above y −120.
- **v1.8b (round 4d)**:
  - P16 look up: headTilt −0.45, bend −0.12, both hands forward-up (−0.3, handClear ≥ 8), tail −0.15, M6 open 0.5. Signature: the snout points at the sky.
  - P01: bend 0, headTilt 0 (the reference).
