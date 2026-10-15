# Episode 0, test frames round 1: director's review

Frames reviewed: `_social/videos/rex/adventures/review/ep0-<t>-bw.jpg` and `-color.jpg` at 5, 20, 34, 44, 57, 63, 70, 76, 83, 91, 100, 106, 114, 120, 131, 138, 145, 153, 163, 170 and 178 s (42 images).
Shot numbers and timings refer to `ep0_ep1_shotlist.md`.

**Overall:** the skeleton is there. The chain geography (rock on ledge → pebble pile → slope → nest → leaf) reads, the narration strips and end card work, the beetle is charming, and the cooling of the light at the end works. But it does not yet look like the owner's pencil sketch. It looks like flat vector clip-art with one mechanical hatch pattern. Rex looks like a gecko, not the chubby baby T-Rex in the reference. Several continuity and physics bugs also break the domino chain. Score: 2 shots approved, 19 need changes.

---

## Your simplifications

| Simplification | Verdict |
|---|---|
| S19 tail chase with quick left/right flips + squash instead of a 6-view turnaround | **Accepted**, on three conditions. (1) Each flip is preceded by a 3-frame anticipation squash (scaleX 0.85). (2) His head clearly turns back toward the tail before every flip. (3) The beat ends with the tail across his lap and a giggle. Use 4 flips over 2.5 s, then the dizzy plop. |
| Title signs drop and swing; narration on a torn-paper strip at the top | **Accepted.** The strip placement is good. See S05 for the Telugu shaping bug on the plank. |
| Lighting: peach dawn → warm sunbeam on egg (S14–S16) → blue-grey from 152 s | **Accepted as a plan.** The sunbeam itself must be redrawn (see S14). |

---

## Per-frame notes

### 5 s · S01 narration line 1: CHANGES NEEDED
- Good: the Telugu shaping is correct (క్రితం renders right), the strip size is right and the layout is calm.
- **Bug:** the mountain reveal is a rectangular clip. At x≈770 the grey fill stops in a hard vertical edge. Reveal only the outline stroke first (stroke-dash offset along the path), with the "pencil tip" leading. Fade the fill/hatch in 1 s *behind* the line, never with a straight clip edge.
- The ridge line is a thin, even 1 px vector line. Make it a pencil line: 2 passes with ±1 px jitter, width varying 1.5–3 px, darker at the peaks.
- COL: the mountain is a flat grey slab. Use a pale blue-grey wash that fades out toward the base (gradient to 0 % alpha), so the paper shows through.

### 20 s · S03 narration line 3: CHANGES NEEDED
- **The ground is one giant floating ellipse.** It ends at x≈1400 with blank paper on the right, and the cliff on the right floats on nothing. Extend the ground across the full width with a gently uneven top edge. Add a darker foreground band (L4 ferns) along the bottom so the frame has a base.
- **The waterfall:** B&W is nearly invisible. COL is a blue capsule/pill standing in front of the cliff, with rounded top and bottom. Redraw it as a strip that starts at a notch in the cliff top edge, falls straight, and widens slightly toward the bottom. Use white streak lines scrolling down and a foam cloud at the base (3–4 overlapping white puffs, not a white bar). In B&W, darken the cliff around it so the white water reads.
- **The cliffs** have horizontal ruled lines, so they look like notebook paper or barrels. Use vertical-ish rock strata with cracks, a few ledges, and cross-hatching on the shadow side only.
- The far mountain range ends in a bulbous blob on the right (also at 44, 57, 63, 70, 83, 100, 114, 153, 163). Give it a proper sloping ridge that goes out of frame.
- No palms or ferns pop in yet (the plan has them from 19 s). Add 2–3 palms on the cliff tops.
- The sun is tucked under the narration strip. Move it 120 px lower and left so it is clearly in the sky.

### 34 s · S05 title card: CHANGES NEEDED
- Good: the signs, ropes, "EPISODE 0" and the hierarchy all work.
- **Telugu shaping bug on the subtitle plank:** "రెక్స్" renders broken (the స-vattu/virama falls apart into a separate glyph after క్). The plank uses a display font without Telugu shaping. Render all Telugu on planks with the same font/path as the narration strips (Noto Sans Telugu or Mandali via headless Edge, or pre-rendered PNGs). Check every conjunct: రెక్స్, పుట్టాడు, క్రితం.
- The planks have ruled horizontal lines, so they look like lined paper. Draw wood: 2–3 wavy grain lines per plank, one knot (small ellipse with rings), and darker hatching at the plank ends.
- Add the leaf sprig on the top-left corner of the big sign, as in the reference (it flutters).
- The background behind the signs is busy: the nest, egg and big leaf are all visible and the egg is huge. Blur it 4 px and lighten it 30 % during the title, so the title owns the frame and the chain is not spoiled.

### 44 s · S06 the breeze: CHANGES NEEDED
- **Timing:** the leaf is already detached and falling. It must stay on the branch until it snaps at 49.0. At 44 it should only flutter.
- **The breeze is invisible:** 2 faint straight lines. Wind-lines must be curly S-strokes with a small curl at the head, 2–3 px, mid-grey (COL: pale mint), 3–4 visible at once, travelling left → right. Without them the chain has no cause.
- The branch is a sausage stuck onto the trunk. Taper it from the trunk (thick) to the tip (thin), add 1–2 twigs, and show the leaf stem attached to a twig.
- The leaf is about 50 px long, too small to follow. It is the hero of S07–S09: make it 140–180 px at this framing, heart-shaped with a clear midrib, and give it a white rim in B&W.
- The camera should end on a medium of the branch (push 100 → 115 %). This is still a wide.

### 57 s · S08 leaf landing: CHANGES NEEDED
- **Timing:** the leaf has already landed. It should land at 58.2; at 57 it is in its last swing, about 40 px above the rock. A minor issue.
- **Framing:** this is a static wide, not the planned tilt-down ending on a medium wide of the rock. At this size the leaf is about 60 px and unreadable on a phone. End the tilt so the rock is about 35 % of frame height.
- **The tree trunk floats.** It ends above the ground line in a rounded sausage bottom (also at 63, 70, 153). Give it a flared base with 2–3 roots going *into* the ground, drawn after the ground layer.
- **Egg and nest:** the egg is larger than the nest, leans outside it, and is lumpy like a potato. The nest is a flat tilted doormat. Fix:
  - Nest = a bowl: a back rim (drawn behind the eggs) + a front rim (drawn in front), twigs sticking out, about 2.2× egg width.
  - Egg = a smooth oval (ellipse, height 1.3× width), cream with 6–8 soft speckles, sitting *inside* the bowl with its lower third hidden by the front rim.
  - Show **2** empty broken half-shells (only 1 is visible).

### 63 s · S09 rock tips: CHANGES NEEDED
- **Framing:** the plan is a close-up, with the rock filling about 60 % of the frame and the pebble pile soft behind it. This is a medium wide. This shot is a key beat of the chain; go close.
- **The tilt isn't visible:** by 63.0 (inside the slow-mo) the rock should be leaning about 20–25°. Make the tilt obvious, pivoting on the tiny base pebble, and show daylight under the lifted side.
- The leaf floats above the rock's edge. Seat it on the surface (rotate it to the surface normal, 2 px overlap).
- The pebble pile looks like a stack of biscuits or a pine cone (same pentagon shape repeated in rows). Draw 7–9 round pebbles of different sizes in a heap: bigger at the bottom, one balanced on top.

### 70 s · S10 pile hit: CHANGES NEEDED (critical bug)
- **The big rock has sunk into the hillside.** It is drawn below the ledge line, half inside the ground, and stays there at 76, 83 and 153. Per the plan, the rock rolls **right along the ledge** into the pile, stops on the ledge, and rocks back and forth. Fix the physics/draw order: rock y is clamped to the ledge surface and it is drawn after the ground.
- The pile is already breaking up while the rock is still to the left of it, far away. Contact must come first (at 68.0), then the pebbles let go.
- The leaf stands upright on the ground like a sign (also at 153). After sliding off the rock it should lie flat or rest tilted against a grass tuft, at most 15° from flat.
- This is the slow-mo hit: frame it medium on the pile, not wide.

### 76 s · S11 pebbles hit the nest: CHANGES NEEDED
- The pebbles sit in a neat row of 7 inside the nest like beads. The beat is: they **bounce off the rim**, a twig flips up, and one lands in an empty shell ("ding"). Give each pebble a different bounce arc and resting place. Leave 2–3 in or near the nest, and let the rest roll on past.
- The nest/egg problems from 57 s apply here too. The egg stands outside the nest, taller than the nest is deep.
- The big rock is still embedded in the hill (see 70 s).
- The framing is OK-ish, but push in to a medium on the nest (the plan has 100 → 108 %).

### 83 s · S12 nest slides: CHANGES NEEDED
- **The big leaf is a lollipop tree:** a 450 px oval on a thin stalk standing on flat ground, far from the slope. It must be a **low, broad elephant-ear leaf** growing at the bottom of the slope:
  - its base is on the ground,
  - its blade curves up and slightly over,
  - it is about 3× egg height,
  - the egg can roll *into* it like a cushion.
  The same leaf is Rex's shelter in S17–S23 and the raft in Episode 1, so get its design right now.
- The pebbles lie in a single neat line down the slope. Scatter them (irregular spacing, some in clumps of 2).
- Rock embedded (see 70 s). Waterfall pill (see 20 s).

### 91 s · S13 egg rolls: CHANGES NEEDED
- **Camera:** the plan is a low-angle dolly at ground level. The camera here is high (ground fills the lower 45 %, horizon high). Drop the camera: horizon at about 75 % of frame height, the egg large (about 25 % of frame height), foreground grass blurred and sliding past.
- **The egg looks embedded:** it sits below the slope-end line with no contact shadow, so it reads as sunk into the ground. Add a soft elliptical contact shadow under it and make sure its bottom touches the ground line.
- The egg is still potato-shaped. Use a smooth ellipse; rotation is enough to make it wobble.
- The big leaf is far from the egg's path (see 83 s).

### 100 s · S14 hush: CHANGES NEEDED
- **Continuity:** the egg must be **resting against the leaf**. Here it is about 300 px from the leaf stem with nothing touching it. This is the whole point of "stops against a leaf".
- **The sunbeam is a hard-edged polygon** with a visible straight bottom edge across the middle of the frame (also at 106 and 114). Make it a soft shaft:
  - a linear gradient along its length, fading to 0 at both ends,
  - a 30–40 px blur (`ctx.filter = 'blur(30px)'` on an offscreen layer),
  - additive/screen blend at 20–25 %,
  - ending *on the egg*, not across the frame.
- The egg outline is faint on the top half and dark on the bottom half (also at 106 and 114). Give it one consistent outline weight, with only a slightly heavier stroke on the shadow side.
- The push-in should end at 140 %. The egg is only about 22 % of frame height here; it should be about 40 %.

### 106 s · S15 crack: CHANGES NEEDED
- The crack is a smooth sine wave ("MMM"). Draw a **jagged zigzag** with sharp corners and uneven segment lengths (5–7 segments), dark 3 px. Add one small triangular chip missing at the top (a dark gap with a lighter inner edge), and 2 tiny chips flying.
- **Framing:** a close-up with the egg at about 50 % of frame height. Here it is about 27 %.
- Same sunbeam and outline issues as at 100 s.

### 114 s · S16 peeking: CHANGES NEEDED
- **The eye slit reads as a fanged mouth.** The dark ellipse with the zigzag crack teeth around the eyes looks like a monster grin. Fix:
  - Lift the top shell like a lid. The gap is above the zigzag line, so the zigzag is the lid's bottom edge and stays above the eyes.
  - Fill the gap with soft dark shading, not solid black.
  - Make the eyes big (each about 22 % of egg width), with 2 highlight dots each.
  - Add the top of Rex's head/brow just visible above the eyes.
- **The lid is semi-transparent:** background hatching shows through it. All shell and character fills must be opaque (globalAlpha 1); only the washes are translucent.
- A stray crack line continues outside the egg outline on the right (x≈1080–1130). Clip the crack to the egg shape.
- **Framing:** the plan is an extreme close-up on the top of the egg. This is a medium.

### 120 s · S17 pop / hat: CHANGES NEEDED (character design)
- **Rex does not match the reference.** He reads as a gecko or lizard. Compared with the owner's sketch:

| Element | Now | Needed (reference) |
|---|---|---|
| Head | small, long pointed snout | **big round head** (about 45 % of total height), short rounded snout with a broad smile line |
| Eyes | one visible, profile | **¾ view, both eyes visible**, huge, round and shiny, 2 highlight dots each |
| Body | lean, upright, stripe belly | **chubby pear body**, round belly patch, short thick legs |
| Spots | small dabs | clear round spots on head and back |
| Back | small triangle spikes | row of soft rounded bumps down the back |
| Tail | thin | short and thick at the base |

  Make the ¾ view the default pose and build the 12 poses from it.
- **Expression:** at 120 the plan is startled → wide-eyed. Here a raised brow plus a half-smile reads as sly or smug. For wide-eyed: brows high and arched, small open "o" mouth.
- Shell bits are stuck on his tail, belly and hand like patches. Drop most of them. Leave only the bottom-half shell he sits in, plus 3–4 pieces on the ground.
- The hat piece is mid-air over the leaf at 120 (fine, it lands at 121.0). Give it a motion trail (3 ghost copies at 20 % alpha) so the arc reads.

### 131 s · S18 sneeze: CHANGES NEEDED
- Good: the hat on his head reads well and the pollen dots are there.
- **His snout is pressed into the leaf stem.** Move Rex about 180 px left of the stem in all S17–S20 shots, so his silhouette is clean.
- **His head is transparent:** the body outline and arm are visible through the jaw and neck (also at 120, 138, 145 and 170). Draw order: tail → body → legs → arms → head, all fills opaque.
- The red disc at the mouth looks like a clown nose or ball. For the sneeze build-up, use: head tilted back 15°, eyes squeezed (two arcs), nostrils flared, mouth slightly open. Remove the disc. The sneeze itself is a small white puff burst.
- The planned close-up is head and shoulders; this is waist-up with the feet cropped. Either go closer or show the full body. Avoid cutting at the feet.

### 138 s · S19 tail: CHANGES NEEDED
- At 138 he should be mid tail-chase. Here he is sitting in exactly the 120 pose, looking forward, with his tail still. Use the accepted flip method: head turns back to the tail, flip, squash, tail wiggle leading him.
- Raise his brows. The current low, flat brow reads as grumpy or suspicious in every Rex frame.

### 145 s · S20 beetle: CHANGES NEEDED (minor)
- Good: **the beetle design works.** It is shiny, round and friendly, has antennae, and is very readable in both versions. Rex's eyes look at it. This is the best Rex frame so far.
- Fix the head transparency (see 131 s) and raise the brows (curious = brows up, slight head tilt of 12°).
- Go lower and closer, per the plan: a low-angle close-up, Rex's head entering from the left, the beetle walking along the **leaf edge** at eye level, with a rack focus.

### 153 s · S21 POV of the empty jungle: CHANGES NEEDED
- Good: the empty nest with two shells reads clearly, and the idea of the POV pan works.
- **Continuity bugs:**
  - the big rock is still sunk in the hillside;
  - the leaf stands upright like a sign;
  - the pebbles are in a neat line;
  - the nest is now at a different place and angle than where it stopped in S12 (it should be caught on the root, tilted 20°).
- **Light:** the cooling should start at 152. Have a cloud edge entering frame toward the sun, and drop the brightness 5–10 % by the end of the pan.
- To sell it as a POV, add a very soft vignette and slow the pan slightly.

### 163 s · S22 cold wind: CHANGES NEEDED
- Good: COL desaturation and blue-grey are right, and the tumbling leaf particles work well.
- **Expression:** his eyes are closed, which reads as sleeping or content. He should be **sad and shivering**: eyes open, inner brows raised, mouth corners down, arms tucked in, tail wrapped round.
- **The leaf shape changes:** here the big leaf is long and pointed; at 91–145 it was a round oval. Use one leaf design throughout (the elephant-ear leaf, see 83 s).
- The wind-lines are thin and nearly invisible. Make them longer, curlier and greyer than in S06 (8 at once).
- COL: Rex melts into the grey. Keep him about 15 % warmer and lighter than the background (a slight warm rim light on his back).
- B&W: the hatch density barely changed. Increase it clearly on the sky and cliffs (cross-hatch layer at 40 % opacity), so the B&W version also "gets cold".

### 170 s · S23 the cry: CHANGES NEEDED
- Good: the framing (close-up), the tears (one welling up, one on the cheek) and the leaves in the wind are all right.
- **Expression reads grumpy, not sad.** The brow is a flat straight line and the mouth a flat line. For the cry:
  - inner ends of the brows raised (a "/ \" shape),
  - eyes slightly squeezed and glossy (larger highlights),
  - mouth open in a soft wail shape: rounded, wider at the bottom, lower lip trembling,
  - head tipped back a little at 170.0.
  Keep it gentle, not a scream.
- Head transparency (see 131 s). Lollipop leaf (see 83 s).
- The leaf should curl toward him like a hug (8°). That beat is missing.

### 178 s · S24 end card: APPROVED (one minor fix)
- The Telugu renders correctly (ఇంకా ఉంది..., తరువాత: మెరిసే వాన చినుకులు). The fade to paper and the layout are good.
- Minor: the second strip's bottom edge touches Rex's hat. Move both cards up 120 px so the tiny crying Rex is fully visible below them: he is the last image of the episode.

### 5 s and 178 s strips: narration/end-card text: APPROVED
The text treatment (strip, sizes, Telugu above English) is approved for the whole series. Only the plank font (S05) needs the shaping fix.

---

## Global look fixes (apply everywhere)

1. **Pencil, not vector.**
   - Outlines: draw every path twice with ±0.8 px jitter, vary the width 1.2–3.5 px along the stroke (darker and thicker on the shadow side and at corners), and break the line in 1–2 places on long edges.
   - Hatching: today every object has the same 45° hatch at the same spacing. Instead:
     - vary the angle per object (±20°),
     - spacing 5–10 px,
     - random stroke length,
     - only on the shadow side (the half away from the sun),
     - with a second cross-hatch layer for the darkest areas.
   - Leave real white paper on the lit side.
2. **Value contrast in B&W.** Most B&W frames are one mid-light grey, so objects merge (egg vs ground, waterfall vs cliff). Give each chain hero (leaf, rock, pebbles, nest, egg, Rex) a dark outline and a white rim on the sun side, and keep the backgrounds lighter and softer than the foreground.
3. **One leaf, one egg, one nest, one rock**, each with a fixed design and a fixed position/state between shots (keep a state table: rock on the ledge after 70 s, nest caught on the root at 20° after 84 s, leaf flat by the rock after 66 s).
4. **Opaque fills** for all characters and props; translucency only for washes, light and mist.

---

## Top 5 fixes, in priority order

1. **Redesign Rex to match the reference.** A big round head, a short smiling snout, huge round eyes in ¾ view with 2 highlights, a chubby pear body and soft back bumps. Fix the head transparency and draw order, and correct the expressions (wide-eyed, curious, sad and crying all currently read as smug or grumpy). Without this the episode isn't "Rex".
2. **Fix the domino chain's physics and continuity.**
   - The rock must stay on the ledge (it currently sinks into the hill from 70 s on).
   - Contact comes before reaction.
   - The pebbles scatter naturally.
   - The nest becomes a real bowl, the egg a smooth oval inside it.
   - The leaf lies flat after it slides off the rock.
3. **Replace the lollipop leaf with a low elephant-ear leaf** at the foot of the slope. The egg rolls into it and rests against it (S13–S14), and it shelters Rex. Keep one design for both episodes.
4. **Use the planned close-ups on the key beats:**
   - S09 rock tipping: close-up.
   - S10 pile hit: medium.
   - S13 egg roll: low angle.
   - S14–S16 egg: 40–50 % of frame, extreme close-up for the peek.
   - S20 beetle: low close-up.
   Also make the falling leaf 3× bigger, so a child on a phone can follow every link.
5. **Make it look like pencil and paper.** Variable, jittery outlines; shadow-side-only hatching with varied angles; no ruled lines on cliffs or planks; a real waterfall (not a pill); a soft blurred sunbeam (not a polygon); no clip-edge reveals; ground across the full width. Also fix the Telugu shaping on the title plank.

## B&W or colour?

**Colour is more attractive right now.** The green Rex separates from the tan ground, the lime leaf and cream egg are easy to follow through the chain, and the drain to blue-grey at 163–178 s really lands the sad mood. The B&W frames are low-contrast: almost everything is the same light grey with the same hatch, so the chain heroes and the waterfall disappear.

B&W can still win, because it is closer to the owner's reference. To get there it needs fix 5 plus real value contrast: darker graphite outlines, cross-hatched shadows, white paper highlights, and the egg and Rex as the brightest shapes in frame. I would judge the two versions against each other again after round 2.
